const { MAIL_USERNAME, MAIL_PASSWORD, CLIENT_URL } = require('../../config');
const nodemailer = require("nodemailer");

const sendEmailResetPassword = async (email, token) => {
  const url = `${CLIENT_URL}/password-reset/${token}`;
  const output = `
    <h3>Reset your OBDD password</h3>
    <div>We heard that you lost your OBDD password. Sorry about that!</div>
    <div>But don’t worry! You can use the following button to reset your password:</div>
    <div><a href="${url}" >${url}</a></div>
    <div>
      If you don’t use this link within 15 minutes, it will expire. To get a new password reset link, visit: 
      <a href="${CLIENT_URL}/password-reset" >${CLIENT_URL}/password-reset</a>
    </div>
    <div>Thanks,</div>
    <div>OBDD-MT</div>
  `
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
    html: output,
  });
}

module.exports = { sendEmailResetPassword }