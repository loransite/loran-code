import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
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
