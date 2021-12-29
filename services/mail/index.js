const { MAIL_USERNAME, MAIL_PASSWORD, CLIENT_URL } = require('../../config');
const { renderEmailContent } = require('../../public/resource/template/email');
const nodemailer = require("nodemailer");

const sendEmailResetPassword = async (email, token) => {
  const resetUrl = `${CLIENT_URL}/password-reset/${token}`;
  const forgotPasswordUrl = `${CLIENT_URL}/password-reset`;
  const emailContent = renderEmailContent(resetUrl, forgotPasswordUrl)
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD
    },
  });

  let info = await transporter.sendMail({
    from: `"Đông Du Miền Trung" <dongdumientrung@gmail.com>`,
    to: `${email}`,
    subject: "[OBDD] Please reset your password",
    html: emailContent,
  });
}

module.exports = { sendEmailResetPassword }