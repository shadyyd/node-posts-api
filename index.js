const express = require("express");
const dotenv = require("dotenv");
const postsRouter = require("./routes/postsRouter");
const morgan = require("morgan");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = express();

app.use(morgan("dev"));

// const { existsSync, writeFileSync } = require("fs");
// if (!existsSync("posts.json")) {
//   writeFileSync("posts.json", JSON.stringify([]));
// }

dotenv.config({ path: "./config.env" });

app.use(express.json());

app.use("/posts", postsRouter);

mongoose.connect("mongodb://localhost:27017/posts").then(() => {
  console.log("Connected to MongoDB Server");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTRM", () => {
  console.log("SIGTERM recived! 💥 Shutting down...");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
