const User = require("./../model/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const AppError = require("../utils/AppError");

const jwtVerify = util.promisify(jwt.verify);

module.exports = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;
    const payload = await jwtVerify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) throw new AppError(403, "User not logged in");
    req.user = user;
    next();
  } catch (err) {
    throw new AppError(401, "Invalid Token, please login again");
  }
};
