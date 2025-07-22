const express = require("express");
const UserController = require("../controllers/user-controllers");
const handleErrorMessage = require("../middleware/handle-error-message");
const { body, validationResult } = require("express-validator");
const AuthMiddleware = require("../middleware/auth-middleware");
const User = require("../models/User");

const router = express.Router();

router.post(
  "/login",
  [body("email").notEmpty(), body("password").notEmpty()],
  handleErrorMessage,
  UserController.login
);

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").notEmpty(),

    body("email").custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("E-mail already existed");
      }
    }),
    body("password").notEmpty(),
  ],
  handleErrorMessage,
  UserController.register
);

router.get("/me", AuthMiddleware, UserController.getMe);

module.exports = router;
