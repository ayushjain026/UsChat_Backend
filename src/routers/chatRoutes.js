const express = require("express");
const { accessChat } = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();



router.route('/').get(protect, accessChat);
// router.route("/").get(protect, fetchChats);
// router.route("/create-group-chat").get(protect, createGroup);
// router.route("/rename-group-chat").put(protect, renameGroup);
// router.route("/removeGroup").put(protect, removeUserFromGroupChat);
// router.route("/addGroup", put(protech, addUserToGroup))

module.exports = router;