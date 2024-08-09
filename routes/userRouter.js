const express = require("express");
const { signupSchema, loginSchema } = require("../validation/userSchemas");
const validate = require("../middlewares/validate");
const { signup, login, getAllUsers } = require("../controller/usersController");

const router = express.Router();

const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");

router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);

router.get("/users", auth, restrictTo("admin"), getAllUsers);

module.exports = router;
