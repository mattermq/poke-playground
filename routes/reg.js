const express = require('express');

const router = express.Router();

// GET reg page
router.get('/', (req, res) => {
  res.render('reg');
});

// POST new user
router.post('/', (req, res) => {
  console.log(req.body);
})

module.exports = router;
