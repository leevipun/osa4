const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
require("express-async-errors");
const User = require("../models/user");
const blog = require("../models/blog");
const { extractUser } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blogs = await Blog.findById(request.params.id);
  if (blogs) {
    response.json(blogs);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes !== undefined ? body.likes : 0,
    user: user._id,
  });
  if (body.title && body.author && body.url) {
    const savedBlog = await blog.save();
    console.log(user._id);
    console.log(savedBlog);
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.json(savedBlog);
  } else {
    response.sendStatus(400).send("Add Title and Url");
  }
});

blogsRouter.delete("/:id", extractUser, async (request, response, next) => {
  try {
    const token = request.token;
    const blogId = request.params.id;

    if (!token) {
      response.status(401).json({ error: "Token not found" });
    }

    const deletedBlog = await Blog.findById(blogId);

    if (!deletedBlog) {
      response.status(404).json({ error: "Blog not found" });
    }

    const user = request.user;

    if (user.toString() === user._id.toString()) {
      await blog.findByIdAndRemove(blogId);

      response.status(204).end();
    } else {
      response
        .status(403)
        .json({ error: "You dont have permission to delete this blod" });
      console.log(user.toString());
      console.log(user.id.toString());
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const blogId = request.params.id;
    const updatedBlogDocument = await Blog.findByIdAndUpdate(
      blogId,
      updatedBlog,
      { new: true }
    );

    if (updatedBlogDocument) {
      response.json(updatedBlogDocument);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
