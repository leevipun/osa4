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

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;
    
    if (!body.title || !body.author) {
      return response.status(400).json({ error: 'Title and author are required fields' });
    }
    
    const user = await User.findById(body.userId);
    const likes = body.likes !== undefined ? body.likes : 0;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: likes,
      user: user._id
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
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