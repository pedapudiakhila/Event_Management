const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
})
const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const mailOptions = {
    from: `EventSphere <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your EventSphere password',
    text: `Reset your EventSphere password by opening this link (expires in 1 hour): ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5; font-size: 20px;">Reset your password</h2>
        <p style="color: #333; font-size: 14px; line-height: 1.6;">Hi,</p>
        <p style="color: #333; font-size: 14px; line-height: 1.6;">
          We received a request to reset the password for your <strong>EventSphere</strong> account.
        </p>
        <p style="color: #333; font-size: 14px; line-height: 1.6;">
          Open this link to choose a new password (expires in 1 hour):
        </p>
        <p style="font-size: 14px;">
          <a href="${resetUrl}" style="color: #4f46e5; font-weight: 600;">${resetUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email — your password will not change.
        </p>
        <p style="color: #333; font-size: 14px;">— EventSphere</p>
      </div>
    `
  }
  await transporter.sendMail(mailOptions)
}
module.exports = { sendPasswordResetEmail }