const express = require("express");
require("express-async-errors");

const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
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
app.use((error, req, res, next) => {
  logger.error(`Error: ${error.message}`);
  res.status(error.statusCode).json({ message: error.message });
});

mongoose.connect(process.env.DATABASE_URL).then(() => {
  logger.info("Connected to MongoDB Server");
  app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
  });
});
