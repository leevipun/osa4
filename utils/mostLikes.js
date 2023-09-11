const _ = require('lodash');

const mostLikes = (blogs) => {
    const groupedBlogs = _.groupBy(blogs, 'author');
    
    let authorWithMostLikes = null;
    let mostLikes = -1;
    
    for (const author in groupedBlogs) {
        const totalLikes = _.sumBy(groupedBlogs[author], 'likes');
        if (totalLikes > mostLikes) {
            mostLikes = totalLikes;
            authorWithMostLikes = author;
        }
    }

    return { author: authorWithMostLikes, likes: mostLikes };
};

module.exports = { mostLikes };