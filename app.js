const express = require("express");
const userRoutes = require("./src/routers/userRouters");
const authRoutes = require("./src/routers/authRoutes");
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


// Routes for application
// User Module
app.use("/api/users", userRoutes);  
// Auth Module
app.use("/api/auth", authRoutes);

module.exports = { app };
