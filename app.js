(async () => {
  const path = require('path');
  const favicon = require('serve-favicon');
  const logger = require('morgan');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const passport = require('passport');
  const { Strategy: LocalStrategy } = require('passport-local');
  const { config } = require('./config');
  const secure = require('express-force-https');
  const cors = require('cors');
  const connection = require('./connection');

  const { UserModel } = require('./models/user.model');

  const { api } = require('./routes');

  const app = connection.app;
  const server = connection.server;
  const db = connection.db;

  app.use(secure);
  app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // passport config
  app.use(passport.initialize());
  passport.use(new LocalStrategy(UserModel.authenticate()));
  passport.serializeUser(UserModel.serializeUser());
  passport.deserializeUser(UserModel.deserializeUser());

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  app.use(cors());

  app.use(api);

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    server.listen(config.PORT, () => {
      console.log(`Server running at port ${config.PORT}`);
    });
  });
})();
