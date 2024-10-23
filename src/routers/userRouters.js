const express = require("express");
const userController = require("../controllers/userControllers");
const router = express.Router();

// User Api's
router.get("/get-users", userController.getUsers);
router.post("/adduser", userController.addUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;
