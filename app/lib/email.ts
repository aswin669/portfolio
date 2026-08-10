import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP credentials not configured. Contact saved to database.');
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || 'Aswinsreedharan669@gmail.com',
      replyTo: data.email,
      subject: `[PORTFOLIO] ${data.subject}`,
      html: `
        <table style="width:100%;max-width:600px;margin:0 auto;font-family:'Courier New',Courier,monospace;background:#fff;color:#000">
          <tr>
            <td style="border:2px solid #000;padding:0">
              <table style="width:100%">
                <tr>
                  <td style="background:#000;color:#fff;padding:20px 24px;text-align:center">
                    <span style="font-size:11px;letter-spacing:3px;font-weight:bold">ASWIN_S // PORTFOLIO</span>
                  </td>
                </tr>
                <tr>
                  <td style="border-bottom:1px solid #000;padding:16px 24px;text-align:center">
                    <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#666">New Contact Form Submission</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px">
                    <table style="width:100%;border-collapse:collapse">
                      <tr>
                        <td style="border:1px solid #000;padding:0">
                          <table style="width:100%">
                            <tr>
                              <td style="padding:12px 16px;border-right:1px solid #000;border-bottom:1px solid #000;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;background:#f5f5f5;width:100px">Name</td>
                              <td style="padding:12px 16px;border-bottom:1px solid #000;font-size:14px">${data.name}</td>
                            </tr>
                            <tr>
                              <td style="padding:12px 16px;border-right:1px solid #000;border-bottom:1px solid #000;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;background:#f5f5f5">Email</td>
                              <td style="padding:12px 16px;border-bottom:1px solid #000;font-size:14px">${data.email}</td>
                            </tr>
                            <tr>
                              <td style="padding:12px 16px;border-right:1px solid #000;border-bottom:1px solid #000;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;background:#f5f5f5">Subject</td>
                              <td style="padding:12px 16px;border-bottom:1px solid #000;font-size:14px">${data.subject}</td>
                            </tr>
                            <tr>
                              <td style="padding:12px 16px;border-right:1px solid #000;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;background:#f5f5f5;vertical-align:top">Message</td>
                              <td style="padding:12px 16px;font-size:14px;line-height:1.6">${data.message}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <table style="width:100%;margin-top:24px;border-top:1px solid #000;padding-top:16px">
                      <tr>
                        <td style="font-size:10px;color:#666;text-align:center;letter-spacing:1px;text-transform:uppercase">
                          Sent via aswin.dev // ${new Date().toLocaleString()}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    });
  } catch (err) {
    console.error('Failed to send contact notification email:', err);
  }
}
