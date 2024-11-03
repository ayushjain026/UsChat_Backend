const AsyncHandler = require("express-async-handler");
const { db } = require("../config/firebase");

exports.accessChatForUser = async(userId) => {
  if (!userId) {
    console.log("UserId not provided");
    return res.sendStatus(400);
  }

  try {
    // Find a one-to-one chat with the provided user
    const chatsRef = db.collection("chats");
    const querySnapshot = await chatsRef
      .where("isGroupChat", "==", false)
      .where("users", "array-contains", userId) // Check if userId exists in the users array
      .get();

    const isChat = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // If chat exists, return it
    if (isChat.length > 0) {
      return res.status(200).json(isChat[0]);
    }

    // If chat does not exist, create a new one
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
      latestMessage: null, // Assuming you might want to handle messages later
    };

    const createdChatRef = await chatsRef.add(chatData); // Add a new document
    const createdChat = await createdChatRef.get(); // Get the newly created document

    // Return the newly created chat
    res.status(200).json({ id: createdChat.id, ...createdChat.data() });
  } catch (error) {
    console.error("Error accessing chat:", error);
    res.status(500).json({ message: "Server error while accessing chat" });
  }
};
