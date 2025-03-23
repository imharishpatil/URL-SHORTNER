const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url");
const { restrictToLoggedinUserOnly } = require("../middlewares/auth.js");

const router = express.Router();

// Route to create a new short URL (only accessible to logged-in users)
router.post("/", restrictToLoggedinUserOnly, handleGenerateNewShortURL);

// Route to get generated URLs (only user's URLs)
router.get("/urls", restrictToLoggedinUserOnly, handleGetAnalytics);

module.exports = router;
