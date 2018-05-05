var Comment = require('../models/comment')
var Camp = require('../models/camp')
var User = require('../models/user')

// FUNCTIONS ======================================================================================

var middlewareObj = {}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        console.log(err)
      }
      else {
        if (comment.author.id.equals(req.user.id)) {
          next()
        }
        else {
          res.redirect('back')
        }
      }
    })
  }
  else {
    res.redirect('/login')
  }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id, function(err, camp) {
      if (err) {
        console.log(err)
      }
      else {
        if (camp.author.id.equals(req.user.id)) {
          next()
        }
        else {
          res.redirect('back')
        }
      }
    })
  }
  else {
    res.redirect('/login')
  }
}

middlewareObj.isLogedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = middlewareObj
