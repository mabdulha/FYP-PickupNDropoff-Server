var express = require('express');
var router = express.Router();
let User = require('../models/users')
const bcrypt = require('bcrypt')

router.register = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  /**
   * Register a new user
   * Check if there is a user with the entered email already registered
   * Check if there is a user with the entered username already registered
   * If email and username already exist return an error message to user
   * Hash the password with bcrypt, so that anyone who has access to database cant see the password as a string
   */

  User.find({ email: req.body.email }).then(user => { 
    if (user.length >= 1) {
      return res.status(409).json({
        message: 'An account already exists with this email, Please try a different email'
      })
    }
    else {
      User.find({ username: req.body.username }).then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: 'An account already exists with this username, Please try a different username'
          })
        }
        else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              })
            }
            else {
              let user = new User({
                avatar: req.body.avatar,
                fname: req.body.fname,
                lname: req.body.lname,
                username: req.body.username,
                email: req.body.email,
                password: hash,
                phone: req.body.phone,
                address: req.body.address
              });
            
              user.save(function (err) {
                if(err) {
                  res.status(400).send({
                    message: 'User not registered',
                    errmsg: err
                  });
                }
                else {
                  res.json({
                    message: 'User registered successfully',
                    data: user
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

router.login = (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user.length < 1) {
       // Error 401: Unauthorised
       return res.status(401).send({
        message: 'Authentification failed, Please ensure the email and password are correct',
        errmsg: err
      })
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).send({
          message: 'Authentification failed, Please ensure the email and password are correct',
          errmsg: err
        })
      }
      if (result) {
        return res.status(200).send({
          message: 'Successfully Authenticated'
      })
      }
      res.status(401).send({
        message: 'Authentification failed, Please ensure the email and password are correct',
        errmsg: err
    })
    })
  })
}

module.exports = router;
