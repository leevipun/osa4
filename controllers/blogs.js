const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  const likes = body.likes !== undefined ? body.likes : 0;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes
  })
if (body.title !== undefined && body.author !== undefined) {
  blog.save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
      
    })
    .catch(error => next(error))
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