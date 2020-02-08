const chai = require('chai')
const expect = chai.expect
const request = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const User = require('../../../models/users')

const _ = require('lodash')