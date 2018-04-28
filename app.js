var passportLocalMongoose = require("passport-local-mongoose")
var expressSanitizer = require("express-sanitizer")
var methodOverride = require("method-override")
var LocalStrategy = require("passport-local")
var bodyParser = require('body-parser')
var passport = require("passport")
var mongoose = require('mongoose')
var Comment = require('./models/comment')
var express = require('express')
var moment = require('moment')
var seedDB = require("./seeds")
var Camp = require('./models/camp')
var User = require('./models/user')
var app = express()


app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(expressSanitizer('_method'))
mongoose.connect('mongodb://localhost/yelp_camp')

app.use(require("express-session")({
  secret: 'Natalia is again the best',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

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

app.get('/campgrounds/new', isLogedIn, function(req, res) {
  res.render('new')
})

app.post('/campgrounds', isLogedIn, function(req, res) {
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

app.post('/campgrounds/:id/comment', isLogedIn, function(req, res) {
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

app.post('/campgrounds/:id/edit', isLogedIn, function(req, res) {
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

app.get('/campgrounds/:id/delete', isLogedIn, function(req, res) {
  res.render('delete', {
    id: req.params.id
  })
})

app.delete('/campgrounds/:id', isLogedIn, function(req, res) {
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

// AUTH ROUTES ================================================================================================

// REGISTER ===========================================

app.get('/register', function(req, res) {
  res.render('register')
})

app.post('/register', function(req, res) {
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
        res.render('registered')
      })
    }
  })
})

// LOGIN ==============================================

app.get('/login', function(req, res) {
  res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}), function(req, res) {})

// LOGOUT =============================================

app.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

// BUG ROUTE ==================================================================================================

app.get('campgrounds/bug', function(req, res) {})

// FUNCTIONS ==================================================================================================

function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('YELP CAMP server has started !')
})
