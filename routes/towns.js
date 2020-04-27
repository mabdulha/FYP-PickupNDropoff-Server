let express = require('express')
let router = express.Router()
let Town = require('../models/towns')

router.findTowns = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  let mysort = { town: 1 }
  Town.find({
    'county': req.params.county
  }, function (err, towns) {
    if (err) {
      res.status(404).send({
        message: 'No Towns Found',
        errmsg: err
      })
    } else {
      res.send(JSON.stringify(towns, null, 5))
    }
  }).sort(mysort)
}

router.findAllTowns = (req, res) => {

  let sortTowns = { town: 1 }
  Town.find(function (err, towns) {
    if (err) {
      res.status(404).send({
        errmsg: err
      })
    }
    else {
      res.send(JSON.stringify(towns, null, 5))
    }
  }).sort(sortTowns)
}

module.exports = router