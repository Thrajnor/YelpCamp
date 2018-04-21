var express = require('express')
var methodOverride = require("method-override")
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var moment = require('moment')
var expressSanitizer = require("express-sanitizer")
var Camp = require('./models/camp')
var Comment = require('./models/comment')
var seedDB = require("./seeds");

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(expressSanitizer('_method'))
mongoose.connect('mongodb://localhost/yelp_camp')

seedDB()

// LANDING ROUTE ==============================================================================================

app.get('/', function(req, res) {
  res.redirect('/campgrounds')
})

// INDEX ROUTE ================================================================================================

app.get('/campgrounds', function(req, res) {
  Camp.find({}, function(err, campgrounds) {
    if (err) {
      return console.log(err)
    }
    else {
      res.render('index', {
        campgrounds: campgrounds
      })
    }
  })
})

// CREATE ROUTE ===============================================================================================

app.get('/campgrounds/new', function(req, res) {
  res.render('new')
})

app.post('/campgrounds', function(req, res) {
  req.body.camp.desc = req.sanitize(req.body.camp.desc)
  Camp.create(req.body.camp, function(err, camp) {
    if (err) {
      return console.log(err)
    }
    else {
      res.redirect('/campgrounds')
    }
  })
})


// COMMENT CREATE =============================================================================================

app.post('/campgrounds/:id/comment', function(req, res) {
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
          camp.comments.push(comment)
          camp.save()
          res.redirect('/campgrounds/' + req.params.id)
        }
      })
    }
  })
})

// SHOW ROUTE =================================================================================================

app.get('/campgrounds/:id', function(req, res) {
  Camp.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
    if (err) {
      return console.log(err)
    }
    else {
      var author = 'Guest'
      res.render('show', {
        campground: foundCampground,
        author: author
      })
    }
  })
})

// EDIT ROUTE =================================================================================================

app.post('/campgrounds/:id/edit', function(req, res) {
  req.body.camp.desc = req.sanitize(req.body.camp.desc)
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp) {
    if (err) {
      return console.log(err)
    }
    else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

// DELETE ROUTE ===============================================================================================

app.get('/campgrounds/:id/delete', function(req, res) {
  res.render('delete', {
    id: req.params.id
  })
})

app.delete('/campgrounds/:id', function(req, res) {
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

app.search('/campgrounds', function(req, res) {
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

// BUG ROUTE ==================================================================================================

app.get('campgrounds/bug', function(req, res) {})

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('YELP CAMP server has started !')
})
