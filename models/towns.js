let mongoose = require('mongoose')

let TownSchema = new mongoose.Schema({
  county: {
    type: String,
    required: true
  },
  town: {
    type: String,
    required: true
  }
},
{
  collection: 'towns'
})

mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('Town', TownSchema)