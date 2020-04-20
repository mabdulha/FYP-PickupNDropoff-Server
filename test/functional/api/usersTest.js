/* eslint-disable no-console */
const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const User = require('../../../models/users')
let server
let validID

describe('Userss',  () => {
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
      await User.deleteMany({})
      await User.insertMany({
        fname: 'Mozeeb',
        lname: 'Abdulha',
        username: 'moz',
        email: 'ma@gmail.com',
        password: '$2b$10$EKazfbgretghvqDqbQcNheWo2fPlYSEbkpTvRXu4tkJiwXeSmIdSS',
        phone: '0897456321',
        aLine1: '10 High Street',
        aLine2: '',
        aTown: 'Kilkenny',
        aCounty: 'Kilkenny',
        aEircode: 'R95Y5W8',
      })
      await User.insertMany({
        fname: 'Jack',
        lname: 'Dolan',
        username: 'jcd',
        email: 'jd@gmail.com',
        password: '$2b$10$EKazfbgretghvqDqbQcNheWo2fPlYSEbkpTvRXu4tkJiwXeSmIdSS',
        phone: '0836598741',
        aLine1: '5 Green Street',
        aLine2: 'Glenvale',
        aTown: 'Ballyragget',
        aCounty: 'Kilkenny',
        aEircode: 'R95A8XO',
      })
      const user = await User.findOne({lname: 'Abdulha'})
      validID = await user._id
    } catch (error) {
      console.log(error)
    }
  })

  describe('POST /api/users/register', () => {
    it('should register user to the database', () => {
      const user = {
        fname: 'Kamil',
        lname: 'Bigos',
        username: 'Genarcik',
        email: 'kb@gmail.com',
        password: 'secret',
        phone: '0894536791',
        aLine1: '5 Beach View',
        aLine2: '',
        aTown: 'New Ross',
        aCounty: 'Wexford',
        aEircode: 'R95Y8W5',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/avatars%2F1586301965897-unavailable-image.jpg?alt=media&token=8138f6b7-ec1b-4f79-89b7-eae98f1fb20a'
      }
      return request(server)
        .post('/api/users/register')
        .send(user)
        .expect(200)
        .then(res => {
          expect(res.body.message).equal('User registered successfully')
          validID = res.body.data._id
        })
    })
  })

  describe('POST /api/users/login', () => {
    it('should login a user when the credentials are correct', () => {
      const credentials = {
        username: 'moz',
        password: 'secret'
      }
      return request(server)
        .post('/api/users/login')
        .send(credentials)
        .expect(200)
        .then(res => {
          expect(res.body.message).equal('Successfully Authenticated')
        })
    })
  })

  describe('GET /api/user/:id', () => {
    describe('when the id is valid', () => {
      it('should return the user matching the id', done => {
        console.log('Get users id' + validID)
        request(server)
          .get(`/api/user/${validID}`)
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
      it('should return the user not found message', done => {
        request(server)
          .get('/api/user/123')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            expect(res.body.message).include('User not found')
            done(err)
          })
      })
    })
  })
})