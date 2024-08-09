const express = require("express");
require("express-async-errors");

const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const AppError = require("./utils/AppError");
const logger = require("./utils/logger");

const postsRouter = require("./routes/postsRouter");
const userRouter = require("./routes/userRouter");
const imagesRouter = require("./routes/imagesRouter");

const app = express();

app.use(morgan("dev"));
dotenv.config({ path: "./config.env" });
app.use(express.json());
app.use(express.static("./public"));

app.use(userRouter);
app.use("/posts", postsRouter);
app.use(imagesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    // Custom error
    logger.error(`AppError: ${err.message}`);
    res.status(err.statusCode).json({ message: err.message });
  } else {
    // Generic error
    logger.error(`Unknown error: ${err.message}`);
    res.status(500).json({ message: "An unknown error occurred" });
  }
});

mongoose.connect(process.env.DATABASE_URL).then(() => {
  logger.info("Connected to MongoDB Server");
  app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
  });
});
