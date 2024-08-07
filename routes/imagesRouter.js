const express = require("express");
const { uploadSingleImage, resizeImages } = require("../middlewares/images");
const { uploadAndResizeImage } = require("../controller/imageController");
const router = express.Router();

router.post(
  "/image-resize",
  uploadSingleImage("image"),
  resizeImages("image"),
  uploadAndResizeImage
);

module.exports = router;
