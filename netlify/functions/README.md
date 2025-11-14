# Netlify Functions

This folder contains Netlify serverless functions for the BTLTech website.

## Functions

### 1. IMEI Lookup (`imei-lookup.js`, `imei-lookup-enhanced.js`)
Proxies IMEI lookup requests to an upstream provider with server-side API key.

### 2. Document Upload (`document-upload.js`)
Handles document uploads from the printing page and emails them to info@btltech.co.uk.

## Environment Variables

### For IMEI Lookup:
- `IMEI_API_KEY` (required) - key to call upstream IMEI provider
- `IMEI_API_BASE` (optional) - base URL of upstream provider
- `IMEI_CACHE_TTL_MS` (optional) - cache TTL
- `IMEI_CACHE_MAX` (optional) - maximum number of cached entries
- `IMEI_RATE_WINDOW_MS` (optional) - rate limit window
- `IMEI_RATE_MAX` (optional) - maximum requests per IP inside window

### For Document Upload:
- `SENDGRID_API_KEY` (required) - SendGrid API key for sending emails
- `FROM_EMAIL` (optional) - Email address to send from (defaults to noreply@btltech.co.uk)

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Environment Variables in Netlify:**
   - Go to your Netlify site dashboard
   - Navigate to Site Settings > Environment Variables
   - Add the required variables listed above

3. **SendGrid Setup:**
   - Sign up for a SendGrid account at https://sendgrid.com
   - Create an API key with "Full Access" permissions
   - Verify your sender email address (info@btltech.co.uk)
   - Add the API key as `SENDGRID_API_KEY` in Netlify environment variables

## Local Testing

### IMEI Lookup:
```bash
# Set environment variable
export IMEI_API_KEY=your_api_key_here

# Run test
node netlify/functions/test-imei-lookup.js
```

### Document Upload:
```bash
# Set environment variables
export SENDGRID_API_KEY=your_sendgrid_key_here
export FROM_EMAIL=noreply@btltech.co.uk

# Use netlify dev for local testing
netlify dev
```

## Notes & Recommendations

- For production, prefer using Netlify Environment variables (site settings) to set API keys
- The in-memory cache and rate-limiter are per-lambda instance and will not be shared across cold starts
- For reliable global rate-limiting and shared caching, use Redis or Cloudflare Workers KV
- Use `netlify dev` for local testing with Netlify functions if you need a more realistic environment
