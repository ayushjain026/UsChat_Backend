const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

const multer = require("multer");
const upload = multer();

// User Auth Api's
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post(
  "/upload",
  upload.single("Profile_Photos"),
  authController.uploadFile
);

module.exports = router;
