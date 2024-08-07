const fs = require("fs");
const path = require("path");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger"); // Adjust the path as necessary

exports.uploadAndResizeImage = (req, res, next) => {
  if (!req.file) {
    logger.warn("Image upload failed: No image file provided");
    return next(new AppError(400, "Please upload an image"));
  }

  const filePath = path.join(__dirname, "../public/img", req.file.filename);

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${req.file.filename}`
  );

  // Create a read stream from the file path
  const readStream = fs.createReadStream(filePath);

  readStream.on("error", (err) => {
    logger.error(`Error reading file ${filePath}: ${err.message}`);
    next(new AppError(500, "Error reading file"));
  });

  readStream.pipe(res);

  //remove the file after sending it
  readStream.on("close", () => {
    fs.unlink(filePath, (err) => {
      if (err) {
        logger.error(`Failed to delete file ${filePath}: ${err.message}`);
      } else {
        logger.info(`Successfully deleted file ${filePath}`);
      }
    });
  });

  logger.info(`Image uploaded and resized: ${req.file.filename}`);
};
