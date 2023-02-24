const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testBlogs = require('../utils/blogs')


describe('when there is initially some notes saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = testBlogs.blogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blog-list has correct length', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })

  test('blogs are defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0]._id).toBeDefined()
  })
})

describe('Addition of a new blog', () => {

  test('succeeds with valid data', async () => {
    const newBlog = {
      "title": "kivaa",
      "author": "on",
      "url": "välillä",
      "likes": "231213"
    }
    await api
      .post('/api/blogs')
      .send(newBlog)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.author)
    expect(response.body).toHaveLength(7)
    expect(contents).toContain(
      'on'
    )
  })

  test('fails when likes is empty', async () => {
    const newBlog = {
      "title": "muu",
      "author": "maa",
      "url": "saa",
      "likes": ""
    }
    await api
      .post('/api/blogs')
      .send(newBlog)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.likes)
    expect(contents).toContain(
      0
    )
  })

  test('fails when author or url is empty', async () => {
    const newBlog = {
      "author": "puita",
      "likes": "3232"
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

  })
})

describe('Deletion a new blog', () => {
  test('succeeds', async () => {
    const response = await api.get('/api/blogs')
    await api
      .delete(`/api/blogs/${response.body[0]._id}`)
      .expect(200)
  })
  test('fails', async () => {
    await api
      .delete(`/api/blogs/${'123'}`)
      .expect(500)
  })
})

describe('Update of a sigle blog', () => {
  test('succeeds', async () => {
    const response = await api.get('/api/blogs')
    await api
      .put(`/api/blogs/${response.body[0]._id}`)
      .expect(200)

  })
  test('fails', async () => {
    await api
      .put(`/api/blogs/${1234}`)
      .expect(500)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
