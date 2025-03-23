const jwt = require("jsonwebtoken");
require("dotenv").config();

function setUser(user) {
  try {
    return jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  } catch (error) {
    throw new Error("Failed to generate token: " + error.message); // Improved error handling
  }
}

module.exports = {
  setUser,
};
