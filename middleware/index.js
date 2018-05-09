var Comment = require('../models/comment')
var Camp = require('../models/camp')
var User = require('../models/user')

// FUNCTIONS ======================================================================================

var middlewareObj = {}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err || !comment) {
        req.flash('error', 'Campground Not Found')
        res.redirect('back')
      }
      else {
        if (comment.author.id.equals(req.user.id) || req.user.isAdmin) {
          next()
        }
        else {
          req.flash('error', "You don't have permisson to do that")
          res.redirect('back')
        }
      }
    })
  }
  else {
    req.flash('error', 'Please login first to do that!')
    res.redirect('/login')
  }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id, function(err, camp) {
      if (err || !camp) {
        req.flash('error', 'Campground Not Found')
        res.redirect('back')
      }
      else {
        if (camp.author.id.equals(req.user.id) || req.user.isAdmin) {
          next()
        }
        else {
          req.flash('error', "You don't have permisson to do that")
          res.redirect('back')
        }
      }
    })
  }
  else {
    req.flash('error', 'Please login first to do that!')
    res.redirect('/login')
  }
}

middlewareObj.isLogedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error', 'Please login first to do that!')
  res.redirect('/login')
}

module.exports = middlewareObj
