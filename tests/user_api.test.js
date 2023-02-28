const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')


describe('creation of a new user', () => {

  beforeAll(async () => {
    await User.deleteMany({})
    const firstUser = {
      "username": "mies",
      "name": "mies",
      "password": "1234"
    }
    await api
      .post('/api/users')
      .send(firstUser)
  })

  test('succeeds with valid credentials', async () => {
    const newUser = {
      "username": "jennifer",
      "name": "jennifer",
      "password": "1234"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
  })

  test('fails with invalid credentials', async () => {
    const newUser = {
      "username": "je",
      "name": "jennifer1234",
      "password": "1234"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})