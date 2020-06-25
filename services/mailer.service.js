const nodemailer = require('nodemailer');

// TODO: Fix authentication
const transporter = nodemailer.createTransport(
  {
    host: 'smtp.weblink.com.br',
    port: 587,
    secure: false,
    auth: {
      user: 'equipe@ambaya.com.br',
      pass: 'ambaya2014'
    },
    requireTLS: true
  },
  {
    from: 'Equipe Ambaya <equipe@ambaya.com.br>',
    subject: 'Email Example',
    text: 'This is an test email'
  }
);

module.exports = {
  mailer: transporter
};
