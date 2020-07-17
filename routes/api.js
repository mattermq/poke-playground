const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.patch('/scores/:game', async (req, res) => {
  const user = await User.findById(req.session.passport.user._id);

  if (req.params.game === 'fb') {
    const { score } = req.body;

    user.fbScores.push({ date: Date.now(), score });
    await user.save();
  } else if (req.params.game === 'ark') {
    const { score } = req.body;

    user.arkScores.push({ date: Date.now(), score });
    await user.save();
  }
});

module.exports = router;
