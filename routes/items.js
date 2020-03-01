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

  Item.findOne({
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

router.updateItem = (req, res) => {
  Item.findById(req.params.id, function (err, item) {
    if (err) {
      res.status(404).send({
        message: 'Cannot find item assosiated with that id',
        errmsg: err
      })
    }
    else {
      if (req.body.title) {
        item.title = req.body.title
      }
      if (req.body.description) {
        item.description = req.body.description
      }
      if (req.body.imageurl) {
        item.imageurl = req.body.imageurl
      }
      if (req.body.category) {
        item.category = req.body.category
      }
      if (req.body.price) {
        item.price = req.body.price
      }
      if (req.body.size) {
        item.size = req.body.size
      }

      item.save(function (err) {
        if (err) {
          res.status(406).send({
            message: 'Item not updated',
            errmsg: err
          })
        }
        else {
          res.status(200).send({
            message: 'Item updated successfully',
            data: item
          })
        }
      })
    }
  })
}

router.deleteItem = (req, res) => {
  Item.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.status(404).send({
        message: 'Item not deleted',
        errmsg: err
      })
    }
    else {
      res.status(200).send({
        message: 'Item successfully deleted'
      })
    }
  })
}

router.incrementViews = (req, res) => {
  Item.findById(req.params.id, function (err, item) {
    if (err) {
      res.status(404).send({
        message: 'Cannot find Item associated with that id',
        errmsg: err
      })
    }
    else {
      item.views += 1
      item.save(function (err) {
        if (err) {
          res.json({
            message: 'View could not be incremented',
            errmsg: err
          })
        }
        else {
          res.json({
            message: 'View incremented successfully',
            data: item
          })
        }
      })
    }
  })
}

module.exports = router