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

router.get('/assets/json/foodList.json', (req,res) => {
  let foodListAll = foodList.goodFoods;
  foodListAll = foodListAll.concat(foodList.badFoods);
  foodListAll = foodListAll.concat(foodList.sometimesFoods);
  let matchedFood = [];
  if(req.query.search === ''){
    res.send(matchedFood);
  } else{
    for(let i = 0; i < foodListAll.length; i++){
      if(foodListAll[i].name.toLowerCase().includes(req.query.search.toLowerCase())){
        matchedFood.push(foodListAll[i]);
      }

      if(matchedFood.length === 6){
        break;
      }
    }

    res.send(matchedFood);
  }
});

module.exports = router;
