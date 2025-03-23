const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  getUserProfile,
} = require("../controllers/user");
const { restrictToLoggedinUserOnly } = require("../middlewares/auth");

const router = express.Router();

// Route to register a new user
router.post("/register", handleUserSignup);

// Route to login a user
router.post("/login", handleUserLogin);

// Example of a protected route (using middleware for logged-in users)
router.get("/profile", restrictToLoggedinUserOnly, getUserProfile);

module.exports = router;
