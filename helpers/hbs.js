const mongoose = require('mongoose');
const foodList = require('../assets/json/foodList');

require('../models/FoodList');
const userFoodLists = mongoose.model('foodlists');

module.exports = {
  cardColor: function(safety){
    switch(safety){
      case 'good':
        return 'green';
        break;

      case 'sometimes':
        return 'grey';
        break;

      case 'bad':
        return 'red';
        break;

      default:
        return 'grey';
    }
  }
}
