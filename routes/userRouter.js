const express = require("express");
const router = express.Router();

const { signup, login, getAllUsers } = require("../controller/usersController");
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");

router.post("/signup", signup);

router.post("/login", login);

router.get("/users", auth, restrictTo("admin"), getAllUsers);

module.exports = router;
