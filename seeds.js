var mongoose = require('mongoose')
var Camp = require('./models/camp')
var Comment = require('./models/comment')
var User = require("./models/user")

var data = [{
    name: 'Salmon Creek',
    image: 'https://farm4.staticflickr.com/3872/15119367505_f52d0d729e.jpg',
    desc: 'description for Salmon Creek',
    author: { username: 'Dummy Noone' },
    price: "3"
  },
  {
    name: "cat's hiccup",
    image: 'https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg',
    desc: "description for cat's hiccup",
    author: { username: 'Dummy Noone' },
    price: "7"
  },
  {
    name: 'fish fungal',
    image: 'https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg',
    desc: 'description for fish fungal',
    author: { username: 'Dummy Noone' },
    price: "5"
  },
  {
    name: 'Kitten lair',
    image: 'https://farm9.staticflickr.com/8579/16706717975_bdc99767d7.jpg',
    desc: 'description for Kitten lair',
    author: { username: 'Dummy Noone' },
    price: '40'
  },
  {
    name: 'Koci Karton',
    image: 'https://farm7.staticflickr.com/6147/6040800665_f931d1ee3c.jpg',
    desc: 'description for Koci Karton',
    author: { username: 'Dummy Noone' },
    price: '15.99'
  },
  {
    name: "Troll camp",
    image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg",
    desc: "An camp where you will be trolled",
    author: { username: 'Dummy Noone' },
    price: '0'
  }
]

function seedDB() {
  // remove all campgrounds
  Camp.remove({}, function(err) {
    if (err) {
      console.log(err)
    }
    else {
      console.log('campgrounds has been removed')
      Comment.remove({}, function(err) {
        if (err) {
          console.log(err)
        }
        else {
          console.log('comments has been removed')
          User.remove({}, function(err) {
            if (err) {
              console.log(err)
            }
            else {
              data.forEach(function(seed) {
                Camp.create(seed, function(err, camp) {
                  if (err) {
                    console.log(err)
                  }
                  else {
                    console.log('campground create !')
                    Comment.create({
                      text: 'This place is great but i wish there was internet !!!',
                      author: {
                        username: 'Dummy Comment'
                      }
                    }, function(err, comment) {
                      if (err) {
                        console.log(err)
                      }
                      else {
                        camp.comments.push(comment)
                        camp.save()
                        console.log('created Comment !')
                      }
                    })
                  }
                })
              })
            }
          })
        }
      })
    }
  })
  // add new campgrounds
}

module.exports = seedDB
