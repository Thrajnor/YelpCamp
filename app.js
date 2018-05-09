// WELCOME IN YELP CAMP SERVER FILE !!!!!!!!!!!

// DEPENDENCIES ===============================================================================================

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
var flash = require("connect-flash")
var Camp = require('./models/camp')
var User = require('./models/user')
var app = express()

// ROUTES REQUIRE =====================================

var campgroundRoutes = require('./routes/campgrounds')
var authRoutes = require('./routes/auth')
var commentsRoutes = require('./routes/comments')

// SETUP ======================================================================================================

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(expressSanitizer('_method'))

console.log(process.env.DATABASEURL)
// mongoose.connect('mongodb://localhost/yelp_camp')
// mongoose.connect('mongodb://Thrajnor:7757@ds016098.mlab.com:16098/marcinyelpcamp')
// mongoose.connect('process.env.DATABASEURL')

app.use(require("express-session")({
  secret: 'Natalia is again the best',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  res.locals.warning = req.flash('warning')
  next()
})

// DATABASE SEED ==v
// seedDB()
// ./seeds.js =====^

// LANDING ROUTE =================
app.get('/', function(req, res) {
  res.render('landing')
})
// ===============================

// CAMPGROUNDS ROUTES ====
app.use(campgroundRoutes)
// =======================

// COMMENT ROUTES ========
app.use(commentsRoutes)
// =======================

// AUTH ROUTES ===========
app.use(authRoutes)
// =======================



// WRONG ADRESS ROUTE ============
app.get('*', function(req, res) {
  res.render('wrong')
})
// ===============================


// LISTEN FOR REQUESTS ========================================================================================

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('YELP CAMP server has started !')
})
