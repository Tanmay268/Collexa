import transporter from '../config/email.js';

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

export const sendOTPEmail = async (email, otp) => {
  const subject = 'Verify Your Collexa Account';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .brand { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .otp-box { background: #eff6ff; border: 2px dashed #3b82f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .otp { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">Collexa</div>
          <p>VIT Student Marketplace</p>
        </div>
        
        <h2>Verify Your Email</h2>
        <p>Welcome to Collexa! Please use the OTP below to verify your account:</p>
        
        <div class="otp-box">
          <div class="otp">${otp}</div>
        </div>
        
        <p><strong>This OTP is valid for 10 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        
        <div class="footer">
          <p>&copy; 2025 Collexa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, html);
};

export const sendPasswordResetOTPEmail = async (email, otp) => {
  const subject = 'Reset Your Collexa Password';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .brand { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .otp-box { background: #eff6ff; border: 2px dashed #3b82f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .otp { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">Collexa</div>
          <p>VIT Student Marketplace</p>
        </div>
        
        <h2>Reset Your Password</h2>
        <p>Use the OTP below to reset your Collexa account password:</p>
        
        <div class="otp-box">
          <div class="otp">${otp}</div>
        </div>
        
        <p><strong>This OTP is valid for 10 minutes.</strong></p>
        <p>If you did not request a password reset, you can ignore this email.</p>
        
        <div class="footer">
          <p>&copy; 2025 Collexa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, subject, html);
};

export const sendBugReportEmail = async ({ companyEmail, reporter, report }) => {
  const subject = `Bug Report: ${report.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #f4f7fb; padding: 24px;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 28px;">
        <h2 style="margin-top: 0; color: #111827;">New Collexa Bug Report</h2>
        <p style="color: #4b5563;">A customer submitted a bug report from the website.</p>

        <div style="margin: 24px 0;">
          <h3 style="margin-bottom: 8px; color: #1f2937;">Report</h3>
          <p><strong>Title:</strong> ${report.title}</p>
          <p><strong>Description:</strong><br />${report.description.replace(/\n/g, '<br />')}</p>
          <p><strong>Page:</strong> ${report.pageUrl}</p>
          <p><strong>Device:</strong> ${report.deviceInfo}</p>
        </div>

        <div style="margin: 24px 0;">
          <h3 style="margin-bottom: 8px; color: #1f2937;">Reporter</h3>
          <p><strong>Name:</strong> ${reporter.name}</p>
          <p><strong>Email:</strong> ${reporter.email}</p>
          <p><strong>User ID:</strong> ${reporter.id}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(companyEmail, subject, html);
};

export const sendAccountReportEmail = async ({ companyEmail, reporter, reportedAccount, reason, details }) => {
  const subject = `Account Report: ${reportedAccount.email}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #f4f7fb; padding: 24px;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 28px;">
        <h2 style="margin-top: 0; color: #111827;">New Account Report</h2>
        <p style="color: #4b5563;">A user has reported another account.</p>
        <h3 style="color: #1f2937;">Reported Account</h3>
        <p><strong>Name:</strong> ${reportedAccount.name}</p>
        <p><strong>Email:</strong> ${reportedAccount.email}</p>
        <p><strong>User ID:</strong> ${reportedAccount.id}</p>
        <h3 style="color: #1f2937;">Reason</h3>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Details:</strong><br />${(details || '').replace(/\n/g, '<br />') || 'No extra details provided.'}</p>
        <h3 style="color: #1f2937;">Reporter</h3>
        <p><strong>Name:</strong> ${reporter.name}</p>
        <p><strong>Email:</strong> ${reporter.email}</p>
        <p><strong>User ID:</strong> ${reporter.id}</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(companyEmail, subject, html);
};

export const sendContactRequestEmail = async ({ sellerEmail, sellerName, buyer, listing }) => {
  const subject = `Purchase Contact Request: ${listing.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #f4f7fb; padding: 24px;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 28px;">
        <h2 style="margin-top: 0; color: #111827;">A buyer wants to contact you</h2>
        <p style="color: #4b5563;">Hi ${sellerName}, someone is interested in your listing on Collexa.</p>
        <h3 style="color: #1f2937;">Listing</h3>
        <p><strong>Title:</strong> ${listing.title}</p>
        <p><strong>Category:</strong> ${listing.category}</p>
        <p><strong>Price:</strong> INR ${listing.price}</p>
        <h3 style="color: #1f2937;">Buyer Details</h3>
        <p><strong>Name:</strong> ${buyer.name}</p>
        <p><strong>Email:</strong> ${buyer.email}</p>
        <p><strong>User ID:</strong> ${buyer.id}</p>
        <p style="margin-top: 24px; color: #4b5563;">You can reply directly to this buyer using their email address.</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(sellerEmail, subject, html);
};

export default sendEmail;
