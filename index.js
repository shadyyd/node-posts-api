const express = require("express");
const dotenv = require("dotenv");
const postsRouter = require("./routes/postsRouter");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

const { existsSync, writeFileSync } = require("fs");
if (!existsSync("posts.json")) {
  writeFileSync("posts.json", JSON.stringify([]));
}

dotenv.config({ path: "./config.env" });

app.use(express.json());

app.use("/posts", postsRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
