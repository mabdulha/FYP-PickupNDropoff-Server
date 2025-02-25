/* eslint-disable no-console */
const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Item = require('../../../models/items')
const _ = require('lodash')

let server, validID

describe('Itemss',  () => {
  before(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      server = require('../../../bin/www')
    } catch (error) {
      console.log(error)
    }
  })

  before(async () => {
    try {
      await Item.deleteMany({item})
      await Item.insertMany({
        title: 'Used Wardrobe',
        description: 'New like condition',
        category: 'Furniture',
        price: 25.00,
        size: 'Medium',
        pLine1: '5 High Street',
        pLine2: 'Glenvale',
        pTown: 'Ballyragget',
        pCounty: 'Kilkenny',
        pEircode: 'R95Y6T5',
        status: 'Available'
      })
      await Item.insertMany({
        title: 'Audi A4',
        description: '5 door, No scratches',
        category: 'Vehicle',
        price: 100.00,
        size: 'Large',
        pLine1: '5 Green Lane',
        pLine2: 'Johnswell Road',
        pTown: 'Kilkenny City',
        pCounty: 'Kilkenny',
        pEircode: 'R95Y6T5',
        status: 'To Deliver'
      })
      const item = await Item.findOne({category: 'Furniture'})
      validID = item._id
    } catch (error) {
      console.log(error)
    }
  })

  describe('GET /api/items/findall', () => {
    it('should get all the available items from the database', done => {
      request(server)
        .get('/api/items/findall')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          try {
            expect(res.body).to.be.a('array')
            expect(res.body.length).to.equal(1)
            let result = _.map(res.body, item => {
              return {
                title: item.title,
                category: item.category
              }
            })
            expect(result).to.deep.include({
              title: 'Used Wardrobe',
              category: 'Furniture'
            })
            done()
          }
          catch(err) {
            done(err)
          }
        })
    })
  })

  describe('POST /api/item/add', () => {
    it('should add a new item to the database', () => {
      const item = {
        title: 'Something',
        description: 'Test',
        category: 'Test Category',
        price: 10.00,
        size: 'Medium',
        pLine1: '5 Green Lane',
        pLine2: 'Johnswell Road',
        pTown: 'Kilkenny City',
        pCounty: 'Kilkenny',
        pEircode: 'R95Y6T5',
        status: 'Available'
      }
      return request(server)
        .post('/api/item/add')
        .send(item)
        .expect(200)
        .then(res => {
          expect(res.body.message).equal('Item added to database')
          validID = res.body.data._id
        })
    })
    after(() => {
      return request(server)
        .get(`/api/item/${validID}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.have.property('title', 'Something')
          expect(res.body).to.have.property('category', 'Test Category')
        })
    })
  })

  describe('GET /api/item/:id', () => {
    describe('when the id is valid', () => {
      it('should return the item matching the id', done => {
        console.log('get items id ' + validID)
        request(server)
          .get(`/api/item/${validID}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('title', 'Something')
            expect(res.body).to.have.property('category', 'Test Category')
            done(err)
          })
      })
    })
    describe('when the id is invalid', () => {
      it('should return the item not found message', done => {
        request(server)
          .get('/api/item/123')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(res.body.message).include('Item not found')
            done(err)
          })
      })
    })
  })

  describe('PUT /api/item/update/:id', () =>  {
    describe('when the id is valid', () => {
      it('should update the item and return a message', () => {
        const updateItem = {
          title: 'New Updated Item',
          price: 50.00
        }
        return request(server)
          .put(`/api/item/update/${validID}`)
          .send(updateItem)
          .expect(200)
          .then(res => {
            expect(res.body).to.include({
              message: 'Item updated successfully'
            })
            expect(res.body.data).to.include({
              title: 'New Updated Item',
              price: 50.00
            })
          })
      })
      after(() => {
        return request(server)
          .get(`/api/item/${validID}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.include({
              title: 'New Updated Item',
              price: 50.00
            })
          })
      })
    })
  })

  describe('PUT /api/item/incrementview/:id', () => {
    describe('when the id is valid', () => {
      it('should increment the view on the item and return a message to the user', () => {
        console.log('put views id ' + validID)
        return request(server)
          .put(`/api/item/incrementview/${validID}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.include({
              message: 'View incremented successfully'
            })
            expect(res.body.data).to.have.property('views', 1)
          })
      })
      after(() => {
        console.log('put views id ' + validID)
        return request(server)
          .get(`/api/item/${validID}`)
          .set('Application', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property('views', 1)
          })
      })
    })
    describe('when the id is invalid', () => {
      it('should return a 404 as id is not valid', () => {
        return request(server)
          .put('/api/item/incrementview/123')
          .expect(404)
          .then(res => {
            expect(res.body).to.include({
              message: 'Cannot find Item associated with that id'
            })
          })
      })
    })
  })

  describe('DELETE /api/item/delete/:id', () => {
    describe('when the id is valid', () => {
      it('should delete the item and return a message', () => {
        return request(server)
          .delete(`/api/item/delete/${validID}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.include({
              message: 'Item successfully deleted'
            })
          })
      })
    })
    describe('when the id is invalid', () => {
      it('should return a message to the user when the item cannot be found by the id', () => {
        request(server)
          .delete('/api/item/delete/123')
          .expect(404)
          .then(res => {
            expect(res.body).to.include({
              message: 'Item not deleted'
            })
          })
      })
    })
  })
})