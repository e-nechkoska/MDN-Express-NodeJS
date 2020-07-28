let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let compression = require('compression');
let helmet = require('helmet');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let catalogRouter = require('./routes/catalog');

let app = express();

// when the connection to mongodb atlas is interrupted, use the second connection string to the local database
// let mongoDB = 'mongodb+srv://eneck:LocalLibrary1@cluster0-9trdp.mongodb.net/local_library?retryWrites=true&w=majority';
let mongoDB = 'mongodb://localhost:27017/locallibrary?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false';
let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(mongoDB, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(compression()); // Compress all routes

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

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
