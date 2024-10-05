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

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  // Make sure 'search' is a string and trim it to remove any extra spaces
  const searchTerm = req.query.search ? req.query.search.trim() : "";
  console.log("Searched term: " + searchTerm); // Debugging search term

  // If the searchTerm is provided, build the $or query
  const keyword = searchTerm
    ? {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search for name
          { email: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search for email
        ],
      }
    : {};

  console.log("Search Query: ", keyword); // Debugging the search query

  // Check if req.user exists
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }

  try {
    // Perform the search, excluding the logged-in user
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    console.log("Users found after search: ", users); // Debugging found users
    res.json(users); // Send the found users as JSON
  } catch (error) {
    res.status(500);
    throw new Error("Error fetching users");
  }
});

module.exports = { registerUser, authUser, allUsers };
