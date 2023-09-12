const _ = require('lodash')

const mostBlogsByAuthor = (blogs) => {
    const groupedBlogs = _.groupBy(blogs, 'author')
    const authorWithMostBlogs = _.maxBy(Object.keys(groupedBlogs), author => groupedBlogs[author].length)
    const mostBlogCount = groupedBlogs[authorWithMostBlogs].length

    return { author: authorWithMostBlogs, mostBlogs: mostBlogCount}
}

module.exports = {mostBlogsByAuthor}