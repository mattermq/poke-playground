const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => {
  let username;
  if (req.isAuthenticated()) {
    username = req.session.passport.user.nickname;
  }

  res.render('login', { username });
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

router.get('/exit', (req, res) => {
  req.logout();
  res.redirect('/');
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = router;
