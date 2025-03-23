const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

async function restrictToLoggedinUserOnly(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(403).json({ message: "Token is required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const user = await User.findById(decoded._id).select("_id role");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; // Attach full user object including ID
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

//  to check if the user is an admin
async function restrictToAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(403).json({ message: "Token is required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const user = await User.findById(decoded._id).select("role");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === "admin") {
        return next();
      }
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  restrictToLoggedinUserOnly,
  restrictToAdmin,
};
