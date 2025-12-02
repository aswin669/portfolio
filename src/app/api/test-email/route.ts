import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('Testing email functionality...');
    
    // Check if environment variables are present
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { error: 'Missing Gmail credentials in environment variables' },
        { status: 500 }
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

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
      return NextResponse.json(
        { message: 'Email configuration is working correctly!' },
        { status: 200 }
      );
    } catch (verifyError) {
      console.error('SMTP connection verification failed:', verifyError);
      return NextResponse.json(
        { error: `SMTP connection failed: ${verifyError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error testing email functionality:', error);
    return NextResponse.json(
      { error: `Failed to test email functionality: ${error.message}` },
      { status: 500 }
    );
  }
}