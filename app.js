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

var routes = require('./routes/index');
var users = require('./routes/users');
var consultores = require('./routes/consultores');
var supervisores = require('./routes/supervisores');
var log = require('./routes/log');
var peca = require('./routes/pecas');
var fornecedor = require('./routes/fornecedores');
var inscricoes = require('./routes/inscricoes');

var app = express();

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/consultores', consultores);
app.use('/supervisores', supervisores);
app.use('/inscricoes', inscricoes);

// app.use('/kits', kits);
// app.use('/log', log);
// app.use('/pecas', peca);
// app.use('/fornecedores', peca);

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

var hostname = 'localhost';
var port = 80;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
	//app.listen(port, function(){
  app.listen(process.env.PORT || 8080, function(){
		console.log(`Server running at http://${hostname}:${port}/`);
	});
});


//module.exports = app;
