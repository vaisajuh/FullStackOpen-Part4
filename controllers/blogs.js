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

  const decodedToken = request.user
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  blog.user = user.id
  
  if (blog.likes === null) {
    blog.likes = 0
  }
  if ((blog.title === '') || (blog.url === '')) {
    return response.status(400).end()
  }
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const requestedBlog = await Blog.findById(request.params.id)
  
  console.log(request)
    
  const result = await Blog.deleteOne( { _id: request.params.id } )
  response.status(200).json(result)
})

blogsRouter.put('/:id', async (request, response) => {

  console.log(request)

  /*
  const requestedBlog = await Blog.findById(request.params.id)

  if (decodedToken.id !== requestedBlog.user.toString()) {
    console.log(decodedToken.id)
    console.log(requestedBlog.user.toString())
    return response.status(400).end()
  }
  */
  
  const result = await Blog.findOneAndUpdate({ _id:request.body.id }, { $set: { likes:request.body.likes } }, { runValidators: true })
  console.log(result)
  return response.status(200).json(result)
})

module.exports = blogsRouter
