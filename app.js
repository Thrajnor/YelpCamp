var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/yelp_camp')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

var campgrounds = [
  {
    name: 'Salmon Creek',
    image: 'https://farm4.staticflickr.com/3872/15119367505_f52d0d729e.jpg'
  },
  {
    name: "cat's hiccup",
    image: 'https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg'
  },
  {
    name: 'fish fungal',
    image: 'https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg'
  }
]

app.get('/', function (req, res) {
  res.render('landing')
})

app.get('/campgrounds', function (req, res) {
  res.render('campgrounds', {
    campgrounds: campgrounds
  })
})

app.post('/campgrounds', function (req, res) {
  var newCamp = {
    name: req.body.name,
    image: req.body.image
  }
  campgrounds.push(newCamp)
  res.redirect('/campgrounds')
})

app.get('/campgrounds/new', function (req, res) {
  res.render('new')
})

app.listen(process.env.PORT, process.env.IP, function () {
  console.log('server has started !')
})
