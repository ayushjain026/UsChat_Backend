const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// User Api's
router.get("/register", authController.registerUser);
// router.post("/adduser", userController.addUser);
// router.put("/update-user/:id", userController.updateUser);
// router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;
