const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name:1, id: 1 } )
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const decodedToken = request.query

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  blog.user = user.id

  if (blog.likes === null) {
    blog.likes = 0
  }
  if ((blog.title === undefined) || (blog.url === undefined)) {
    return response.status(400).end()
  }
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

  const requestedBlog = await Blog.findById(request.params.id)
  const decodedToken = request.query

  if (decodedToken.id !== requestedBlog.user.toString()) {
    return response.status(400).end()
  }
  const result = await Blog.deleteOne( { _id: request.params.id } )
  response.status(200).json(result)
})

blogsRouter.put('/:id', async (request, response) => {

  const requestedBlog = await Blog.findById(request.params.id)
  const decodedToken = request.query

  if (decodedToken.id !== requestedBlog.user.toString()) {
    return response.status(400).end()
  }

  const result = await Blog.findOneAndUpdate({ _id:request.body._doc._id }, { $set: { likes:request.body._doc.likes } }, { runValidators: true })
  return response.status(200).json(result)
})

module.exports = blogsRouter
