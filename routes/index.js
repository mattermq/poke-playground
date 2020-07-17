const express = require('express');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  let username;
  if (req.isAuthenticated()) {
    username = req.session.passport.user.nickname;
  }

  res.render('index', { username });
});

module.exports = router;
