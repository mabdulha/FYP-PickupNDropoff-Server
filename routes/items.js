let express = require('express')
let router = express.Router()
let Item = require('../models/items')
let User = require('../models/users')

router.findAll = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  Item.find({
    status: 'Available'
  } ,function (err, items) {
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

router.findItemByUser = (req, res) => {
  User.findById(req.params.id, function (err) {
    if (err) {
      res.status(404).send({
        message: 'User does not exist',
        errmsg: err
      })
    }
    else {
      Item.find({
        userID: req.params.userID
      }, function (err, items) {
        if (err) {
          res.status(404).send(err)
        }
        else if (items.length > 0) {
          res.send(items)
        }
        else {
          res.status(204).send({
            message: 'No items for the given user id'
          })
        }
      })
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
  item.pLine1 = req.body.pLine1
  item.pLine2 = req.body.pLine2
  item.pTown = req.body.pTown
  item.pCounty = req.body.pCounty
  item.pEircode = req.body.pEircode
  item.pGeometry.push({
    plat: req.body.plat,
    plng: req.body.plng
  })
  item.dLine1 = req.body.dLine1
  item.dLine2 = req.body.dLine2
  item.dTown = req.body.dTown
  item.dCounty = req.body.dCounty
  item.dEircode = req.body.dEircode,
  item.dGeometry.push({
    dlat: req.body.dlat,
    dlng: req.body.dlng
  })
  item.userID = req.body.userID
  item.buyerID = req.body.buyerID
  item.status = req.body.status
  item.datetime = req.body.datetime

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
      if (req.body.pLine1) {
        item.pLine1 = req.body.pLine1
      }
      if (req.body.pLine2) {
        item.pLine2 = req.body.pLine2
      }
      if (req.body.pTown) {
        item.pTown = req.body.pTown
      }
      if (req.body.pCounty) {
        item.pCounty = req.body.pCounty
      }
      if (req.body.pEircode) {
        item.pEircode = req.body.pEircode
      }
      if (req.body.plat) {
        item.plat = req.body.plat
      }
      if (req.body.plng) {
        item.plng = req.body.plng
      }
      if (req.body.dLine1) {
        item.dLine1 = req.body.dLine1
      }
      if (req.body.dLine2) {
        item.dLine2 = req.body.dLine2
      }
      if (req.body.dTown) {
        item.dTown = req.body.dTown
      }
      if (req.body.dCounty) {
        item.dCounty = req.body.dCounty
      }
      if (req.body.dEircode) {
        item.dEircode = req.body.dEircode
      }
      if (req.body.dlat) {
        item.dlat = req.body.dlat
      }
      if (req.body.dlng) {
        item.dlng = req.body.dlng
      }
      if (req.body.status) {
        item.status = req.body.status
      }
      if (req.body.datetime) {
        item.datetime = req.body.datetime
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

router.findItemForDelivery = (req, res) => {
  Item.find({
    status: 'To Deliver',
    dTown: { $in: req.params.town }
  }, (err, items) => {
    if (err) {
      res.status(404).send({
        errmsg: err
      })
    }
    else if (items.length > 0) {
      res.json(items)
    }
    else {
      res.send({
        message: 'No items have been found'
      })
    }
  })
}

module.exports = router
