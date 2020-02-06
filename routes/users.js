var express = require('express');
var router = express.Router();
let User = require('../models/users')

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.register = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let user = new User({
    avatar: req.body.avatar,
    fname: req.body.fname,
    lname: req.body.lname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address
  });

  user.save(function (err) {
    if(err) {
      res.status(400).send({
        message: 'user not registered',
        errmsg: err
      });
    }
    else {
      res.json({
        message: 'User registered successfully'
      })
    }
  });
}

module.exports = router;
