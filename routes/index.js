const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const foodList = require('../assets/json/foodList');
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/FoodList');
const userFoodLists = mongoose.model('foodlists');

router.get('/', (req, res) => {
  res.render('index/home', {
    goodFoods: foodList.goodFoods,
    badFoods: foodList.badFoods,
    sometimesFoods: foodList.sometimesFoods
  });
});

router.get('/myfoodalerts', ensureAuthenticated, (req, res) => {
  userFoodLists.findOne({user: req.user.id})
    .then(foodList => {
      res.render('index/myfoodalerts', {
        foodList: foodList.savedFoods
      });
    });
});

router.post('/updatefoodlist', (req, res) => {
  let updatedList;
  let message = '';
  const newFood = {
    name: req.body.foodName,
    description: req.body.foodDes,
    safety: req.body.safety
  };
  userFoodLists.findOne({user: req.body.userID})
    .then(userList => {
      updatedList = userList.savedFoods;

      updatedList.forEach((food, index) => {
        if(food.name === req.body.foodName){
          updatedList.splice(index, 1);
          message = 'Food Item Removed';
        }
      });
      if(message === ''){
        updatedList.push(newFood);
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
              res.send(message);
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
