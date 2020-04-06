let express = require('express')
let router = express.Router()
let Town = require('../models/towns')
let Fuse = require('fuse.js')

router.findAllCounties = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  
  Town.find(function (err, counties){
    if (err) {
      res.send(err)
    }
    else {
      res.send(JSON.stringify(counties, null, 5))
    }
  }).select('county')
}

router.findTown = (req, res) => {

  Town.find(function (err, counties) {
    if (err) {
      res.send(err)
    }
    else {
      let options = {
        keys: ['county'],
        threshold: 0.0
      }

      let fuse = new Fuse(counties, options)
      let county = req.body.county
      let towns = fuse.search(county)
    
      if (towns.length === 0) {
        res.json({
          message: 'No Query'
        })
      }
      else {
        res.json(towns)
      }
    }
  })
}

router.findTowns = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  Town.find({
    'county': req.params.county
  }, function (err, towns) {
    if (err) {
      res.status(404).send({
        message: 'No Towns Found',
        errmsg: err
      })
    }
    else if (towns.length === 0) {
      res.status(204).send({
        message: 'Cannot find any towns'
      })
    }
    else {
      res.send(JSON.stringify(towns, null, 5))
    }
  })
}

module.exports = router