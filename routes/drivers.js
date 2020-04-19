let express = require('express')
let router = express.Router()
let Driver = require('../models/drivers')
let Item = require('../models/items')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let dotenv = require('dotenv')
dotenv.config()

router.findOne = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  Driver.findOne({
    '_id': req.params.id
  }, function (err, driver) {
    if (err) {
      res.status(404).send({
        message: 'Driver not found',
        errmsg: err
      })
    } else if (driver.length === 0) {
      res.status(204).send({
        message: 'Item doesnt exist'
      })
    } 
    else {
      res.send(JSON.stringify(driver, null, 5))
    }
  })
}

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
          let driver = new Driver()
          driver.fname = req.body.fname,
          driver.lname = req.body.lname,
          driver.email = req.body.email,
          driver.password = hash,
          driver.phone = req.body.phone,
          driver.license = req.body.license,
          driver.size = req.body.size,
          driver.aLine1 = req.body.aLine1,
          driver.aLine2 = req.body.aLine2,
          driver.aTown = req.body.aTown,
          driver.aCounty = req.body.aCounty,
          driver.aEircode = req.body.aEircode,
          driver.aGeometry.push({
            alat: req.body.alat,
            alng: req.body.alng
          })
          driver.preferredTowns = req.body.preferredTowns
            
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
          size: driver.size,
          aLine1: driver.aLine1,
          aLine2: driver.aLine2,
          aTown: driver.aTown,
          aCounty: driver.aCounty,
          aEircode: driver.aEircode,
          aGeometry: driver.aGeometry,
          alat: driver.alat,
          alng: driver.alng,
          preferredTowns: driver.preferredTowns
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

router.findDeliveriesByDriver = (req, res) => {
  Driver.findById(req.params.id, function (err, driver) {
    if (err) {
      res.status(404).json({
        message: 'Driver not found by id',
        errmsg: err
      })
    } else {
      Item.find({
        driverID: driver._id
      }, function (err, items) {
        if (err) {
          res.json(err)
        }
        else {
          res.json(items)
        }
      })
    } 
  })
}

module.exports = router
