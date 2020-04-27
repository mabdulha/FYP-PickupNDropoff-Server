let express = require('express')
let router = express.Router()
let User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let dotenv = require('dotenv')
dotenv.config()

router.findOne = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  User.findOne({
    '_id': req.params.id
  }, function (err, user) {
    if (err) {
      res.status(404).send({
        message: 'User not found',
        errmsg: err
      })
    } else {
      res.send(JSON.stringify(user, null, 5))
    }
  })
}

router.register = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

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
              let user = new User()
              user.fname = req.body.fname,
              user.lname = req.body.lname,
              user.username = req.body.username,
              user.email = req.body.email,
              user.password = hash,
              user.phone = req.body.phone,
              user.aLine1 = req.body.aLine1,
              user.aLine2 = req.body.aLine2,
              user.aTown = req.body.aTown,
              user.aCounty = req.body.aCounty,
              user.aEircode = req.body.aEircode
              user.aGeometry.push({
                alat: req.body.alat,
                alng: req.body.alng
              })
              user.avatar = req.body.avatar,
            
              user.save(function (err) {
                if(err) {
                  res.status(400).send({
                    message: 'User not registered',
                    errmsg: err
                  })
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
  /**
   * Login a user
   * find the user by username
   */

  User.findOne({ username: req.body.username }).then(user => {
    if (user.length < 1) {
      // Error 401: Unauthorised
      return res.status(401).send({
        message: 'Authentification failed, Please ensure the username and password are correct',
      })
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).send({
          message: 'Authentification failed, Please ensure the username and password are correct',
          errmsg: err
        })
      }
      if (result) {
        const payload = {
          _id: user._id,
          avatar: user.avatar,
          fname: user.fname,
          lname: user.lname,
          username: user.username,
          email: user.email,
          phone: user.phone,
          aLine1: user.aLine1,
          aLine2: user.aLine2,
          aTown: user.aTown,
          aCounty: user.aCounty,
          aEircode: user.aEircode,
          aGeometry: user.aGeometry,
          alat: user.alat,
          alng: user.alng
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '7d'
        })

        return res.status(200).send({
          message: 'Successfully Authenticated',
          token: token,
          user: payload
        })
      }
      res.status(401).send({
        message: 'Authentification failed, Please ensure the username and password are correct',
        errmsg: err
      })
    })
  }).catch(err => {
    res.status(500).send({
      message: 'Authentification failed, Please ensure the username and password are correct',
      error: err
    })
  })
}

module.exports = router
