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

  beforeEach(async () => {
    try {
      await Item.deleteMany({item})
      await Item.insertMany({
        title: 'Used Wardrobe',
        description: 'New like condition',
        category: 'Wooden',
        price: 25.00,
        size: 'Medium'
      })
      await Item.insertMany({
        title: 'Audi A4',
        description: '5 door, No scratches',
        category: 'Vehicle',
        price: 100.00,
        size: 'Large'
      })
      const item = await Item.findOne({category: 'Wooden'})
      validID = item._id
    } catch (error) {
      console.log(error)
    }
  })

  describe('GET /api/items/findall', () => {
    it('should get all the items from the database', done => {
      request(server)
        .get('/api/items/findall')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          try {
            expect(res.body).to.be.a('array')
            expect(res.body.length).to.equal(2)
            let result = _.map(res.body, item => {
              return {
                title: item.title,
                category: item.category
              }
            })
            expect(result).to.deep.include({
              title: 'Used Wardrobe',
              category: 'Wooden'
            })
            expect(result).to.deep.include({
              title: 'Audi A4',
              category: 'Vehicle'
            })
            done()
          }
          catch(err) {
            done(err)
          }
        })
    })
  })

  describe('GET /api/item/:id', () => {
    describe('when the id is valid', () => {
      it('should return the item matching the id', done => {
        request(server)
          .get(`/api/item/${validID}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body[0]).to.have.property('title', 'Used Wardrobe')
            expect(res.body[0]).to.have.property('category', 'Wooden')
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

  describe('POST /api/item/add', () => {
    it('should add a new item to the database', () => {
      const item = {
        title: 'Something',
        description: 'Test',
        category: 'Test Category',
        price: 10.00,
        size: 'Medium'
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
          expect(res.body[0]).to.have.property('title', 'Something')
          expect(res.body[0]).to.have.property('category', 'Test Category')
        })
    })
  })
})