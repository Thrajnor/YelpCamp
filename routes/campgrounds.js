var express = require("express")
var router = express.Router()

var Comment = require('../models/comment')
var Camp = require('../models/camp')
var User = require('../models/user')
var middleware = require('../middleware')

// CAMPGROUNDS ROUTES =========================================================================================

// INDEX ROUTE ========================================

router.get('/campgrounds', function(req, res) {
  Camp.find({}, function(err, campgrounds) {
    if (err) {
      req.flash('error', "Campgrounds Not Found")
      res.redirect('/campgrounds')
    }
    else {
      res.render('campgrounds/index', {
        campgrounds: campgrounds
      })
    }
  })
})

// CREATE ROUTE =======================================

router.get('/campgrounds/new', middleware.isLogedIn, function(req, res) {
  res.render('campgrounds/new')
})

router.post('/campgrounds', middleware.isLogedIn, function(req, res) {
  req.body.camp.desc = req.sanitize(req.body.camp.desc)
  req.body.camp.author = {
    id: req.user._id,
    username: req.user.username
  }
  Camp.create(req.body.camp, function(err, camp) {
    if (err) {
      req.flash('error', "Can't Create Campground")
      res.redirect('/campgrounds')
    }
    else {
      // redirect
      req.flash('success', "Campground Created Successfully")
      res.redirect('/campgrounds/' + camp._id)
    }
  })
})

// SHOW ROUTE =========================================

router.get('/campgrounds/:id', function(req, res) {
  Camp.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
    if (err) {
      req.flash('error', "Campground Not Found")
      res.redirect('/campgrounds')
    }
    else {
      res.render('campgrounds/show', {
        campground: foundCampground,
      })
    }
  })
})

// EDIT ROUTE =========================================

router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, function(req, res) {
  req.body.camp.desc = req.sanitize(req.body.camp.desc)
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp) {
    if (err) {
      req.flash('error', "Campground Not Found")
      res.redirect('/campgrounds')
    }
    else {
      req.flash('success', "Campground Edited Successfully")
      res.redirect('back')
    }
  })
})

// DELETE ROUTE =======================================

router.get('/campgrounds/:id/delete', middleware.checkCampgroundOwnership, function(req, res) {
  res.render('campgrounds/delete', {
    id: req.params.id
  })
})

router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Camp.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      req.flash('error', "Campground Not Found")
      res.redirect('back')
    }
    else {
      req.flash('success', 'Campground Deleted')
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
      req.flash('error', "Campground Not Found, search only by exact name sorry for inconvenience")
      res.redirect('/campgounds')
    }
    else if (camp[0] != null) {
      return res.redirect('/campgrounds/' + camp[0]._id)
    }
    else {
      req.flash('error', "Campground Not Found, search only by exact name sorry for inconvenience")
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router
