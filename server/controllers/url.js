const shortid = require("shortid");
const URL = require("../models/url");
require("dotenv").config();

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    // Validate if the URL is provided and it's a valid URL
    if (!body.url) {
      return res.status(400).json({ error: "URL is required" });
    }

    let formattedUrl = body.url.trim();
    if (!/^https?:\/\//i.test()) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const shortID = shortid();

    // Create a new short URL entry
    const newURL = await URL.create({
      shortId: shortID,
      redirectURL: formattedUrl,
      visitHistory: [],
      createdBy: req.user._id,
    });

    // Send the response with the URL and click count
    return res.status(201).json({
      message: "Short URL created",
      shortUrl: `${process.env.BACKEND_URL}/url/${shortID}`,
      totalClicks: newURL.visitHistory.length,
      shortId: shortID,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: `${error}` });
  }
}

const handleGetAnalytics = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const userId = req.user._id;
    const urls = await URL.find({ createdBy: userId });

    if (!urls || urls.length === 0) {
      return res.status(404).json({ message: "No URLs found for this user" });
    }

    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
