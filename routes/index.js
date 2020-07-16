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

  const randomPokeId = Math.floor(1 + Math.random() * 807);

  if (!req.cookies.pokeImgUrl) {
    const pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokeId}`);
    const pokeJson = await pokeData.json();

    const pokeName = pokeJson.name;
    const pokeImgUrl = pokeJson.sprites.front_default;

    res.cookie('pokeImgUrl', pokeImgUrl, {
      maxAge: 86400000,
      httpOnly: true,
    });
    res.cookie('pokeName', pokeName, {
      maxAge: 86400000,
      httpOnly: true,
    });

    res.render('index', { username, pokeImgUrl, pokeName });
  } else {
    const { pokeImgUrl, pokeName } = req.cookies;

    res.render('index', { username, pokeImgUrl, pokeName });
  }
});

module.exports = router;
