# BTLTech Website

BTLTech Ltd website with document upload functionality for printing services.

## Features

- Professional website design with Tailwind CSS
- Document upload form for printing services
- Email notifications via Resend (free tier)
- Responsive design for mobile and desktop
- PWA capabilities

## Setup

### 1. Resend Email Setup (Free!)

Resend provides 3,000 free emails per month - perfect for your needs!

#### Create a Resend Account:
1. Go to [resend.com](https://resend.com)
2. Click "Sign up" and create your account
3. Verify your email

#### Get Your API Key:
1. Go to API Keys in your dashboard
2. Click "Create API Key"
3. Name it "BTLTech Website"
4. Copy the API key (starts with `re_`)

#### Environment Variables for Netlify:
Add this environment variable in your Netlify dashboard:

```
RESEND_API_KEY=re_your_api_key_here
```

### 2. Domain Verification (Optional but Recommended)
For better deliverability, verify your domain:
1. In Resend dashboard, go to Domains
2. Add `btltech.co.uk`
3. Follow the DNS verification steps

### 3. Dependencies

Install dependencies:
```bash
npm install
```

### 4. Local Development

Start a local server:
```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080` to view the site.

### 5. Testing the Document Upload

Test the function locally:
```bash
cd netlify/functions
RESEND_API_KEY=re_your_key node test-document-upload.js
```

## Deployment

The site is configured for Netlify deployment with serverless functions. Push to your main branch to trigger automatic deployment.

## Email Limits

- **Resend Free Tier**: 3,000 emails/month, 100 emails/hour
- Function limits uploads to 10 files per submission
- Perfect for <10 emails/day usage!
