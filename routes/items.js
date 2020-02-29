let express = require('express')
let router = express.Router()
let Item = require('../models/items')

router.findAll = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  Item.find(function (err, items) {
    if (err) {
      res.status(404).send(err)
    } 
    else if (items.length === 0) {
      res.status(204).send({
        message: 'No items in the database'
      })
    } 
    else {
      res.send(JSON.stringify(items, null, 5))
    }
  })
}

router.findOne = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  Item.find({
    '_id': req.params.id
  }, function (err, items) {
    if (err) {
      res.status(404).send({
        message: 'Item not found',
        errmsg: err
      })
    } 
    else if (items.length === 0) {
      res.status(204).send({
        message: 'Item doesnt exist'
      })
    } 
    else {
      res.send(JSON.stringify(items, null, 5))
    }
  })
}

router.addItem = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  let item = new Item()
  item.title = req.body.title
  item.description = req.body.description
  item.imageurl = req.body.imageurl
  item.category = req.body.category
  item.price = req.body.price
  item.size = req.body.size
  item.userID = req.body.userID

  item.save(function (err) {
    if (err) {
      res.status(404).send({
        message: 'Item not added',
        errmsg: err
      })
    }
    else {
      res.send({
        message: 'Item added to database',
        data: item
      })
    }
  })
}

module.exports = router