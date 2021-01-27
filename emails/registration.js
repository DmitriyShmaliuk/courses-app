const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const path = require('path');
const fs = require('fs/promises');
const { SENDGRID_KEY, BASE_EMAIL} = require('../keys');

module.exports = async function(getterEmail) {
  const transporter = nodemailer.createTransport(
    sendgrid({ auth: { api_user: SENDGRID_KEY }})
  );

  const temapltePath = path.join(__dirname, 'templates', 'accountCreated.html');
  const template = await fs.readFile(temapltePath, 'utf-8');

  return transporter.sendMail({
    to: getterEmail,
    from: BASE_EMAIL,
    subject: 'Account is successfully created',
    html: template,
  });
}