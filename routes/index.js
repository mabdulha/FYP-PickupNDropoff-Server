var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

let mongodbUri = process.env.MONGO_URI

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.set("useFindAndModify", false)

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pickup and Dropoff' });
});

module.exports = router;
