/* eslint-disable no-console */
let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

let mongodbUri = process.env.MONGO_URI

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.set('useFindAndModify', false)

let db = mongoose.connection

db.on('error', function (err) {
  console.log('Unable to Connect to [ ' + db.name + ' ]', err)
})

db.once('open', function () {
  console.log('Successfully Connected to [ ' + db.name + ' ]')
})

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pickup and Dropoff' })
})

module.exports = router
