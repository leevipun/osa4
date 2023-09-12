const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Narkomaanit',
    author: 'Leevi-Puntanen',
    url: 'https://example.com/blog1',
    likes: 3,
  },
  {
    title: 'Heissulivei',
    author: 'Elsa-Norrby',
    url: 'https://example.com/blog2',
    likes: 2,
  },
];

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

afterAll(async () => {
  await mongoose.connection.close();
});
