const postModel = require("./../model/postsModel");

const createPost = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;
    const newPost = {
      title,
      description,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdPost = await postModel.createPost(newPost);
    res.status(201).json(createdPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await postModel.readAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reading posts", error: error.message });
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = new Date();
    const updatedPost = await postModel.updatePost(id, updatedData);
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPost = await postModel.deletePost(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
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
