/* eslint-disable no-useless-escape */
let mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
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
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  avatar: {
    type: String,
    required: false
  },
  aLine1: {
    type: String,
    required: true
  },
  aLine2: {
    type: String,
    required: false
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
  }
},
{
  collection: 'users'
})

mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('User', UserSchema)