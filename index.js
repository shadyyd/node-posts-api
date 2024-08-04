const express = require("express");
const dotenv = require("dotenv");
const postsRouter = require("./routes/postsRouter");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

app.use(morgan("dev"));

dotenv.config({ path: "./config.env" });

app.use(express.json());

app.use("/posts", postsRouter);

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Connected to MongoDB Server");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
