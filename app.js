const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Load Routes Files
const index = require('./routes/index');
const users = require('./routes/users');

// Load models
require('./models/User');
require('./models/FoodList');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect mongoose
mongoose.connect('mongodb://Nick:10536087@ds113358.mlab.com:13358/dogsafe_dev')
  .then(() => console.log('Mongoose Connected...'))
  .catch(err => console.log(err));

//Handlebar helpers
const {
  cardColor
} = require('./helpers/hbs');

// Passport config
require('./config/passport')(passport);

// Express Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    cardColor: cardColor
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
  secret: 'secret',
  // cookie: {
  //           maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  //         },
  // store: store,
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;

  next();
});

// Use Routes
app.use('/', index);
app.use('/users', users);





const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Server started on port ' + port);
});
