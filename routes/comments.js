var express = require("express")
var router = express.Router()

var Comment = require('../models/comment')
var Camp = require('../models/camp')
var User = require('../models/user')
var middleware = require('../middleware')


// COMMENTS ROUTES ============================================================================================

// COMMENT CREATE =====================================

router.post('/campgrounds/:id/comment', middleware.isLogedIn, function(req, res) {
  req.body.comment.text = req.sanitize(req.body.comment.text)
  Comment.create(req.body.comment, function(err, comment) {
    if (err) {
      return console.log(err)
    }
    else {
      Camp.findById(req.params.id, function(err, camp) {
        if (err) {
          console.log(err)
        }
        else {
          User.findById(req.user._id, function(err, user) {
            if (err) {
              console.log(err)
            }
            else {
              // user push
              user.comments.push(comment)
              user.save()
              // comment push
              comment.author.id = user._id
              comment.author.username = user.username
              comment.save()
              // camp push
              camp.comments.push(comment)
              camp.save()
              res.redirect('/campgrounds/' + req.params.id)
            }
          })
        }
      })
    }
  })
})

// COMMENT DELETE =====================================

router.get('/campgrounds/:id/comments/:comment_id/delete', middleware.checkCommentOwnership, function(req, res) {
  res.render('comments/deleteComment', {
    id: req.params.id,
    comment_id: req.params.comment_id
  })
})

router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

// COMMENT EDIT =======================================

router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  req.body.comment.text = req.sanitize(req.body.comment.text)
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
    if (err) {
      return console.log(err)
    }
    else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router
