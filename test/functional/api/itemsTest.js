/* eslint-disable no-console */
const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Item = require('../../../models/items')
const _ = require('lodash')

let server


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
})