const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config')
const Verify = require('./routes/verify');
const login = require('./routes/login');
const users = require('./routes/users');
const historico = require('./routes/historico');
const encomendas = require('./routes/encomendas');
const acertos = require('./routes/acertos');
const brindes = require('./routes/brindes');
const trocas = require('./routes/trocas');
const logs = require('./routes/logs');
const api = require('./routes/api');
const kits = require('./routes/kits');
const v1 = require('./routes/v1/');
const secure = require('express-force-https');
// const NotificationHelper = require('./helpers/notification.helper');
const cors = require('cors');

const connection = require('./connection');

const app = connection.app;
// const io = connection.io;
const server = connection.server;

// const user;

/* io.on('connection', async socket => {
  let userId = socket.handshake.query.user;
  if(userId === undefined){
    console.error('Falha ao conectar');
    return;
  }
  user = await User.findById(userId);
  if (!user) {
    socket.send('User invalid');
    return;
  }
  let notifications = await NotificationHelper.getAutomaticNotifications(user);
  //socket.join(`/${userId}`);
  if (user.tipo == "Estoque") {
    socket.join('estoque');
    let newKits = await NotificationHelper.getEstoqueAutomaticNotifications(user)
    notifications = [...newKits, ...notifications];
  }
  socket.on('joinRoom', function (room) {
    console.log('Entering room ', room.type + room.id)
    //gid is game ID - create room name based on this and join the room
    socket.join(room.type + room.id);
  });

  //console.log('notifications', notifications)

  socket.emit('notificationsInit', notifications);

  console.log('user conected => ', user.nome);
  console.log('id: ', user._id);
}); */

mongoose.connect(config.mongoUrl, { useNewUrlParser: true });
const db = mongoose.connection;

app.use(secure);
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport config
const User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);

app.use('/users', Verify.verifyOrdinaryUser, users);
app.use('/historico', Verify.verifyOrdinaryUser, historico);
app.use('/encomendas', Verify.verifyOrdinaryUser, encomendas);
app.use('/acertos', Verify.verifyOrdinaryUser, acertos);
app.use('/brindes', Verify.verifyOrdinaryUser, brindes);
app.use('/trocas', Verify.verifyOrdinaryUser, trocas);
app.use('/logs', Verify.verifyOrdinaryUser, logs);
app.use('/kits', Verify.verifyOrdinaryUser, kits);
app.use('/v1', v1);
app.use('/api', api);

//captando notificações para broadcast e adição no usuário
// app.use(NotificationHelper.notifyUser);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  server.listen(config.PORT, function () {
    console.log(`Server running at port ${config.PORT}`);
  });
});


//module.exports = app;
