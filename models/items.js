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
  pLine1: {
    type: String,
    required: true
  },
  pLine2: {
    type: String,
    required: false
  },
  pTown: {
    type: String,
    required: true
  },
  pCounty: {
    type: String,
    required: true
  },
  pEircode: {
    type: String,
    required: true
  },
  pGeometry: [
    {
      _id: false,
      plat: {type: Number},
      plng: {type: Number}
    }
  ],
  dLine1: {
    type: String,
    required: false
  },
  dLine2: {
    type: String,
    required: false
  },
  dTown: {
    type: String,
    required: false
  },
  dCounty: {
    type: String,
    required: false
  },
  dEircode: {
    type: String,
    required: false
  },
  dGeometry: [
    {
      _id: false,
      dlat: {type: Number},
      dlng: {type: Number}
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  }
},
{
  collection: 'items'
})

mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('Item', ItemSchema)