const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const testBlogs = require('../utils/blogs')


describe('when there is initially some notes saved', () => {

  beforeAll(async () => {
    await Blog.deleteMany({})
    const user = await User.find()
    const blogObjects = testBlogs.blogs
      .map(blog => new Blog(blog))
    blogObjects.map(blog => blog.user = user[0])
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    user[0].blogs = blogObjects
    user[0].save()

  })

  test('blog-list has correct length', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })

  test('blogs are defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('Addition of a new blog', () => {

  let user = null

  const existingUser = {
    "username": "jennifer",
    "name": "jennifer1234",
    "password": "1234"
  }

  let newBlog = null

  let login = ''

  test('succeeds with valid data', async () => {
    login = await api
      .post('/api/login')
      .send(existingUser)

    user = await User.find()

    newBlog = {
      "title": "kivaa",
      "author": "on",
      "url": "välillä",
      "likes": "231213",
      "user": user[0].id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${login._body.token}`)
      .send(newBlog)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.author)
    expect(response.body).toHaveLength(7)
    expect(contents).toContain(
      'on'
    )
  })

  test('fails without a proper token', async () => {
    login = await api
      .post('/api/login')
      .send(existingUser)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

  })


  test('returns 0 likes when likes is empty', async () => {
    const user = await User.find()
    const newBlog = {
      "title": "muu",
      "author": "maa",
      "url": "saa",
      "likes": "",
      "user": user[0].id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${login._body.token}`)
      .send(newBlog)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.likes)
    expect(contents).toContain(
      0
    )
  })

  test('fails when author or url is empty', async () => {
    const user = await User.find()
    const newBlog = {
      "author": "puita",
      "likes": "3232",
      "user": user[0].id
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login._body.token}`)
      .expect(400)

  })
})

let userOneBlogs = null
let userTwoBlogs = null
let login = null
let user = null

describe('Deletion of a new blog', () => {

  test('succeeds with a valid id', async () => {
    user = await User.find()

    let existingUser = {
      "username": user[0].username,
      "name": user[0].name,
      "password": "1234"
    }

    login = await api
      .post('/api/login')
      .send(existingUser)

    userOneBlogs = await Blog.find( { user: user[0].id } )
    userTwoBlogs = await Blog.find( { user: user[1].id } )

    await api
      .delete(`/api/blogs/${userOneBlogs[0].id}`)
      .set('Authorization', `Bearer ${login._body.token}`)
      .expect(200)
  })

  test('fails with an invalid id', async () => {

    await api
      .delete(`/api/blogs/${userTwoBlogs[0].id}`)
      .set('Authorization', `Bearer ${login._body.token}`)
      .expect(400)
  })
})

describe('Update of a single blog', () => {

  test('succeeds with a valid id', async () => {
    userOneBlogs[1].likes = 444444

   

    await api
      .put(`/api/blogs/${userOneBlogs[1].id}`)
      .set('Authorization', `Bearer ${login._body.token}`)
      .send(userOneBlogs[1])
      .expect(200)

  })
  test('fails with a invalid id', async () => {
    const testObject = { 'id': '42134213' }
    await api
      .put(`/api/blogs/`)
      .send(testObject)
      .expect(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
