const favoriteBlog = require('../utils/favoriteBlog')

describe('favoriteBlog', () => {
    test('When list has a one most liked blog', () => {
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
      }
    ];
    const result = favoriteBlog.favoriteBlog(blogs)
    expect(result).toStrictEqual({
        title: 'Blog 3',
        author: 'Carol',
        likes: 15
      })
    })
    test('When list has two or more most liked blogs', () => {
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
      }
    ];
        const result = favoriteBlog.favoriteBlog(blogs)
    expect(result).toStrictEqual({
        title: 'Blog 3',
        author: 'Carol',
        likes: 15
      })
    })
})