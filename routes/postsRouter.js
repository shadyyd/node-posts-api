const express = require("express");
const postsController = require("./../controller/postsController");

const router = express.Router();

router.post("/", postsController.createPost);

router.get("/", postsController.getPosts);

router.patch("/:id", postsController.updatePost);

router.delete("/:id", postsController.deletePost);

module.exports = router;
