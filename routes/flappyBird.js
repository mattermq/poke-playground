const express = require('express');

const router = express.Router();

// GET Flappy Bird Page
router.get('/', (req, res) => {
  res.render('flappyBird');
})


module.exports = router;
