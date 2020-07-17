const express = require('express');

const router = express.Router();

// GET Arkanoid Page
router.get('/', (req, res) => {
  let username;
  if (req.isAuthenticated()) {
    username = req.session.passport.user.nickname;
  }

  res.render('arkanoid', { username });
});

module.exports = router;
