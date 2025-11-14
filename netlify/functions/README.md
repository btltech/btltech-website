# IMEI Lookup Netlify Function

This folder contains a Netlify serverless function that proxies IMEI lookup requests to an upstream provider with the server-side API key.

Files:
- `imei-lookup.js` - original simple version used by site.
- `imei-lookup-enhanced.js` - enhanced version with Luhn validation, in-memory cache, rate-limiting.
- `test-imei-lookup.js` - small Node script to locally invoke the function handler.

Environment variables the function expects:
- `IMEI_API_KEY` (required) - key to call upstream IMEI provider
- `IMEI_API_BASE` (optional) - base URL of upstream provider
- `IMEI_CACHE_TTL_MS` (optional) - cache TTL
- `IMEI_CACHE_MAX` (optional) - maximum number of cached entries
- `IMEI_RATE_WINDOW_MS` (optional) - rate limit window
- `IMEI_RATE_MAX` (optional) - maximum requests per IP inside window

Local test:

```bash
# run test (set IMEI_API_KEY in env)
IMEI_API_KEY=abc node netlify/functions/test-imei-lookup.js
```

Notes & Recommendations:
- For production, prefer using Netlify Environment variables (site settings) to set `IMEI_API_KEY`.
- The in-memory cache and rate-limiter are per-lambda instance and will not be shared across cold starts. For reliable global rate-limiting and shared caching, use Redis or Cloudflare Workers KV.
- Use `netlify dev` for local testing with Netlify functions if you need a more realistic environment.
