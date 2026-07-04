const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const mailOptions = {
    from: `EventSphere <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your EventSphere password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Reset your password</h2>
        <p style="color: #555; font-size: 14px; line-height: 1.6;">
          We received a request to reset the password for your EventSphere account.
          Click the button below to choose a new password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; background: #4f46e5; color: #fff; text-decoration: none;
                  padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 12px;">
          If you didn't request this, you can safely ignore this email — your password will not change.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendPasswordResetEmail }