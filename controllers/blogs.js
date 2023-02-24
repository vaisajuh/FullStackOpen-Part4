const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (blog.likes === null) {
    blog.likes = 0
  }
  if ((blog.title === undefined) || (blog.url === undefined)) {
    response.status(400).end()
  }
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.deleteOne( { _id:request.params.id } )
  response.status(200).json(result)
})

blogsRouter.put('/:id', async (request, response) => {
  const result = await Blog.findOneAndUpdate({ _id:request.params.id }, { $set: { likes:12345 } }, { runValidators: true })
  response.status(200).json(result)
})

module.exports = blogsRouter
