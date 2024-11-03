const asyncHandler = require("express-async-handler");
const { db } = require("../config/firebase");
const { collection, query, where, getDocs, doc, getDoc, addDoc } = require("firebase/firestore");

const DB_COLLECTION = require("../enum/databaseEnums")

exports.accessChatForUser = asyncHandler(async (loggedInUser, userId) => {
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    // Query to check if there's an existing chat between the two users
    const chatsRef = collection(db, DB_COLLECTION.CHATS);
    const q = query(
      chatsRef,
      where("isGroupChat", "==", false),
      where("userIds", "array-contains", userId)
    );

    const isChatSnapshot = await getDocs(q);
    let isChat = null;

    isChatSnapshot.forEach((doc) => {
      const chatData = doc.data();
      if (chatData.userIds.includes(userId)) {
        isChat = { id: doc.id, ...chatData };
      }
    });

    // If chat exists, return it with populated user data
    if (isChat) {
      return isChat;
    }
    else {
      // Create a new chat if no existing chat is found
      const userDocRef = query(
        collection(db, DB_COLLECTION.USERS),
        where("__name__", "in", [userId, loggedInUser.id])  // User __name__ instead of ID for firebase id.
      );
      const userDetails = await getDocs(userDocRef);

      if (userDetails.empty) {
        throw new Error("User not found");
      }

      const usersData = userDetails.docs.map(doc => {
        const { id, ...userData } = doc.data();
        userData.id = doc.id;
        return { userData }; // Return user data excluding the password
      });


      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: usersData,
        userIds: [userId, loggedInUser.id],
        latestMessage: null,
      };

      const chatRef = await addDoc(collection(db, DB_COLLECTION.CHATS), chatData);
      const newChatInfo = await getDoc(chatRef);

      // const users = await Promise.all(
      //   chatData.users.map(async (userId) => {
      //     const userDocRef = doc(db, DB_COLLECTION.USERS, userId);
      //     const userDoc = await getDoc(userDocRef);
      //     return { id: userDoc.id, ...userDoc.data() };
      //   })
      // );
      const { password, ...newChat } = newChatInfo.data()

      return newChat;
    }
  } catch (error) {
    console.error("Error accessing chat:", error);
    throw Error(error.message);
  }
});

exports.getAllChatsForUser = async(userId) => {
  const chatsRef = collection(db, DB_COLLECTION.CHATS);
  const q = query(
    chatsRef,
    where("isGroupChat", "==", false),
    where("userIds", "array-contains", userId)
  );

  const userChatList = await getDocs(q);
  return userChatList.docs.map(x => x.data());
}

exports.groupChatForUsers = async(groupName, members, adminDetails) => {
  const chatRef = await addDoc(collection(db, DB_COLLECTION.CHATS), {
    chatName: groupName,
    users: members,
    isGroupChat: true,
    groupAdmin: adminDetails,
  });

  // Retrieve full group chat data including user details
  const fullGroupChatData = { id: chatRef.id, ...members };

  // Populate user details manually
  const populatedUsers = await Promise.all(
    members.map(async (userId) => {
      const userRef = doc(db, DB_COLLECTION.USERS, userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const { password, ...userData } = userDoc.data(); // Exclude password
        return { id: userId, ...userData };
      }
      return null;
    })
  );

  // Remove any null values in case of non-existing users
  fullGroupChatData.users = populatedUsers.filter(Boolean);
  fullGroupChatData.groupName = groupName;
  fullGroupChatData.groupAdmin = populatedUsers.find(u => u.id === adminDetails);

  return fullGroupChatData;
}
