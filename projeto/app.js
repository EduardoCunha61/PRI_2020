var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport')
var flash = require('express-flash')
var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session);
var multer = require('multer')


require('./authentication/aut')

var mongoose = require ('mongoose')
mongoose.Promise = require('bluebird'); //Adicionei este modulo pq estava a dar warning de deprecated library

mongoose.connect('mongodb://127.0.0.1:27017/projeto',{useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log('Mongo ready! ' + mongoose.connection.readyState))
    .catch((erro)=> console.log('Connection Error! ' + erro));


var indexRouter = require('./routes/index');
var eventsRouter = require('./routes/evento');
var usersRouter = require('./routes/users');
var usersAPIRouter = require('./routes/api/users');
var eventsAPIRouter = require('./routes/api/evento');

//var eventosRouter = require('./routes/eventos');


var app = express();

// const directory = path.join(__dirname, '/public');
// app.use('/public', express.static(directory));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
  genid: () => {
    return uuid()},
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: true
}))

app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/api/users', usersAPIRouter);
app.use('/api/evento', eventsAPIRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
