// Simple test script for document-upload Netlify function
// Run with: node netlify/functions/test-document-upload.js

const fs = require('fs');
const path = require('path');

// Mock event object
const mockEvent = {
  httpMethod: 'POST',
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '+44 20 1234 5678',
    message: 'Test document upload for printing services',
    files: [
      {
        name: 'test-document.pdf',
        type: 'application/pdf',
        content: 'dGVzdCBmaWxlIGNvbnRlbnQ=' // Base64 encoded "test file content"
      }
    ]
  })
};

// Mock context object
const mockContext = {};

// Import the function
const { handler } = require('./document-upload.js');

async function testFunction() {
  try {
    console.log('Testing document-upload function...');
    console.log('Mock data:', JSON.parse(mockEvent.body));

    const result = await handler(mockEvent, mockContext);

    console.log('Status Code:', result.statusCode);
    console.log('Response:', JSON.parse(result.body));

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run test if RESEND_API_KEY is set
if (process.env.RESEND_API_KEY) {
  testFunction();
} else {
  console.log('Please set RESEND_API_KEY environment variable to run this test');
  console.log('Example: RESEND_API_KEY=re_123456789 node test-document-upload.js');
}