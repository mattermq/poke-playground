const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const sha256 = require('sha256');
require('dotenv').config();

// Passport.js
const passport = require('passport');
const passportSession = require('passport-session');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user.js');

const indexRouter = require('./routes/index');
const regRouter = require('./routes/reg.js');
const loginRouter = require('./routes/login.js');
const flappyBirdRouter = require('./routes/flappyBird.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// express-session
app.use(session({
  secret: 'askdfenadf',
  resave: false,
  saveUninitialized: false,
}));

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  (username, password, done) => {
    const hashPass = sha256(password);

    User.findOne({ nickname: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== hashPass) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  },
));

function authMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };
}

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use('/', indexRouter);
app.use('/reg', regRouter);
app.use('/login', loginRouter);
app.use('/fb', authMiddleware(), flappyBirdRouter);

app.listen(process.env.PORT || 3000);
