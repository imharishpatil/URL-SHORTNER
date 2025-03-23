const express = require("express");
const { getAllGeneratedUrls } = require("../controllers/admin");
const router = express.Router();
const { restrictToAdmin } = require("../middlewares/auth");

// Get all URLs for admin
router.get("/urls", restrictToAdmin, getAllGeneratedUrls);

module.exports = router;
