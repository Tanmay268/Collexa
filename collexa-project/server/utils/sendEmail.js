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
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .otp-box { background: #eff6ff; border: 2px dashed #3b82f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .otp { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Collexa</div>
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

export default sendEmail;
