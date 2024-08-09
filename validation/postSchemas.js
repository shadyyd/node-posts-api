const Joi = require("joi");

const createPostSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must be at most 255 characters long",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description must be at most 500 characters long",
  }),
  tags: Joi.array().items(Joi.string().max(10)).optional().messages({
    "array.items": "Each tag must be a string and not exceed 10 characters",
  }),
  images: Joi.array().items(Joi.string()).optional(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional().messages({
    "string.min": "Title must be at least 1 character long",
    "string.max": "Title must be at most 255 characters long",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description must be at most 500 characters long",
  }),
  tags: Joi.array().items(Joi.string().max(10)).optional().messages({
    "array.items": "Each tag must be a string and not exceed 10 characters",
  }),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
};
