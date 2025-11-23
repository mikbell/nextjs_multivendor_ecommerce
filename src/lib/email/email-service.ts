// Email service for sending verification emails
// You can integrate with services like Resend, SendGrid, or Nodemailer

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // TODO: Integrate with your email service
      // Example with Resend:
      // const resend = new Resend(process.env.RESEND_API_KEY);
      // await resend.emails.send({
      //   from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      //   to: options.to,
      //   subject: options.subject,
      //   html: options.html,
      // });

      // For now, just log the email (DEVELOPMENT ONLY)
      console.log('Email would be sent to:', options.to);
      console.log('Subject:', options.subject);
      console.log('HTML:', options.html);

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendSellerVerificationEmail(
    to: string,
    businessName: string,
    verificationUrl: string
  ): Promise<boolean> {
    const subject = 'Verify your Seller Account Request';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 12px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Seller Account Verification</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>You have requested to become a seller on our platform with the following business details:</p>
            <p><strong>Business Name:</strong> ${businessName}</p>

            <p>To complete your seller registration, please verify your email address by clicking the button below:</p>

            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>

            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>

            <div class="warning">
              <strong>Important:</strong> This verification link will expire in 24 hours.
            </div>

            <p>After verification, you'll be automatically upgraded to a seller account and can start creating your store.</p>

            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Seller Account Verification

      You have requested to become a seller on our platform.
      Business Name: ${businessName}

      To complete your seller registration, please verify your email address by visiting:
      ${verificationUrl}

      This verification link will expire in 24 hours.

      If you didn't request this, please ignore this email.
    `;

    return this.sendEmail({ to, subject, html, text });
  }

  async sendSellerApprovedEmail(
    to: string,
    businessName: string,
    dashboardUrl: string
  ): Promise<boolean> {
    const subject = 'Your Seller Account Has Been Approved!';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #10b981;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
            }
            .button {
              display: inline-block;
              background-color: #10b981;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Congratulations!</h1>
          </div>
          <div class="content">
            <h2>Your seller account has been approved!</h2>
            <p>Welcome to our seller community, <strong>${businessName}</strong>!</p>

            <p>You can now start creating your store and listing products.</p>

            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="button">Go to Seller Dashboard</a>
            </div>

            <p>Here's what you can do next:</p>
            <ul>
              <li>Set up your store profile</li>
              <li>Add your first products</li>
              <li>Configure shipping rates</li>
              <li>Create promotional coupons</li>
            </ul>

            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }
}
