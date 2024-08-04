const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title must be less than 100 characters long"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description must be less than 500 characters long"],
    },
    tags: {
      type: [String],
      required: [true, "At least one tag is required"],
      validate: {
        validator: function (tags) {
          return (
            tags.length > 0 &&
            tags.every(
              (tag) => typeof tag === "string" && tag.trim().length > 0
            )
          );
        },
        message: "Each tag must be a non-empty string",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
