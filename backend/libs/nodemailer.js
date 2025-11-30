const nodemailer = require('nodemailer')

console.log('[NODEMAILER] Initializing email transporter...');
console.log('[NODEMAILER] EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ NOT SET');
console.log('[NODEMAILER] EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ NOT SET');

// Create transporter with improved settings for cloud hosting
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS (false for port 587)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Increased timeout settings for cloud hosting (Render can be slow)
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 60000, // 60 seconds for slow connections
    // Pool connections for better reliability
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    // TLS options for Gmail
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    // Debug mode
    debug: true,
    logger: true
  });

// Verify transporter connection on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('[NODEMAILER] ❌ Transporter verification FAILED:', error.message);
    console.error('[NODEMAILER] Full error:', error);
  } else {
    console.log('[NODEMAILER] ✅ Transporter is ready to send emails');
  }
});
  
// Define a function to send email with retry logic
async function sendEmail(to, subject, html, retries = 3) {
  console.log(`[NODEMAILER] 📧 Attempting to send email to: ${to}`);
  console.log(`[NODEMAILER] Subject: ${subject}`);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[NODEMAILER] Attempt ${attempt}/${retries}...`);
      
      // Compose the email
      const mailOptions = {
        from: `"Loceal" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log(`[NODEMAILER] ✅ Email sent successfully!`);
      console.log(`[NODEMAILER] Message ID: ${info.messageId}`);
      console.log(`[NODEMAILER] Response: ${info.response}`);
      return true;
    } catch (error) {
      console.error(`[NODEMAILER] ❌ Attempt ${attempt}/${retries} FAILED:`, error.message);
      console.error(`[NODEMAILER] Error code: ${error.code}`);
      console.error(`[NODEMAILER] Error command: ${error.command}`);
      
      if (attempt < retries) {
        // Wait before retry (exponential backoff)
        const waitTime = attempt * 3000; // 3s, 6s, 9s
        console.log(`[NODEMAILER] Waiting ${waitTime/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error('[NODEMAILER] ❌ All retry attempts failed!');
        console.error('[NODEMAILER] Final error:', error);
        return false;
      }
    }
  }
  return false;
}

module.exports = sendEmail