import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Log environment variables on import (without exposing the password)
console.log('GMAIL_USER present:', !!process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD present:', !!process.env.GMAIL_APP_PASSWORD);

export async function POST(request: Request) {
  try {
    console.log('Contact form API called');
    const body = await request.json();
    const { name, email, message } = body;
    
    console.log('Form data received:', { name, email, message });

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log('Validating email:', email, 'Regex test result:', emailRegex.test(email));
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP
    console.log('Creating transporter with Gmail SMTP');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('Transporter created successfully');
    
    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP connection verification failed:', verifyError);
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    // Define email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to yourself
      replyTo: email, // Reply to the sender
      subject: `Portfolio Contact from ${name}`,
      text: `Name: ${name}
Email: ${email}

Message:
${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    console.log('Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // Verify transporter configuration
    console.log('Checking Gmail credentials:', {
      userPresent: !!process.env.GMAIL_USER,
      passwordPresent: !!process.env.GMAIL_APP_PASSWORD,
      userEmail: process.env.GMAIL_USER
    });
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('Error: Missing Gmail credentials');
      throw new Error('Missing Gmail credentials in environment variables');
    }

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json(
        { message: 'Message sent successfully!' },
        { status: 200 }
      );
    } catch (mailError) {
      console.error('Email sending failed:', mailError);
      throw new Error(`Failed to send email: ${mailError.message || mailError}`);
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to send message', 
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}