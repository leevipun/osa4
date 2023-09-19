const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken');
require('express-async-errors')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blogs = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes !== undefined ? body.likes : 0,
    user: user.id
  })
if (body.title !== undefined && body.author !== undefined) {
  const savedBlog = await blog.save()
  console.log(savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
  } else {
    response.sendStatus(400).send('Add Title and Url');
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blogId = request.params.id;
    const deletedBlog = await Blog.findByIdAndRemove(blogId);

    if (deletedBlog) {
      response.status(204).end(); // Return 204 No Content on successful deletion
    } else {
      response.status(404).end(); // Return 404 Not Found if blog was not found
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const blogId = request.params.id;
    const updatedBlogDocument = await Blog.findByIdAndUpdate(
      blogId,
      updatedBlog,
      { new: true }
    );

    if (updatedBlogDocument) {
      response.json(updatedBlogDocument);
    } else {
      response.status(404).end(); 
    }
  } catch (error) {
    next(error);
  }
});


module.exports = blogsRouter