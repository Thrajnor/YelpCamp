var express = require("express")
var router = express.Router()

var Comment = require('../models/comment')
var Camp = require('../models/camp')
var User = require('../models/user')

// CAMPGROUNDS ROUTES =========================================================================================

// INDEX ROUTE ========================================

router.get('/campgrounds', function(req, res) {
  Camp.find({}, function(err, campgrounds) {
    if (err) {
      return console.log(err)
    }
    else {
      res.render('campgrounds/index', {
        campgrounds: campgrounds
      })
    }
  })
})

// CREATE ROUTE =======================================

router.get('/campgrounds/new', isLogedIn, function(req, res) {
  res.render('campgrounds/new')
})

router.post('/campgrounds', isLogedIn, function(req, res) {
  req.body.camp.desc = req.sanitize(req.body.camp.desc)
  req.body.camp.author = {
    id: req.user._id,
    username: req.user.username
  }
  Camp.create(req.body.camp, function(err, camp) {
    if (err) {
      return console.log(err)
    }
    else {
      // redirect
      res.redirect('/campgrounds/' + camp._id)
    }
  })
})

// SHOW ROUTE =========================================

router.get('/campgrounds/:id', function(req, res) {
  Camp.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
    if (err) {
      return console.log(err)
    }
    else {
      res.render('campgrounds/show', {
        campground: foundCampground,
      })
    }
  })
})

// EDIT ROUTE =========================================

router.post('/campgrounds/:id/edit', checkCampgroundOwnership, function(req, res) {
  req.body.camp.desc = req.sanitize(req.body.camp.desc)
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp) {
    if (err) {
      return console.log(err)
    }
    else {
      res.redirect('back')
    }
  })
})

// DELETE ROUTE =======================================

router.get('/campgrounds/:id/delete', checkCampgroundOwnership, function(req, res) {
  res.render('campgrounds/delete', {
    id: req.params.id
  })
})

router.delete('/campgrounds/:id', checkCampgroundOwnership, function(req, res) {
  Camp.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.send(alert('Your camground cannot be delete right now, try again later'))
      return console.log(err)
    }
    else {
      res.redirect('/campgrounds')
    }
  })
})

// SEARCH ROUTE ===============================================================================================

router.search('/campgrounds', function(req, res) {
  Camp.find({
    'name': req.body.search
  }, function(err, camp) {
    if (err) {
      res.redirect('/campground')
    }
    else if (camp[0] != null) {
      return res.redirect('/campgrounds/' + camp[0]._id)
    }
    else {
      res.redirect('/campgrounds')
    }
  })
})

function checkCampgroundOwnership(req, res, next) {
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
    res.redirect('back')
  }
}

function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('back')
}

module.exports = router
