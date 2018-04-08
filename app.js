var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost/yelp_camp')

var campSchema = new mongoose.Schema({
  name: String,
  image: String
})
var camp = mongoose.model('camp', campSchema)

app.get('/', function (req, res) {
  res.render('landing')
})

app.get('/campgrounds', function (req, res) {
  camp.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds', {campgrounds: campgrounds})
    }
  })
})

app.post('/campgrounds', function (req, res) {
  var newCamp = {
    name: req.body.name,
    image: req.body.image
  }
  camp.create(newCamp, function (err, camp) {
    if (err) {
      console.log(err)
    } else {
      console.log(camp)
    }
  })
  res.redirect('/campgrounds')
})

app.get('/campgrounds/new', function (req, res) {
  res.render('new')
})

app.listen(process.env.PORT, process.env.IP, function () {
  console.log('server has started !')
})
