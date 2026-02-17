import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create transporter
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email service not configured. Emails will be skipped.');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Generate a random verification token
 * @returns {string} 32-character hex token
 */
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Send email verification email
 * @param {string} email - User's email address
 * @param {string} fullName - User's full name
 * @param {string} token - Verification token
 */
export const sendVerificationEmail = async (email, fullName, token) => {
  const transporter = createTransporter();
  
  // Skip if email not configured (dev mode)
  if (!transporter) {
    console.log(`📧 [DEV MODE] Email verification would be sent to: ${email}`);
    console.log(`🔗 Verification link: ${process.env.FRONTEND_URL}/verify-email/${token}`);
    return { success: true, devMode: true };
  }

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Loran Fashion" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✨ Verify Your Loran Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
          }
          .message {
            color: #666;
            line-height: 1.6;
            font-size: 16px;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
          }
          .button:hover {
            transform: scale(1.05);
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            margin: 5px 0;
          }
          .link {
            color: #667eea;
            word-break: break-all;
            font-size: 12px;
            margin-top: 20px;
            display: block;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Welcome to Loran</h1>
          </div>
          <div class="content">
            <div class="greeting">Hi ${fullName}! 👋</div>
            <div class="message">
              <p>Thanks for signing up with Loran! We're excited to have you join our fashion community.</p>
              <p>Please verify your email address by clicking the button below:</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <div class="message">
              <p>Or copy and paste this link into your browser:</p>
              <span class="link">${verificationUrl}</span>
            </div>
            <div class="warning">
              ⚠️ This link will expire in 24 hours. If you didn't create an account with Loran, you can safely ignore this email.
            </div>
          </div>
          <div class="footer">
            <p><strong>Loran Fashion Platform</strong></p>
            <p>Connecting designers and clients worldwide</p>
            <p style="margin-top: 15px;">© 2026 Loran. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} email - User's email address
 * @param {string} fullName - User's full name
 */
