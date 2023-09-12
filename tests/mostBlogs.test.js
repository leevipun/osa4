const favoriteBlog = require('../utils/favoriteBlog');
const mostBlogs = require('../utils/mostBlogs')

describe('favoriteBlog', () => {
    test('When list has a one author that has most blogs', () => {
        const blogs = [
      {
        title: 'Blog 1',
        author: 'Alice',
        likes: 5
      },
      {
        title: 'Blog 2',
        author: 'Bob',
        likes: 10
      },
      {
        title: 'Blog 3',
        author: 'Carol',
        likes: 15
      },
      {
        title: 'Blog 4',
        author: 'Carol',
        likes: 15
      }
    ];
    const result = mostBlogs.mostBlogsByAuthor(blogs)
    expect(result).toStrictEqual({
        author: 'Carol',
        mostBlogs: 2
      })
    })
    test('When list has two or more authors that has most blogs', () => {
        const blogs = [
      {
        title: 'Blog 1',
        author: 'Alice',
        likes: 10
      },
      {
        title: 'Blog 2',
        author: 'Carol',
        likes: 15
      },
      {
        title: 'Blog 3',
        author: 'Carol',
        likes: 15
      },
      {
        title: 'Blog 1',
        author: 'Alice',
        likes: 10
      }
    ];
        const result = mostBlogs.mostBlogsByAuthor(blogs)
    expect(result).toStrictEqual({
        author: 'Alice',
        mostBlogs: 2
      })
    })
})