const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(new LocalStrategy((username, password, done) => {
    username = username.toLowerCase();
    User.findOne({
      username: username
    })
      .then(user => {
        if(!user){
          console.log('user not found');
          return done(null, false, {message: 'User not found!'});
        }

        bcrypt.compare(password, user.password, (err, match) => {
          if(err) throw err;

          if(match){
            console.log('Logging in');
            done(null, user);
          } else{
            console.log('incorrect password');
            done(null, false, {message: 'Incorrect Password'});
          }
        });
      });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
