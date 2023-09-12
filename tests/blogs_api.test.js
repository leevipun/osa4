const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt')
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user')
const { initialBlogs } = require('./test_helper');
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({});
  for (const blogData of initialBlogs) {
    const blogObject = new Blog(blogData);
    await blogObject.save();
  }
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');
  const titles = response.body.map((r) => r.title);
  expect(titles).toContain('Narkomaanit');
});

test('Id is Id not _id', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body; 

  blogs.forEach((blog) => {
    expect(blog).toHaveProperty('id');
    expect(blog).not.toHaveProperty('_id');
  });
});


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('if "likes" field is not provided, it is set to 0', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://example.com/test',
  };

  const response = await api.post('/api/blogs').send(newBlog);

  expect(response.status).toBe(201);
  expect(response.body.likes).toBe(0);
})

test('Blog does not have field "Title" or "Url"', async () => {
  const newBlog = {
    author:"Hei",
    likes: 2
  }
  const response = await api.post('/api/blogs').send(newBlog)

  expect(response.status).toBe(400)
})

test('updating a blog with valid data succeeds', async () => {
  const initialBlogs = await api.get('/api/blogs');
  const blogToUpdate = initialBlogs.body[0]; // Assuming there's at least one blog

  const updatedData = {
    title: 'Updated Blog Title',
    author: 'Updated Author',
    url: 'https://updated-url.com',
    likes: 42,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200);
})

test('deleting a blog by ID succeeds with status code 204', async () => {
  const initialBlogs = await api.get('/api/blogs');
  const blogToDelete = initialBlogs.body[0]; // Assuming there's at least one blog

  const response = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAfterDeletion = await api.get('/api/blogs');
  const ids = blogsAfterDeletion.body.map((blog) => blog.id);

  expect(response.status).toBe(204);
  expect(ids).not.toContain(blogToDelete.id);
});

afterAll(async () => {
  await mongoose.connection.close();
});