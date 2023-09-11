const blog = require("../models/blog");

const favoriteBlog = (blogs) => {
    if (blogs.lenght === 0) {
        return null
    }
    let maxLikes = -1;
    let favoriteBlog = null;

    for (const blog of blogs) {
        if (blog.likes >= maxLikes) {
            maxLikes = blog.likes
            favoriteBlog = blog
        }
    }
    return favoriteBlog
}

module.exports = {favoriteBlog}