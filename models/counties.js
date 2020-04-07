let mongoose = require('mongoose')

let CountySchema = new mongoose.Schema({
  counties: [String]
},
{
  collection: 'counties'
})

mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('County', CountySchema)