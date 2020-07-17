const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// GET Pokemon of The Day page
router.get('/', async (req, res) => {
  let username;
  if (req.isAuthenticated()) {
    username = req.session.passport.user.nickname;
  }

  const randomPokeId = Math.floor(1 + Math.random() * 807);

  if (!req.cookies.pokeImgUrl) {
    const pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokeId}`);
    const pokeJson = await pokeData.json();

    const pokeName = pokeJson.name[0].toUpperCase() + pokeJson.name.slice(1);
    console.log(pokeName);
    const pokeImgUrl = pokeJson.sprites.front_default;

    res.cookie('pokeImgUrl', pokeImgUrl, {
      maxAge: 3600000 /* Day - 86400000 */,
      httpOnly: true,
    });
    res.cookie('pokeName', pokeName, {
      maxAge: 3600000 /* Day - 86400000 */,
      httpOnly: true,
    });

    res.render('poke', { username, pokeImgUrl, pokeName });
  } else {
    const { pokeImgUrl, pokeName } = req.cookies;

    res.render('poke', { username, pokeImgUrl, pokeName });
  }
});

module.exports = router;
