const express = require("express");
const userRoutes = require("./src/routers/userRouters");
const authRoutes = require("./src/routers/authRoutes");
const chatRoutes = require("./src/routers/chatRoutes");

// const morgan = require("morgan"); // Logger for production
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
// app.use(morgan("tiny")); // HTTP request logger
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const { protect } = require("./src/middleware/authMiddleware");
const { enableNetwork } = require("firebase/firestore");


// Routes for application
// User Module
app.use("/api/users", protect, userRoutes);  
// Auth Module
app.use("/api/auth", authRoutes);
// Chatting Module
app.use("/api/chats", protect, chatRoutes);

module.exports = { app };
