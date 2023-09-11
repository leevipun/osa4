const mostlikesByAuthor = require('../utils/mostLikes')

describe('favoritelikes', () => {
    test('When list has a one most liked blog', () => {
        const blogs = [
      {
        title: 'Blog 1',
        author: 'Alice',
        likes: 5
      },
      {
        title: 'Blog 2',
        author: 'Carol',
        likes: 10
      },
      {
        title: 'Blog 3',
        author: 'Carol',
        likes: 15
      }
    ];
    const result = mostlikesByAuthor.mostLikes(blogs)
    expect(result).toStrictEqual({
        author: 'Carol',
        likes: 25
      })
    })
    test('When list has two most liked author', () => {
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
        title: 'blog 4',
        author: 'Alice',
        likes: 20
      }
    ];
        const result = mostlikesByAuthor.mostLikes(blogs)
    expect(result).toStrictEqual({
        author: 'Alice',
        likes: 30
      })
    })
})