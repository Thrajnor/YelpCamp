var express = require("express")
var router = express.Router()

var passport = require("passport")

var User = require('../models/user')

// AUTH ROUTES ================================================================================================

// REGISTER ===========================================

router.get('/register', function(req, res) {
  res.render('auth/register')
})

router.post('/register', function(req, res) {
  var newUser = new User({
    username: req.body.username
  })
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash('error', err.message)
      res.redirect('back')
    }
    else {
      passport.authenticate('local')(req, res, function() {
        req.flash('success', "Successfully Created account! Nice to meet you " + user.username + '!')
        res.redirect('/')
      })
    }
  })
})

// LOGIN ==============================================

router.get('/login', function(req, res) {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}), function(req, res) {})

// LOGOUT =============================================

router.get('/logout', function(req, res) {
  req.logout()
  req.flash('success', "I've Logged You Out Successfully")
  res.redirect('/')
})

module.exports = router
