const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index');
const regRouter = require('./routes/reg.js');
const flappyBirdRouter = require('./routes/flappyBird.js');
const usersRouter = require('./routes/users');
const { Mongoose } = require('mongoose');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use('/', indexRouter);
app.use('/reg', regRouter);
app.use('/fb', flappyBirdRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT || 3000);
