// Netlify Function: IMEI lookup proxy
// Reads IMEI from query string and calls upstream provider with server-side API key

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

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
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing imei' }) };
    }

    const apiKey = process.env.IMEI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Server not configured: IMEI_API_KEY missing' }) };
    }

    const base = process.env.IMEI_API_BASE || 'https://api.imeicheck.com/v1/lookup';
    const url = `${base}?imei=${encodeURIComponent(query)}`;

    const upstream = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      return { statusCode: upstream.status, headers: corsHeaders, body: text || JSON.stringify({ error: 'Upstream error' }) };
    }

    // Pass through JSON body
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: text
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Server error', details: String(err && err.message || err) }) };
  }
};


