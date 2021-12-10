const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  return done(null, id);
});

passport.use(new GoogleStrategy({
    clientID: '183419730390-glnimrbvg11g5i7lcf1lv5nhs3rdcdfd.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3001/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    profile.token = accessToken;
    return done(null, profile);
  }
));