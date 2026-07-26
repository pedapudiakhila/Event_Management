const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Event Management <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Reset Request - Event Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
          <p style="color: #555555; font-size: 16px;">Hello,</p>
          <p style="color: #555555; font-size: 16px;">We received a request to reset your password for your Event Management account. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #777777; font-size: 14px;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #4F46E5; font-size: 14px; word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="color: #999999; font-size: 12px; text-align: center;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend Error]:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('[Resend Success]: Email sent with ID:', data.id);
    return data;
  } catch (err) {
    console.error('[sendPasswordResetEmail Error]:', err);
    throw err;
  }
};

module.exports = { sendPasswordResetEmail };