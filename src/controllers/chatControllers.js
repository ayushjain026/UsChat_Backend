const AsyncHandler = require("express-async-handler");

const chatService = require("../services/chatService");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


exports.accessChat = AsyncHandler(async (req, res) => {
    try {
        const userId = req.body.userId;
        const data = await chatService.accessChatForUser(userId);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

// exports.accessChat = AsyncHandler(async (req, res) => {
//   const { userId } = req.body;
//   if (!userId) {
//     console.log("UserId not provided");
//     return res.sendStatus(400);
//   }

//   try {
//     // Find a one-to-one chat with the provided user
//     let isChat = await Chat.find({
//       isGroupChat: false,
//       $and: [
//         // { users: { $elemMatch: { $eq: req.user._id } } },
//         { users: { $elemMatch: { $eq: userId } } },
//       ],
//     })
//       .populate("users", "-password")
//       .populate("latestMessage");

//     isChat = await User.populate(isChat, {
//       path: "latestMessage.sender",
//       select: "name pic email",
//     });

//     // If chat exists, return it
//     if (isChat.length > 0) {
//       return res.status(200).json(isChat[0]);
//     }

//     // If chat does not exist, create a new one
//     const chatData = {
//       chatName: "sender",
//       isGroupChat: false,
//       users: [req.user._id, userId],
//     };

//     const createdChat = await Chat.create(chatData);
//     const fullChat = await Chat.findOne({ _id: createdChat._id })
//       .populate("users", "-password")
//       .populate("latestMessage");

//     res.status(200).json(fullChat);
//   } catch (error) {
//     console.error("Error accessing chat:", error);
//     res.status(500).json({ message: "Server error while accessing chat" });
//   }
// });
