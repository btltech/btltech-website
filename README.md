# BTLTech Website

BTLTech Ltd website with document upload functionality for printing services.

## Features

- Professional website design with Tailwind CSS
- Document upload form for printing services
- Email notifications via SendGrid
- Responsive design for mobile and desktop
- PWA capabilities

## Setup

### 1. SendGrid Email Setup

The document upload feature uses SendGrid for sending emails. Follow these steps:

#### Create a SendGrid Account:
1. Go to [sendgrid.com](https://sendgrid.com)
2. Click "Start for Free"
3. Sign up with your email

#### Create an API Key:
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name it "BTLTech Website"
4. Select "Full Access" permission
5. Copy the API key

#### Environment Variables for Netlify:
Add these environment variables in your Netlify dashboard:

```
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@btltech.co.uk
```

### 2. Dependencies

Install dependencies:
```bash
npm install
```

### 3. Local Development

Start a local server:
```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080` to view the site.

### 4. Testing the Document Upload

Test the function locally:
```bash
cd netlify/functions
SENDGRID_API_KEY=your_key_here node test-document-upload.js
```

## Deployment

The site is configured for Netlify deployment with serverless functions. Push to your main branch to trigger automatic deployment.

## Email Limits

- SendGrid Free Tier: 100 emails per day
- Function limits uploads to 10 files per submission to stay within limits
