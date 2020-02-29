let mongoose = require('mongoose')

let ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageurl: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
},
{
  collection: 'items'
})

mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('Item', ItemSchema)