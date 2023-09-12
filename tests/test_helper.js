const Blog = require('../models/blog')
const User = require('../models/user')

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

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}