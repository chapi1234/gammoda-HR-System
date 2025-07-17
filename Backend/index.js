const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/DBconnect");
const connectCloudinary = require("./config/cloudinary");

const app = express();
connectDB();
connectCloudinary();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Welcome to the backend server");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
