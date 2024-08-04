const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filePath = path.join(__dirname, "./../posts.json");

const readAllPosts = async () => {
  const data = await fs.readFile(filePath);
  return JSON.parse(data);
};

const writePosts = async (posts) => {
  await fs.writeFile(filePath, JSON.stringify(posts));
};

const createPost = async (body) => {
  const post = {
    _id: uuidv4(),
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const posts = await readAllPosts();
  posts.push(post);
  await writePosts(posts);
  return post;
};

const updatePost = async (id, updatedData) => {
  let posts = await readAllPosts();
  const post = posts.filter((post) => post._id === id)[0];
  if (!post) return null;

  const updatedPost = { ...post, ...updatedData, updatedAt: new Date() };
  posts = posts.map((post) => (post._id === id ? updatedPost : post));
  await writePosts(posts);
  return updatedPost;
};

const deletePost = async (id) => {
  let posts = await readAllPosts();
  const post = posts.filter((post) => post._id === id)[0];
  if (!post) return null;
  posts = posts.filter((post) => post._id !== id);
  writePosts(posts);
  return post;
};

module.exports = {
  readAllPosts,
  createPost,
  updatePost,
  deletePost,
};
