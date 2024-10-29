const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// User Api's
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
// router.put("/update-user/:id", userController.updateUser);
// router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;
