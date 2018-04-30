var express = require("express")
var router = express.Router()

var passport = require("passport")

var Comment = require('../models/comment')
var Camp = require('../models/camp')
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
      console.log(err)
      return res.redirect('register')
    }
    else {
      passport.authenticate('local')(req, res, function() {
        res.render('auth/registered')
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
  res.redirect('/')
})
// FUNCTIONS ==================================================================================================

function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router
