const { config } = require('../config');

const resetPasswordUrl = `${config.appUrl}/recuperar-senha`;

const getPasswordRecoveryMail = (token) => `<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
    <title>Ambaya - Esqueci minha senha</title>
</head>

<body style="background-color: #FFD44B;width: 100%;width: 100%;font-family: 'Roboto'; text-align:center">
        <img src="https://minha.ambaya.com.br/img/logo_barra.png" alt="Ambaya Semijoias"  style=" max-width: 50%;" />
        <div style="background-color: white;padding: 20px 100px;margin: 10px 15px 30px 15px;text-align: center;border-radius: 3px;box-shadow: 0px 6px 5px 0px rgba(0, 0, 0, 0.75);">
            <h1 style="font-weight: 300;">Esqueceu a senha?</h1>
            <h2>Não tem problema, basta clicar no botão abaixo para configurar uma nova senha!</h2>
            </br>
            <a style="font-size: 20px; padding: 25px; background-color: #E6B000;text-decoration: none;padding: 7px 25px;border-radius: 3px;text-transform: uppercase;color: #ffffff;box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.75);"
            href="${resetPasswordUrl}/${token.replaceAll(
  '.',
  ','
)}">Nova senha</a>
        </div>
        <small>Ambaya Semijoias - 2020</small>
</body>

</html>`;

module.exports = {
  getPasswordRecoveryMail
};
