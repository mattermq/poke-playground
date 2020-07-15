const express = require('express');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
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

    res.render('index', { pokeImgUrl, pokeName });
  } else {
    const { pokeImgUrl, pokeName } = req.cookies;

    res.render('index', { pokeImgUrl, pokeName });
  }
});

module.exports = router;
