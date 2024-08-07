const postModel = require("./../model/postsModel");
const AppError = require("./../utils/AppError");
const logger = require("../utils/logger"); // Import the logger

const createPost = async (req, res, next) => {
  try {
    const post = await postModel.create(req.body);
    logger.info(`Post created: ${post._id}`);
    res.status(201).json(post);
  } catch (err) {
    logger.error(`Error creating post: ${err.message}`);
    next(new AppError(500, err.message));
  }
};

const getPosts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const postsCount = await postModel.countDocuments();
    const numberOfPages = Math.ceil(postsCount / limit);

    const posts = await postModel
      .find()
      .skip((page - 1) * limit) // get posts for the current page
      .limit(limit);

    const pagination = {
      page,
      numberOfPages,
      total: postsCount,
      next: page < numberOfPages,
      prev: page > 1,
    };

    res.status(200).json({ posts, pagination });
    logger.info(`Fetched ${posts.length} posts`);
  } catch (err) {
    logger.error(`Error fetching posts: ${err.message}`);
    next(new AppError(500, err.message));
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      logger.warn(`Post not found: ${req.params.id}`);
      return next(new AppError(404, "Post not found"));
    }

    res.status(200).json(post);
    logger.info(`Fetched post: ${post._id}`);
  } catch (err) {
    logger.error(`Error fetching post ${req.params.id}: ${err.message}`);
    next(new AppError(500, err.message));
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      logger.warn(`Post not found for update: ${req.params.id}`);
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
    logger.info(`Post updated: ${post._id}`);
  } catch (err) {
    logger.error(`Error updating post ${req.params.id}: ${err.message}`);
    next(new AppError(500, err.message));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id);
    if (!post) {
      logger.warn(`Post not found for deletion: ${req.params.id}`);
      return res
        .status(404)
        .json({ message: "No document found with that ID" });
    }
    res.status(204).send();
    logger.info(`Post deleted: ${req.params.id}`);
  } catch (err) {
    logger.error(`Error deleting post ${req.params.id}: ${err.message}`);
    next(new AppError(500, err.message));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
