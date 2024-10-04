const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    res.status(400); // Use 'res' instead of 'resizeBy'
    throw new Error("Please Enter all the Fields");
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Use 'res' instead of 'resizeBy'
    throw new Error("User already exists");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), // Generate token for the user
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

module.exports = { registerUser };
