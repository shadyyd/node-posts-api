const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const util = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");
const logger = require("../utils/logger");

const jwtSign = util.promisify(jwt.sign);

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Signup attempt with already used email: ${email}`);
      throw new AppError(409, "Email is already used");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    logger.info(`New user created: ${user._id}`);
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    logger.error(`Signup error: ${err.message}`);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt with invalid email: ${email}`);
      throw new AppError(401, "Invalid email or password");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      const token = await jwtSign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );
      logger.info(`User logged in: ${user._id}`);
      res.status(200).json({ message: "User logged in", token });
    } else {
      logger.warn(`Login attempt with invalid password for email: ${email}`);
      throw new AppError(401, "Invalid email or password");
    }
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    logger.info(`Fetched all users. Count: ${users.length}`);
    res.status(200).json({
      length: users.length,
      users,
    });
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    next(new AppError(404, err.message));
  }
};
