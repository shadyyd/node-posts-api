const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Log the validation error and send a response
      logger.error(
        `Validation error: ${error.details
          .map((detail) => detail.message)
          .join(", ")}`
      );
      return next(
        new AppError(
          400,
          "Validation failed: " +
            error.details.map((detail) => detail.message).join(", ")
        )
      );
    }
    next();
  };
};

module.exports = validate;