export const sendWelcomeEmail = async (email, fullName) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log(`📧 [DEV MODE] Welcome email would be sent to: ${email}`);
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `"Loran Fashion" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Welcome to Loran - Your Account is Verified!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .content {
            padding: 40px;
          }
          .emoji {
            font-size: 64px;
            text-align: center;
            margin: 20px 0;
          }
          .message {
            color: #666;
            line-height: 1.6;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .feature-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .feature-box h3 {
            color: #667eea;
            margin-top: 0;
          }
          .button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Verified!</h1>
          </div>
          <div class="content">
            <div class="emoji">✅</div>
            <div class="message">
              <p><strong>Congratulations, ${fullName}!</strong></p>
              <p>Your email has been verified successfully. You now have full access to all Loran features!</p>
            </div>
            
            <div class="feature-box">
              <h3>🎨 What You Can Do Now:</h3>
              <ul>
                <li><strong>AI Try-On:</strong> Upload photos and get AI-powered measurements</li>
                <li><strong>Browse Designers:</strong> Find the perfect designer for your project</li>
                <li><strong>Place Orders:</strong> Connect with designers and bring your vision to life</li>
                <li><strong>Become a Designer:</strong> Apply to join our designer community</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p><strong>Loran Fashion Platform</strong></p>
            <p>© 2026 Loran. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw - welcome email is not critical
    return { success: false, error: error.message };
  }
};

/**
 * Send resend verification email
 * @param {string} email - User's email address
 * @param {string} fullName - User's full name
 * @param {string} token - New verification token
 */
export const resendVerificationEmail = async (email, fullName, token) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log(`📧 [DEV MODE] Resend verification email would be sent to: ${email}`);
    console.log(`🔗 Verification link: ${process.env.FRONTEND_URL}/verify-email/${token}`);
    return { success: true, devMode: true };
  }

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Loran Fashion" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔄 Resend: Verify Your Loran Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
          }
          .message {
            color: #666;
            line-height: 1.6;
            font-size: 16px;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
          }
          .link {
            color: #667eea;
            word-break: break-all;
            font-size: 12px;
            margin-top: 20px;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Verify Your Email</h1>
          </div>
          <div class="content">
            <div class="greeting">Hi ${fullName}! 👋</div>
            <div class="message">
              <p>You requested a new verification email. Click the button below to verify your account:</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <div class="message">
              <p>Or copy and paste this link:</p>
              <span class="link">${verificationUrl}</span>
            </div>
          </div>
          <div class="footer">
            <p><strong>Loran Fashion Platform</strong></p>
            <p>© 2026 Loran. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Resend verification email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error resending verification email:', error);
    throw new Error('Failed to resend verification email');
  }
};

// Email templates
const templates = {
  orderConfirmation: (orderDetails) => ({
    subject: `Order Confirmation - ${orderDetails.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${orderDetails.customerName},</p>
            <p>Thank you for your order! We're excited to create something beautiful for you.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <div class="detail-row">
                <span><strong>Order ID:</strong></span>
                <span>${orderDetails.orderId}</span>
              </div>
              <div class="detail-row">
                <span><strong>Design:</strong></span>
                <span>${orderDetails.designName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Amount:</strong></span>
                <span>₦${orderDetails.amount.toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span><strong>Status:</strong></span>
                <span style="color: #667eea; font-weight: bold;">Payment Confirmed</span>
              </div>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will contact you within 24 hours to discuss your requirements</li>
              <li>Your order will be assigned to a skilled designer</li>
              <li>You'll receive updates throughout the creation process</li>
            </ul>
            
            <a href="${process.env.BASE_URL}/dashboard/client" class="button">View My Orders</a>
            
            <p>If you have any questions, feel free to reply to this email or contact us at support@loran.com</p>
          </div>
          <div class="footer">
            <p>© 2026 Loran - Custom Fashion Design Platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  orderStatusUpdate: (orderDetails) => ({
    subject: `Order Update - ${orderDetails.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Order Status Update</h1>
          </div>
          <div class="content">
            <p>Hi ${orderDetails.customerName},</p>
            <p>Your order <strong>${orderDetails.orderId}</strong> has been updated:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div class="status-badge" style="background: ${getStatusColor(orderDetails.status)}; color: white;">
                ${orderDetails.status.toUpperCase().replace('-', ' ')}
              </div>
            </div>
            
            ${orderDetails.message ? `<p>${orderDetails.message}</p>` : ''}
            
            ${orderDetails.designerNotes ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4>Designer's Note:</h4>
                <p>${orderDetails.designerNotes}</p>
              </div>
            ` : ''}
            
            <a href="${process.env.BASE_URL}/dashboard/client" class="button">View Order Details</a>
          </div>
          <div class="footer">
            <p>© 2026 Loran - Custom Fashion Design Platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  designerOrderNotification: (orderDetails) => ({
    subject: `New Order Assigned - ${orderDetails.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎨 New Order Assigned!</h1>
          </div>
          <div class="content">
            <p>Hi ${orderDetails.designerName},</p>
            <p>Great news! A new order has been assigned to you.</p>
            
            <div class="order-details">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Client:</strong> ${orderDetails.customerName}</p>
              <p><strong>Design:</strong> ${orderDetails.designName}</p>
              <p><strong>Amount:</strong> ₦${orderDetails.amount.toLocaleString()}</p>
              
              ${orderDetails.measurements ? `
                <h4 style="margin-top: 20px;">Measurements:</h4>
                <ul style="list-style: none; padding: 0;">
                  ${Object.entries(orderDetails.measurements).map(([key, value]) => 
                    `<li><strong>${key}:</strong> ${value}</li>`
                  ).join('')}
                </ul>
              ` : ''}
              
              ${orderDetails.customizationRequest ? `
                <h4 style="margin-top: 20px;">Client's Requirements:</h4>
                <p>${orderDetails.customizationRequest}</p>
              ` : ''}
            </div>
            
            <a href="${process.env.BASE_URL}/dashboard/designer" class="button">View Order</a>
            
            <p>Please review the requirements and start working on this beautiful design!</p>
          </div>
          <div class="footer">
            <p>© 2026 Loran - Custom Fashion Design Platform</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Helper function for status colors
function getStatusColor(status) {
  const colors = {
    'pending': '#FFA500',
    'awaiting-payment': '#FF6B6B',
    'awaiting-contact': '#4ECDC4',
    'processing': '#667eea',
    'completed': '#10B981',
    'cancelled': '#EF4444',
    'confirmed': '#10B981',
  };
  return colors[status] || '#667eea';
}

// Send email function
export const sendEmail = async ({ to, template, data }) => {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || 
        process.env.SMTP_USER === 'REPLACE_WITH_MAILTRAP_USER') {
      console.log('📧 Email notification (SMTP not configured):', {
        to,
        template,
        data,
      });
      return { success: true, message: 'Email logged (SMTP not configured)' };
    }

    const transporter = createTransporter();
    const emailTemplate = templates[template](data);

    const mailOptions = {
      from: `"Loran Fashion" <${process.env.FROM_EMAIL || 'noreply@loran.com'}>`,
      to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    // Don't throw error - just log it and continue
    return { success: false, error: error.message };
  }
};

// Bulk send emails
export const sendBulkEmails = async (emails) => {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );
  return results;
};

export default { sendEmail, sendBulkEmails };
