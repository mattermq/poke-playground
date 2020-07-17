const express = require('express');
const User = require('../models/user.js');

const router = express.Router();

// GET profile page
router.get('/', async (req, res) => {
  const { _id, nickname: username } = req.session.passport.user;

  const user = await User.findById(_id);

  const { fbScores, arkScores } = user;

  fbScores.forEach((el) => {
    const date = new Date(el.date);
    el.date = `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
  });

  arkScores.forEach((el) => {
    const date = new Date(el.date);
    el.date = `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
  });

  res.render('profile', { username, fbScores, arkScores });
});

module.exports = router;
