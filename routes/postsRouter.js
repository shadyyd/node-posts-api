const express = require("express");
const postsController = require("./../controller/postsController");
const auth = require("./../middlewares/auth");
const images = require("./../middlewares/images");
const router = express.Router();

router.use(auth);

router.post(
  "/",
  images.uploadImages("images", 3),
  images.resizeImages("images"),
  postsController.createPost
);

router.get("/", postsController.getPosts);

router.get("/:id", postsController.getPost);

router.patch(
  "/:id",
  images.uploadImages("images", 3),
  images.resizeImages("images"),
  postsController.updatePost
);

router.delete("/:id", postsController.deletePost);

module.exports = router;
