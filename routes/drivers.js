let express = require('express')
let router = express.Router()
let Driver = require('../models/drivers')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let dotenv = require('dotenv')
dotenv.config()

router.register = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  /**
   * Register a new driver
   * Check if there is a driver with the entered email already registered
   * Check if there is a driver with the entered email already registered
   * If email and email already exist return an error message to driver
   * Hash the password with bcrypt, so that anyone who has access to database cant see the password as a string
   */

  Driver.find({ email: req.body.email }).then(driver => { 
    if (driver.length >= 1) {
      return res.status(409).json({
        message: 'An account already exists with this email, Please try a different email'
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
          let driver = new Driver({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: hash,
            phone: req.body.phone,
            license: req.body.license,
            size: req.body.size
          })
            
          driver.save(function (err) {
            if(err) {
              res.status(400).send({
                message: 'Driver not registered, Please upload Driver License',
                errmsg: err
              })
            } 
            else {
              res.json({
                message: 'Driver registered successfully',
                data: driver
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
   * Login a driver
   * find the driver by email
   */

  Driver.findOne({ email: req.body.email }).then(driver => {
    if (driver.length < 1) {
      // Error 401: Unauthorised
      return res.status(401).send({
        message: 'Authentification failed, Please ensure the email and password are correct',
      })
    }
    bcrypt.compare(req.body.password, driver.password, (err, result) => {
      if (err) {
        return res.status(401).send({
          message: 'Authentification failed, Please ensure the email and password are correct',
          errmsg: err
        })
      }
      if (result) {
        const payload = {
          _id: driver._id,
          fname: driver.fname,
          lname: driver.lname,
          email: driver.email,
          phone: driver.phone,
          license: driver.license,
          size: driver.size
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '1d'
        })

        return res.status(200).send({
          message: 'Successfully Authenticated',
          token: token,
          driver: payload
        })
      }
      res.status(401).send({
        message: 'Authentification failed, Please ensure the email and password are correct',
        errmsg: err
      })
    })
  }).catch(err => {
    res.status(500).send({
      message: 'Authentification failed, Please ensure the email and password are correct',
      error: err
    })
  })
}

module.exports = router
