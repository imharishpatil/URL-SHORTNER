const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");

const URL = require("./models/url");

require("dotenv").config();
connectDB();

const app = express();
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//Admin route
app.use("/admin", adminRoute);

// Url route
app.use("/url", urlRoute);

// User route
app.use("/user", userRoute);

// Redirect for short URLs
app.get("/url/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true } // Ensure the updated document is returned
    );

    if (!entry) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Redirect the user to the original URL
    return res.redirect(entry.redirectURL);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: `${error.message}` });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
