const URL = require("../models/url");
const User = require("../models/user");

// Fetch all URLs with user details and clicks
async function getAllGeneratedUrls(req, res) {
  try {
    // Populate user details and get URL data with total click count
    const urls = await URL.find()
      .populate("createdBy", "name") // Populate user details (name)
      .exec();

    // Map through the URLs and format the data to include user name and click count
    const formattedUrls = urls.map((url) => ({
      shortId: url.shortId,
      originalUrl: url.redirectURL,
      createdDate: url.createdAt,
      userName: url.createdBy ? url.createdBy.name : "N/A",
      totalClicks: url.visitHistory.length,
    }));

    res.status(200).json(formattedUrls);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}

module.exports = {
  getAllGeneratedUrls,
};
