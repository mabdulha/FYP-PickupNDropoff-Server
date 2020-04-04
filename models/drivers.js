/* eslint-disable no-useless-escape */
let mongoose = require('mongoose')

let DriverSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regex to validate email address
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    match: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
  },
  license: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  aLine1: {
    type: String,
    required: true
  },
  aLine2: {
    type: String,
    required: true
  },
  aTown: {
    type: String,
    required: true
  },
  aCounty: {
    type: String,
    required: true
  },
  aEircode: {
    type: String,
    required: true
  },
  preferredTowns: [String]
},
{
  collection: 'drivers'
})

mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('Driver', DriverSchema)