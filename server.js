const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config();
connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("API is Running Sucessfully");
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log(`Server Started on Port ${PORT}`);
});
