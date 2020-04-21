let mongoose = require('mongoose')

let DeliverySchema = new mongoose.Schema({
  title: {
    type: String
  },
  status: {
    type: String
  },
  size: {
    type: String,
  },
  pLine1: {
    type: String,
  },
  pLine2: {
    type: String,
  },
  pTown: {
    type: String,
  },
  pCounty: {
    type: String,
  },
  pEircode: {
    type: String,
  },
  dLine1: {
    type: String,
  },
  dLine2: {
    type: String,
  },
  dTown: {
    type: String,
  },
  dCounty: {
    type: String,
  },
  dEircode: {
    type: String,
  },
  itemID: {
    type: mongoose.Schema.Types.ObjectId
  },
  buyerName: {
    type: String
  },
  buyerNumber: {
    type: String
  },
  driverID: {
    type: mongoose.Schema.Types.ObjectId
  },
  estCharge: {
    type: Number
  },
  sellerName: {
    type: String
  },
  sellerNumber: {
    type: String
  },
  pdatetime: {
    type: String
  },
  ddatetime: {
    type: String
  }
},
{
  collection: 'deliveries'
})

mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('Delivery', DeliverySchema)