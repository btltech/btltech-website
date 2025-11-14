// Enhanced Netlify Function: IMEI lookup
// - Validates IMEI format with Luhn
// - Adds simple in-memory TTL cache to reduce upstream calls
// - Adds per-IP rate limiting (best-effort; for real-scale use, add an external store)
// - Better error messages and logging

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL_MS = Number(process.env.IMEI_CACHE_TTL_MS) || 1000 * 60 * 60; // 1 hour
const CACHE_MAX_ENTRIES = Number(process.env.IMEI_CACHE_MAX) || 200;

// Rate limiting per-IP (in-process; not shared across instances)
const RATE_LIMIT_WINDOW_MS = Number(process.env.IMEI_RATE_WINDOW_MS) || 60 * 1000;
const RATE_LIMIT_MAX = Number(process.env.IMEI_RATE_MAX) || 30; // 30 requests per minute
const ipRecords = new Map();

// Validate IMEI using Luhn (15 digits)
function isValidImei(imei) {
  if (!/^[0-9]{14,15}$/.test(imei)) return false;
  // if it's 14 digits, some tools may add a check digit; allow 15 ideally
  const digits = imei.split('').reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let v = digits[i];
    if (i % 2 === 1) {
      v *= 2;
      if (v > 9) v -= 9;
    }
    sum += v;
  }
  return sum % 10 === 0;
}

function getClientIp(event) {
  // Prefer `x-forwarded-for` header, fallback to Cloudflare or netlify forwarded values
  const headers = event.headers || {};
  const xff = headers['x-forwarded-for'] || headers['X-Forwarded-For'] || '';
  if (xff) return xff.split(',')[0].trim();
  return event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp;
}

function checkRateLimit(clientIp) {
  if (!clientIp) return true; // unknown, allow
  const now = Date.now();
  const rec = ipRecords.get(clientIp) || { count: 0, since: now };
  if (now - rec.since > RATE_LIMIT_WINDOW_MS) {
    rec.count = 1;
    rec.since = now;
  } else {
    rec.count += 1;
  }
  ipRecords.set(clientIp, rec);
  return rec.count <= RATE_LIMIT_MAX;
}

function setCache(k, v) {
  // Keep cache size bounded
  if (cache.size >= CACHE_MAX_ENTRIES) {
    // remove oldest
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(k, { value: v, expires: Date.now() + CACHE_TTL_MS });
}

function getCache(k) {
  const rec = cache.get(k);
  if (!rec) return null;
  if (rec.expires < Date.now()) {
    cache.delete(k);
    return null;
  }
  return rec.value;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const params = event.queryStringParameters || {};
    const query = (params.imei || params.q || '').trim();
    if (!query) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing imei (use ?imei=) ' }) };
    }

    // Basic validation
    const normalized = query.replace(/[^0-9]/g, '');
    if (!isValidImei(normalized)) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid IMEI' }) };
    }

    // Rate limit
    const ip = getClientIp(event);
    if (!checkRateLimit(ip)) {
      return { statusCode: 429, headers: corsHeaders, body: JSON.stringify({ error: 'Rate limit exceeded' }) };
    }

    // Cache
    const cacheKey = `imei:${normalized}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return { statusCode: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...cached, _cached: true }) };
    }

    const apiKey = process.env.IMEI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Server not configured: IMEI_API_KEY missing' }) };
    }

    const base = process.env.IMEI_API_BASE || 'https://alpha.imeicheck.com/api/free_with_key/modelBrandName';
    const url = `${base}?key=${encodeURIComponent(apiKey)}&imei=${encodeURIComponent(normalized)}&format=json`;

    const upstream = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const text = await upstream.text();
    if (!upstream.ok) {
      return { statusCode: upstream.status, headers: corsHeaders, body: text || JSON.stringify({ error: 'Upstream error' }) };
    }

    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON from upstream', details: String(e && e.message || e) }) };
    }

    // Add normalized fields and cache
    const brand = parsed.brand || (parsed.object && parsed.object.brand) || '';
    const name = parsed.name || (parsed.object && parsed.object.name) || '';
    const modelCode = (parsed.object && parsed.object.model) || '';
    const normalizedResponse = {
      ...parsed,
      brand,
      make: brand,
      model: name || modelCode,
      model_name: name || modelCode,
      model_code: modelCode
    };

    setCache(cacheKey, normalizedResponse);

    return { statusCode: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(normalizedResponse) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Server error', details: String(err && err.message || err) }) };
  }
};
