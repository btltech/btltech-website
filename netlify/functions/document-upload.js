const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // For free tier, limit to 10 files per submission
    if (files.length > 10) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Maximum 10 files allowed per submission' })
      };
    }

    // Prepare email attachments
    const attachments = files.map((file, index) => ({
      filename: file.name,
      content: Buffer.from(file.content, 'base64'),
      content_type: file.type || 'application/octet-stream'
    }));

    // Email content
    const emailData = {
      from: 'onboarding@resend.dev', // Use Resend's verified domain for free tier
      to: 'info@btltech.co.uk',
      subject: `Document Upload from ${name} - BTLTech Printing Service`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">New Document Upload Request</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong> ${message || 'No message provided'}</p>
            <p><strong>Number of files:</strong> ${files.length}</p>
          </div>
          <p>Please find the attached documents for printing services.</p>
          <br>
          <p style="color: #666; font-size: 12px;">This email was sent from the BTLTech website contact form.</p>
        </div>
      `,
      attachments: attachments
    };

    // Send email
    const result = await resend.emails.send(emailData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Documents uploaded and emailed successfully!',
        emailId: result.data?.id
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