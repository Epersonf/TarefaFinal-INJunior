const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/user');
const Verify = require('./verify');
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const emailHelper = require('../../helpers/emailHelper');

const transporter = nodemailer.createTransport({
  host: 'smtp.weblink.com.br',
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: 'equipe@ambaya.com.br',
    pass: 'ambaya2014'
  }
});

router.post('/', passport.authenticate('local'), function (req, res) {
  var token = Verify.getToken(req.user);
  res.status(200).json({
    status: 'Logado com sucesso',
    success: true,
    token: token,
    user: req.user
  });
});

//Password Recovery

//TODO: tratar requisição vinda do app
router.post('/esqueci-senha', function (req, res, next) {
  const state = uuid();
  const { login, email, origin } = req.body;
  let returnUrl;
  switch (origin) {
    case 'app':
      returnUrl = 'https://app.ambaya.com.br/nova-senha';
      break;
    default:
      returnUrl = 'http://minha.ambaya.com.br/#/recuperar-senha';
  }
  User.update(
    { username: login, email: email },
    {
      $set: {
        state: state
      }
    },
    function (err, data) {
      var mailOptions = {
        from: '"Equipe Ambaya" <equipe@ambaya.com.br>',
        to: req.body.email,
        subject: 'Recuperação de Senha',
        html: emailHelper.getForgottenPasswordEmail(returnUrl, state)
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          next(error);
        }
        res.json(data);
      });
    }
  );
});

router.post('/nova-senha', async (req, res, next) => {
  const userToChange = await User.findOne({ state: req.body.state }).exec();
  if (!userToChange) {
    console.log('Invalid password change request');
    res.status(404).json({ msg: 'Password not changed' });
  }
  await userToChange.setPassword(req.body.senha);
  await userToChange.save();
  res.status(200).json({ msg: 'Password changed' });
});

module.exports = router;
