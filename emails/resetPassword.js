const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const path = require('path');
const fs = require('fs/promises');
const { SENDGRID_KEY, BASE_EMAIL, BASE_URL } = require('../keys');

module.exports = async function(getterEmail, token) {
  const transporter = nodemailer.createTransport(
    sendgrid({ auth: { api_user: SENDGRID_KEY }})
  );

  const temapltePath = path.join(__dirname, 'templates', 'confirmResetPassword.html');
  const template = await fs.readFile(temapltePath, 'utf-8');

  const resetLink = `${BASE_URL}/auth/reset/${token}`;
  const email = getResetEmail({ template, link: resetLink, replacedText: 'default-link' });

  return transporter.sendMail({
    to: getterEmail,
    from: BASE_EMAIL,
    subject: 'Reset password of courses shop',
    html: email,
  });
}

function getResetEmail({ template, link, replacedText }) {
  const startIndex = template.indexOf(replacedText);
  const endIndex = startIndex + replacedText.length;

  return template.slice(0, startIndex) + link + template.slice(endIndex);
}