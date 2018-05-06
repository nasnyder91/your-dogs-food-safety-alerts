const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const foodList = require('../assets/json/foodList');

require('../models/FoodList');
const userFoodLists = mongoose.model('foodlists');

router.get('/', (req, res) => {
  res.render('index/home', {
    goodFoods: foodList.goodFoods,
    badFoods: foodList.badFoods,
    sometimesFoods: foodList.sometimesFoods
  });
});

router.get('/myfoodalerts', (req, res) => {
  console.log(12341);
});

router.post('/updatefoodlist', (req, res) => {
  let updatedList;
  let message = '';
  userFoodLists.findOne({user: req.body.userID})
    .then(userList => {
      updatedList = userList.savedFoods;
      if(updatedList.includes(req.body.foodItem)){
        updatedList.splice(updatedList.indexOf(req.body.foodItem), 1);
        message = 'Food Item Removed';
      } else{
        updatedList.push(req.body.foodItem);
        message = 'Food Item Added';
      }

      const newFoodList = new userFoodLists({
        savedFoods: updatedList,
        user: req.body.userID
      });

      userFoodLists.remove({user: req.body.userID})
        .then(() => {
          newFoodList.save()
            .then(() => {
              console.log(message);
            });
        });
    })
    .catch(err => console.log(err));
});

// Get list of food from file
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
