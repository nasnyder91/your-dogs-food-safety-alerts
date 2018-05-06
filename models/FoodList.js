const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodListSchema = new Schema({
  savedFoods: {
    type: Array,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  dateUpdated: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('foodlists', FoodListSchema);
