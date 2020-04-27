let express = require('express')
let router = express.Router()
let Delivery = require('../models/deliveries')

router.addDelivery = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  let delivery = new Delivery()
  delivery.title = req.body.title
  delivery.status = req.body.status
  delivery.size = req.body.size
  delivery.pLine1 = req.body.pLine1
  delivery.pLine2 = req.body.pLine2
  delivery.pTown = req.body.pTown
  delivery.pCounty = req.body.pCounty
  delivery.pEircode = req.body.pEircode
  delivery.dLine1 = req.body.dLine1
  delivery.dLine2 = req.body.dLine2
  delivery.dTown = req.body.dTown
  delivery.dCounty = req.body.dCounty 
  delivery.dEircode = req.body.dEircode,
  delivery.itemID = req.body.itemID
  delivery.buyerID = req.body.buyerID
  delivery.buyerName = req.body.buyerName
  delivery.buyerNumber = req.body.buyerNumber
  delivery.sellerID = req.body.sellerID
  delivery.sellerName = req.body.sellerName
  delivery.sellerNumber = req.body.sellerNumber
  delivery.driverID = req.body.driverID
  delivery.estCharge = req.body.estCharge
  delivery.pdatetime = req.body.pdatetime
  delivery.ddatetime = req.body.ddatetime

  delivery.save(function (err) {
    if (err) {
      res.status(404).send({
        message: 'Delivery not added',
        errmsg: err
      })
    }
    else {
      res.send({
        message: 'Delivery added to database',
        data: delivery
      })
    }
  })
}

router.updateDelivery = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  Delivery.findById(req.params.id, function (err, delivery) {
    if (err) {
      res.status(404).send({
        message: 'Cannot find delivery assosiated with that id',
        errmsg: err
      })
    }
    else {
      if(req.body.title) {
        delivery.title = req.body.title
      }
      if (req.body.status) {
        delivery.status = req.body.status
      }
      if (req.body.size) {
        delivery.size = req.body.size
      }
      if (req.body.pLine1) {
        delivery.pLine1 = req.body.pLine1
      }
      if (req.body.pLine2) {
        delivery.pLine2 = req.body.pLine2
      }
      if (req.body.pTown) {
        delivery.pTown = req.body.pTown
      }
      if (req.body.pCounty) {
        delivery.pCounty = req.body.pCounty
      }
      if (req.body.pEircode) {
        delivery.pEircode = req.body.pEircode
      }
      if (req.body.dLine1) {
        delivery.dLine1 = req.body.dLine1
      }
      if (req.body.dLine2) {
        delivery.dLine2 = req.body.dLine2
      }
      if (req.body.dTown) {
        delivery.dTown = req.body.dTown
      }
      if (req.body.dCounty) {
        delivery.dCounty = req.body.dCounty
      }
      if (req.body.dEircode) {
        delivery.dEircode = req.body.dEircode
      }
      if (req.body.buyerID) {
        delivery.buyerID = req.body.buyerID
      }
      if (req.body.buyerName) {
        delivery.buyerName = req.body.buyerName
      }
      if (req.body.buyerNumber) {
        delivery.buyerNumber = req.body.buyerNumber
      }
      if (req.body.sellerID) {
        delivery.sellerID = req.body.sellerID
      }
      if (req.body.sellerName) {
        delivery.sellerName = req.body.sellerName
      }
      if (req.body.sellerNumber) {
        delivery.sellerNumber = req.body.sellerNumber
      }
      if (req.body.driverID) {
        delivery.driverID = req.body.driverID
      }
      if (req.body.estCharge) {
        delivery.estCharge = req.body.estCharge
      }
      if (req.body.pdatetime) {
        delivery.pdatetime = req.body.pdatetime
      }
      if (req.body.ddatetime) {
        delivery.ddatetime = req.body.ddatetime
      }

      delivery.save(function (err) {
        if (err) {
          res.status(406).send({
            message: 'Delivery not updated',
            errmsg: err
          })
        }
        else {
          res.status(200).send({
            message: 'Delivery updated successfully',
            data: delivery
          })
        }
      })
    }
  })
}

router.findItemForDelivery = (req, res) => {

  let cleanTown = req.params.town.replace('%20', ' ')
  let townArray = cleanTown.split(',')
  Delivery.find({
    status: 'Available for Delivery',
    dTown: { $in: townArray },
    pTown: { $in: townArray },
  }, (err, deliveries) => {
    if (err) {
      res.status(404).send({
        errmsg: err
      })
    }
    else {
      res.json(deliveries)
    }
  })
}

module.exports = router
