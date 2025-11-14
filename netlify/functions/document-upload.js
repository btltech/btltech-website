const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, phone, message, files } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !files || files.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name, email, and at least one file are required' })
      };
    }

    // For free tier, limit to 10 files per submission to stay well under limits
    if (files.length > 10) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Maximum 10 files allowed per submission' })
      };
    }

    // Prepare email attachments
    const attachments = files.map((file, index) => ({
      content: file.content, // Base64 encoded content
      filename: file.name,
      type: file.type || 'application/octet-stream',
      disposition: 'attachment'
    }));

    // Email content using SendGrid template
    const msg = {
      to: 'info@btltech.co.uk',
      from: {
        email: process.env.FROM_EMAIL || 'noreply@btltech.co.uk',
        name: 'BTLTech Website'
      },
      templateId: 'd-d95140eaa7414dd4a0d39bad8afe2030', // Your template ID
      dynamicTemplateData: {
        name: name,
        email: email,
        phone: phone || 'Not provided',
        message: message || 'No message provided',
        fileCount: files.length,
        subject: `Document Upload from ${name} - BTLTech Printing Service`
      },
      attachments: attachments
    };

    // Send email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Documents uploaded and emailed successfully!'
      })
    };

  } catch (error) {
    console.error('Error processing document upload:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process document upload. Please try again or contact us directly.'
      })
    };
  }
};