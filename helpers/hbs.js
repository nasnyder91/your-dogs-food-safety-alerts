const mongoose = require('mongoose');

require('../models/FoodList');
const userFoodLists = mongoose.model('foodlists');

module.exports = {
  updateUserList: function(userID, foodItem){
    let updatedList;
    let message = '';
    userFoodLists.findOne({user: userID})
      .then(userList => {
        updatedList = userList.savedFoods;
        console.log(updatedList);
        if(updatedList.includes(foodItem)){
          updatedList.splice(updatedList.indexOf(foodItem), 1);
          message = 'Food Item Removed';
        } else{
          updatedList.push(foodItem);
          message = 'Food Item Added';
        }

        const newFoodList = new userFoodLists({
          savedFoods: updatedList,
          user: userID
        });

        userFoodLists.remove({user: userID})
          .then(() => {
            newFoodList.save()
              .then(() => {
                console.log(message);
              });
          });
      })
      .catch(err => console.log(err));
  }
}
