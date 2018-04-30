var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")


var UserSchema = new mongoose.Schema({
  username: String,
  passport: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  camps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp'
  }]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
