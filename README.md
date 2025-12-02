# Portfolio Website

This is a personal portfolio website built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Responsive design
- Dark/light mode toggle
- Smooth animations with Framer Motion
- Contact form with email functionality
- Project showcase
- Skills display

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Gmail for email functionality:
   - Go to your Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password:
     - Navigate to Security → 2-Step Verification → App passwords
     - Select "Mail" and your device
     - Copy the generated password
   - Update the `.env.local` file with your credentials:
     ```
     GMAIL_USER=your_email@gmail.com
     GMAIL_APP_PASSWORD=your_generated_app_password
     ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This portfolio can be deployed to Vercel, Netlify, or any platform that supports Next.js applications.

## Contact Form

The contact form sends emails directly to the configured Gmail address using Nodemailer. Make sure to set up the environment variables correctly for this feature to work.