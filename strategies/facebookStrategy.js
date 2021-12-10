const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const url = 'http://localhost:3000'
const clientID = '460238719047350';
const clientSecret = '8c60794725e89d0799c77514f1afb8f3';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

// make facebook strategy
passport.use(new facebookStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: `/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name']
}, function(token, refreshToken, profile, done) {
  profile.token = token;
  return done(null, profile);
}));