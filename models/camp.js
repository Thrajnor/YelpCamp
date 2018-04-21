var mongoose = require("mongoose");


var campSchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})
var Camp = mongoose.model('Camp', campSchema)
module.exports = Camp
