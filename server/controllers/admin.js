const URL = require("../models/url");
const User = require("../models/user");

// Fetch all URLs with user details, click count, and last visit timestamp
async function getAllGeneratedUrls(req, res) {
  try {
    const urls = await URL.find()
      .populate("createdBy", "name") 
      .exec();

    // Map through URLs and format the response
    const formattedUrls = urls.map((url) => {
      const lastVisit =
        url.visitHistory.length > 0
          ? new Date(url.visitHistory[url.visitHistory.length - 1].timestamp).toLocaleString()
          : "No Visits Yet";

      return {
        shortId: url.shortId,
        originalUrl: url.redirectURL,
        createdDate: new Date(url.createdAt).toLocaleString(),
        userName: url.createdBy ? url.createdBy.name : "N/A",
        totalClicks: url.visitHistory.length,
        lastVisit,
      };
    });

    res.status(200).json(formattedUrls);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}

module.exports = {
  getAllGeneratedUrls,
};
