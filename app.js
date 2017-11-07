var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var config = require('./config')

var Verify = require('./routes/verify');

var login = require('./routes/login');
var users = require('./routes/users');
var historico = require('./routes/historico');
var encomendas = require('./routes/encomendas');
var acertos = require('./routes/acertos');
var brindes = require('./routes/brindes');
var trocas = require('./routes/trocas');
var logs = require('./routes/logs');
var api = require('./routes/api');
var kits = require('./routes/kits');

var app = express();

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);

app.use('/users', Verify.verifyOrdinaryUser, users);
app.use('/historico', Verify.verifyOrdinaryUser, historico);
app.use('/encomendas', Verify.verifyOrdinaryUser, encomendas);
app.use('/acertos', Verify.verifyOrdinaryUser, acertos);
app.use('/brindes', Verify.verifyOrdinaryUser, brindes);
app.use('/trocas', Verify.verifyOrdinaryUser, trocas);
app.use('/logs', Verify.verifyOrdinaryUser, trocas);
app.use('/kits', Verify.verifyOrdinaryUser, kits);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

var hostname = '0.0.0.0';
var port = 3030;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
	app.listen(port, hostname, function(){
  //app.listen(process.env.PORT || 8080, function(){
		console.log(`Server running at http://${hostname}:${port}/`);
	});
});


//module.exports = app;
