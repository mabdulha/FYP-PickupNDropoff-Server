const chai = require('chai')
const server = require('../../../bin/www')
const expect = chai.expect
const request = require('supertest')

describe('Userss',  () => {
  describe('POST /users/', () => {
    it('should register user to the database', () => {
      const user = {
        fname: 'Mozeeb',
        lname: 'Abdulha',
        username: 'mabdulha',
        email: 'mozeebabdulha@gmail.com',
        password: 'secret',
        phone: '0894536791',
        address: 'Kilkenny',
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