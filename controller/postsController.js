const postModel = require("./../model/postsModel");

const createPost = async (req, res, next) => {
  try {
    const post = await postModel.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
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
      .limit(limit)
      .skip((page - 1) * limit); // get posts for the current page

    const pagination = {
      page,
      numberOfPages,
      total: postsCount,
      next: page < numberOfPages,
      prev: page > 1,
    };

    res.status(200).json({ posts, pagination });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reading posts", error: error.message });
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "No document found with that ID" });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
