const express = require('express');
const User = require('../models/user.js');

const router = express.Router();

// GET leaderboard page
router.get('/', async (req, res) => {
  let username;
  if (req.isAuthenticated()) {
    username = req.session.passport.user.nickname;
  }

  let users = await User.find();
  users = users.filter((el) => {
    if (el.fbScores.length || el.arkScores.length) {
      return true;
    }

    return false;
  });

  users.forEach((user) => {
    if (user.fbScores.length) {
      user.fbScores = user.fbScores.map((el) => el.score);
      user.highFbScore = Math.max.apply(null, user.fbScores);
    }

    if (user.arkScores.length) {
      user.arkScores = user.arkScores.map((el) => el.score);
      user.highArkScore = Math.max.apply(null, user.arkScores);
    }
  });

  const fbUsersArray = users.filter((user) => {
    if (user.highFbScore) return true;

    return false;
  });

  const arkUsersArray = users.filter((user) => {
    if (user.highArkScore) return true;

    return false;
  });

  fbUsersArray.forEach((el) => console.log(el.highFbScore))
  fbUsersArray.sort((a, b) => {
    if (a.highFbScore < b.highFbScore) return 1;

    return -1;
  });
  arkUsersArray.sort((a, b) => {
    if (a.highArkScore < b.highArkScore) return 1;

    return -1;
  });

  res.render('leaderb', { username, fbUsersArray, arkUsersArray });
});

module.exports = router;
