/* eslint-disable no-console */
const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Driver = require('../../../models/drivers')

let server, validID

describe('Driverss',  () => {
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
      await Driver.deleteMany({driver})
      await Driver.insertMany({
        fname: 'Wil',
        lname: 'Smith',
        email: 'wills@gmail.com',
        password: '$2b$10$EKazfbgretghvqDqbQcNheWo2fPlYSEbkpTvRXu4tkJiwXeSmIdSS',
        phone: '0897456321',
        license: 'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/licenses%2F1586969786332-sample3-license.jpg?alt=media&token=1ba2b9d5-61c5-4828-8a7b-b4a53076ca29',
        size: 'Car',
        aLine1: '5 High Street',
        aLine2: 'Glenvale',
        aTown: 'Ballyragget',
        aCounty: 'Kilkenny',
        aEircode: 'R95Y6T5',
        preferredTowns: 'Kilkenny City,Ballyragget'
      })
      await Driver.insertMany({
        fname: 'Ice',
        lname: 'Cube',
        email: 'icec@gmail.com',
        password: '$2b$10$EKazfbgretghvqDqbQcNheWo2fPlYSEbkpTvRXu4tkJiwXeSmIdSS',
        phone: '0871234569',
        license: 'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/licenses%2F1586969786332-sample3-license.jpg?alt=media&token=1ba2b9d5-61c5-4828-8a7b-b4a53076ca29',
        size: 'Van',
        aLine1: '5 Green Lane',
        aLine2: 'Johnswell Road',
        aTown: 'Kilkenny City',
        aCounty: 'Kilkenny',
        aEircode: 'R95Y644',
        preferredTowns: 'Danesfort'
      })
      const driver = await Driver.findOne({lname: 'Cube'})
      validID = driver._id
    } catch (error) {
      console.log(error)
    }
  })

  describe('POST /api/drivers/register', () => {
    it('should register user to the database', () => {
      const user = {
        fname: 'Kamil',
        lname: 'Bigos',
        email: 'kamilb@gmail.com',
        password: 'secret',
        phone: '0894536791',
        size: 'Pickup',
        aLine1: '5 Beach View',
        aLine2: '',
        aTown: 'New Ross',
        aCounty: 'Wexford',
        aEircode: 'R95Y8W5',
        preferredTowns: 'Johnswell,Thomastown',
        license: 'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/licenses%2F1586969786332-sample3-license.jpg?alt=media&token=1ba2b9d5-61c5-4828-8a7b-b4a53076ca29'
      }
      return request(server)
        .post('/api/drivers/register')
        .send(user)
        .expect(200)
        .then(res => {
          expect(res.body.message).equal('Driver registered successfully')
          validID = res.body.data._id
        })
    })
  })

  describe('POST /api/drivers/login', () => {
    it('should login a driver when the credentials are correct', () => {
      const credentials = {
        email: 'kamilb@gmail.com',
        password: 'secret'
      }
      return request(server)
        .post('/api/drivers/login')
        .send(credentials)
        .expect(200)
        .then(res => {
          expect(res.body.message).equal('Successfully Authenticated')
        })
    })
  })

  describe('GET /api/driver/:id', () => {
    describe('when the id is valid', () => {
      it('should return the driver matching the id', done => {
        console.log('Get drivers id' + validID)
        request(server)
          .get(`/api/driver/${validID}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.property('fname', 'Kamil')
            expect(res.body).to.have.property('lname', 'Bigos')
            done(err)
          })
      })
    })
    describe('when the id is invalid', () => {
      it('should return the driver not found message', done => {
        request(server)
          .get('/api/driver/123')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(res.body.message).include('Driver not found')
            done(err)
          })
      })
    })
  })

})