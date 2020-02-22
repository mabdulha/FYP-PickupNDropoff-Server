let mongoose = require('mongoose')

let ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
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