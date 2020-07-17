const express = require('express');
const sha256 = require('sha256');
const User = require('../models/user.js');

const router = express.Router();

// GET reg page
router.get('/', (req, res) => {
  let username;
  if (req.isAuthenticated()) {
    username = req.session.passport.user.nickname;
  }

  res.render('reg', { username });
});

// POST new user
router.post('/', async (req, res) => {
  const { username, nickname, password } = req.body;

  const newUser = new User({
    username,
    nickname,
    password: sha256(password),
  });

  try {
    await newUser.save();
    res.json({ success: true });
  } catch (err) {
    if (err.message.startsWith('E11000')) {
      res.json({ duplicate: true });
    }
    res.json({ anotherErr: true });
  }
});

module.exports = router;
