const express = require("express");
const { accessChat, fetchChats, createGroupChat } = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();



router.route('/').post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/create-group-chat").post(protect, createGroupChat);
// router.route("/rename-group-chat").put(protect, renameGroup);
// router.route("/removeGroup").put(protect, removeUserFromGroupChat);
// router.route("/addGroup", put(protech, addUserToGroup))

module.exports = router;