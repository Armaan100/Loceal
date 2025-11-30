const nodemailer = require('nodemailer')
const axios = require('axios');

console.log('[NODEMAILER] Initializing email service...');
console.log('[NODEMAILER] EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ NOT SET');
console.log('[NODEMAILER] EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ NOT SET');
console.log('[NODEMAILER] RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set (hidden)' : '⚠️ NOT SET (will use SMTP)');

// Check if Resend API key is available (recommended for Render)
const useResend = !!process.env.RESEND_API_KEY;

// Create nodemailer transporter as fallback
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 120000,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    }
  });
};

let transporter = null;
if (!useResend) {
  transporter = createTransporter();
  transporter.verify()
    .then(() => console.log('[NODEMAILER] ✅ SMTP transporter ready'))
    .catch((err) => console.error('[NODEMAILER] ⚠️ SMTP verification failed:', err.message));
}

// Send email using Resend API (works on Render free tier!)
async function sendWithResend(to, subject, html) {
  try {
    console.log('[RESEND] Sending email via Resend API...');
    const response = await axios.post('https://api.resend.com/emails', {
      from: 'Loceal <onboarding@resend.dev>', // Use resend.dev domain for free tier
      to: [to],
      subject: subject,
      html: html,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('[RESEND] ✅ Email sent successfully!');
    console.log('[RESEND] ID:', response.data.id);
    return true;
  } catch (error) {
    console.error('[RESEND] ❌ Failed:', error.response?.data || error.message);
    return false;
  }
}

// Send email using SMTP (Gmail)
async function sendWithSMTP(to, subject, html) {
  if (!transporter) {
    transporter = createTransporter();
  }
  
  const mailOptions = {
    from: `"Loceal" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('[SMTP] ✅ Email sent! ID:', info.messageId);
  return true;
}

// Main email function with retry logic
async function sendEmail(to, subject, html, retries = 3) {
  console.log(`[EMAIL] 📧 Sending to: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Method: ${useResend ? 'Resend API' : 'Gmail SMTP'}`);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[EMAIL] Attempt ${attempt}/${retries}...`);
      
      if (useResend) {
        const success = await sendWithResend(to, subject, html);
        if (success) return true;
        throw new Error('Resend API failed');
      } else {
        const success = await sendWithSMTP(to, subject, html);
        if (success) return true;
      }
    } catch (error) {
      console.error(`[EMAIL] ❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        const waitTime = attempt * 5000;
        console.log(`[EMAIL] Waiting ${waitTime/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error('[EMAIL] ❌ All attempts failed!');
        console.error('[EMAIL] 💡 TIP: Set RESEND_API_KEY env var for reliable email on Render.');
        console.error('[EMAIL] 💡 Get free API key at: https://resend.com');
        return false;
      }
    }
  }
  return false;
}

module.exports = sendEmail