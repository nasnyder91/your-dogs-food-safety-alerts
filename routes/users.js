const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

// Load User Model
require('../models/User');
const User = mongoose.model('users');
require('../models/FoodList');
const UserFoodList = mongoose.model('foodlists');

router.get('/login', (req,res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: false
  })(req,res,next);
});

router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password !== req.body.password2){
    errors.push({text: 'Passwords due not match!'});
  }
  if(req.body.password.length < 5){
    errors.push({text: 'Passwords must be at least 5 characters long'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      username: req.body.username,
      password: req.body.password,
      password2: ''
    });
  } else{
    User.findOne({username: req.body.username.toLowerCase()})
      .then(user => {
        if(user){
          console.log('Username already taken.')
          res.render('users/register');
        } else{
          const newUser = new User({
            username: req.body.username.toLowerCase(),
            usernameDisplayed: req.body.username,
            password: req.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  console.log('New user registered');
                  const newUserList = new UserFoodList({
                    savedFoods: [],
                    user: user.id
                  });
                  newUserList.save()
                    .then(() => {
                      res.redirect('/users/login');
                    });
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      })
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  console.log('Logged Out');
  res.redirect('/');
});

module.exports = router;
