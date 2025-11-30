const nodemailer = require('nodemailer')
const axios = require('axios');

console.log('[NODEMAILER] Initializing email service...');
console.log('[NODEMAILER] EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ NOT SET');
console.log('[NODEMAILER] EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ NOT SET');
console.log('[NODEMAILER] EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID ? '✅ Set' : '⚠️ NOT SET');
console.log('[NODEMAILER] EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY ? '✅ Set' : '⚠️ NOT SET');
console.log('[NODEMAILER] EMAILJS_PRIVATE_KEY:', process.env.EMAILJS_PRIVATE_KEY ? '✅ Set (hidden)' : '⚠️ NOT SET');

// EmailJS - 200 emails/month FREE, NO business verification!
const useEmailJS = !!(process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY);

console.log(`[NODEMAILER] Using: ${useEmailJS ? 'EmailJS API' : 'Gmail SMTP'}`);

// Create nodemailer transporter for Gmail SMTP fallback
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
if (!useEmailJS) {
  transporter = createTransporter();
  transporter.verify()
    .then(() => console.log('[NODEMAILER] ✅ SMTP transporter ready'))
    .catch((err) => console.error('[NODEMAILER] ⚠️ SMTP verification failed:', err.message));
}

// Send email using EmailJS API (200 emails/month FREE - no verification!)
// Template should have: {{to_email}}, {{subject}}, {{message_html}}
async function sendWithEmailJS(to, subject, html) {
  try {
    console.log('[EMAILJS] Sending email via EmailJS API...');
    
    const data = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_loceal',
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: to,
        reply_to: process.env.EMAIL_USER || 'noreply@loceal.app',
        from_name: 'Loceal',
        subject: subject,
        message_html: html
      }
    };

    // Add private key if available (for server-side auth)
    if (process.env.EMAILJS_PRIVATE_KEY) {
      data.accessToken = process.env.EMAILJS_PRIVATE_KEY;
    }
    
    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', data, {
      headers: {
        'Content-Type': 'application/json',
        'origin': 'https://loceal.netlify.app'
      },
      timeout: 30000
    });
    
    console.log('[EMAILJS] ✅ Email sent successfully!');
    return true;
  } catch (error) {
    console.error('[EMAILJS] ❌ Failed:', error.response?.data || error.message);
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
  console.log(`[EMAIL] Method: ${useEmailJS ? 'EmailJS' : 'Gmail SMTP'}`);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[EMAIL] Attempt ${attempt}/${retries}...`);
      
      if (useEmailJS) {
        const success = await sendWithEmailJS(to, subject, html);
        if (success) return true;
        throw new Error('EmailJS API failed');
      } else {
        const success = await sendWithSMTP(to, subject, html);
        if (success) return true;
      }
    } catch (error) {
      console.error(`[EMAIL] ❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        const waitTime = attempt * 3000;
        console.log(`[EMAIL] Waiting ${waitTime/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error('[EMAIL] ❌ All attempts failed!');
        return false;
      }
    }
  }
  return false;
}

module.exports = sendEmail