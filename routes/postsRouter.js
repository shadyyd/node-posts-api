const express = require("express");
const postsController = require("./../controller/postsController");
const auth = require("./../middlewares/auth");
const images = require("./../middlewares/images");
const {
  createPostSchema,
  updatePostSchema,
} = require("../validation/postSchemas");
const validate = require("../middlewares/validate");
const router = express.Router();

router.use(auth);

router.post(
  "/",
  images.uploadImages("images", 3),
  images.resizeImages("images"),
  validate(createPostSchema),
  postsController.createPost
);

router.get("/", postsController.getPosts);

router.get("/:id", postsController.getPost);

router.patch(
  "/:id",
  images.uploadImages("images", 3),
  images.resizeImages("images"),
  validate(updatePostSchema),
  postsController.updatePost
);

router.delete("/:id", postsController.deletePost);

module.exports = router;
