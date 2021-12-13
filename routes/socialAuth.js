const express = require('express')
const router = express.Router()
const SocialAuthController = require('../controllers/SocialAuthController')
const passport = require('passport');
require('../strategies/googleStrategy');
require('../strategies/facebookStrategy');

// GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  SocialAuthController.authenticate
);

// FACEBOOK
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failedRedirect: '/' }), 
  SocialAuthController.authenticate);

router.get('/success', function(req, res) {
  res.send('Success')
})

module.exports = router;