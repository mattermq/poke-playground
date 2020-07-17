const express = require('express');
const User = require('../models/user.js');

const router = express.Router();

// GET profile page
router.get('/', async (req, res) => {
  const { _id, nickname: username } = req.session.passport.user;

  const user = await User.findById(_id);

  console.log(user);



  res.render('profile', { username });
});

module.exports = router;
