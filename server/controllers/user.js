require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user and assign it to a variable to generate a token
    user = await User.create({ name, email, password: hashedPassword });

    // Generate token for the newly created user
    const token = setUser(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: `${error}` });
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = setUser(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}

async function getUserProfile(req, res) {
  try {
    const userId = req.user._id;

    // Fetch user data from the database using Mongoose (findOne returns a promise)
    const user = await User.findOne({ _id: userId }); // Use a query object
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user profile data
    res.json({ loggedIn: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  getUserProfile,
};
