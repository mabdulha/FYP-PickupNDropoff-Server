let express = require('express')
let router = express.Router()
let County = require('../models/counties')

router.findAllCounties = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  
  County.find(function (err, counties){
    if (err) {
      res.send(err)
    }
    else {
      res.send(JSON.stringify(counties, null, 5))
    }
  })
}

module.exports = router
