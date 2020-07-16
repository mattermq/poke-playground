const express = require('express');

const router = express.Router();

// GET Flappy Bird Page
router.get('/', (req, res) => {
  let username;
  if (req.isAuthenticated()) {
    username = req.session.passport.user.nickname;
  }

  res.render('flappyBird', { username });
});

module.exports = router;
