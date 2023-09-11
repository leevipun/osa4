const listHelper = require('../utils/list_helper')
const totalLikes = require('../utils/totalLikes')

describe('totalLikes', () => {
    test('dummy returns one', () => {
        const blogs = []
      
        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
      })
  test('empty list returns 0', () => {
    const result = totalLikes.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that blog', () => {
    const blogs = [
      {
        title: 'Sample Blog',
        author: 'John Doe',
        likes: 10
      }
    ];

    const result = totalLikes.totalLikes(blogs);
    expect(result).toBe(10);
  });

  test('when list has multiple blogs, equals the sum of likes of all blogs', () => {
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

    const result = totalLikes.totalLikes(blogs);
    expect(result).toBe(30); // 5 + 10 + 15 = 30
  });
});