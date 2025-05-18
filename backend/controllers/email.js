const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
  // 1. create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME, // never mention your personal mail
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2. set email options

  const emailOptions = {
    from: 'apoorv Jain <apoorv@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. sending the email

  await transporter.sendMail(emailOptions);
};
