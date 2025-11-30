const nodemailer = require('nodemailer')

// Create transporter with improved settings for cloud hosting
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Timeout settings to handle slow connections
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
    // Pool connections for better reliability
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    // TLS options
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });
  
  // Define a function to send email with retry logic
  async function sendEmail(to, subject, html, retries = 2) {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        // Compose the email
        const mailOptions = {
          from: process.env.EMAIL_USER || 'armaangogoi2004@gmail.com',
          to: to,
          subject: subject,
          html: html,
        };
    
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully to ${to}`);
        return true;
      } catch (error) {
        console.error(`Error sending email (attempt ${attempt}/${retries + 1}):`, error.message);
        
        if (attempt <= retries) {
          // Wait before retry (exponential backoff)
          const waitTime = attempt * 2000;
          console.log(`Retrying in ${waitTime/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          console.error('All email retry attempts failed');
          return false;
        }
      }
    }
  }

module.exports = sendEmail