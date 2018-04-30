const express = require('express');
const router = express.Router();
const foodList = require('../assets/json/foodList');

router.get('/', (req, res) => {
  res.render('index/home', {
    goodFoods: foodList.goodFoods,
    badFoods: foodList.badFoods,
    sometimesFoods: foodList.sometimesFoods
  });
});

module.exports = router;
