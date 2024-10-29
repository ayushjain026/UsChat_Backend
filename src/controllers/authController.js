const { generateToken } = require("../config/generateToken");
const authService = require("../services/authService");
const firebaseService = require("../services/firebaseService");
const asyncHandler = require("express-async-handler");

exports.registerUser = asyncHandler(async (req, res) => {
  try {
    const userData = req.body;
    const userId = await authService.registerUser(userData);

    if (!userId) throw new Error("User registration failed, please retry...!");

    res.status(201).json({ newUserId: userId, accessTokem: generateToken(userId) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Adding users", error: error.message });
  }
});

exports.loginUser = asyncHandler( async(req, res) => {
  try {
      const userData = req.body;
      const userDetails = await authService.userLogin(userData);
      res.status(200).json(userDetails);
      
  }
  catch (error) {
    res.status(500)
        .json({ message: "Error Adding users", error: error.message });
  }
});


exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const publicUrl = await firebaseService.uploadFileToFirebase(req.file);
    res.status(200).send({ publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Failed to upload file.");
  }
};
