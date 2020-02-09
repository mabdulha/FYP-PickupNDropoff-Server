/* eslint-disable no-console */
const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const User = require('../../../models/users')

let server


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

  beforeEach(async () => {
    try {
      await User.deleteMany({user})
      await User.insertMany({
        fname: 'Mozeeb',
        lname: 'Abdulha',
        username: 'moz',
        email: 'ma@gmail.com',
        password: 'secret123',
        phone: '0897456321',
        address: 'Kilkenny'
      })
      await User.insertMany({
        fname: 'Jack',
        lname: 'Dolan',
        username: 'jcd',
        email: 'jd@gmail.com',
        password: 'helloworld',
        phone: '0836598741',
        address: 'Tramore'
      })
      const user = await User.findOne({lastname: 'Abdulha'})
    } catch (error) {
      console.log(error)
    }
  })

  describe('POST /users/', () => {
    it('should register user to the database', () => {
      const user = {
        fname: 'Kamil',
        lname: 'Bigos',
        username: 'Genarcik',
        email: 'kb@gmail.com',
        password: 'secret',
        phone: '0894536791',
        address: 'New Ross',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/avatars%2Fdefault-profile.png?alt=media&token=c0d9df92-b5f6-4526-bfc2-2a27d91519e0'
      }
      return request(server)
        .post('/api/users/register')
        .send(user)
        .expect(200)
        .then(res => {
          expect(res.body.message).equal('User registered successfully')
        })
    })
  })
})