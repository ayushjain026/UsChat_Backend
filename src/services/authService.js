const bcrypt = require("bcryptjs");
const { db } = require("../config/firebase");
const {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
} = require("firebase/firestore");
const userService = require("./usersServices");
const firebaseService = require("./firebaseService.js");

const Pages = require("../enum/pageEnums");
const {
  COMMON_VALIDATION,
  COMMON_ERROR,
} = require("../enum/validationMsgEnums");

const User = require("../models/userModel");
const { generateToken } = require("../config/generateToken.js");
const DB_COLLECTION = require("../enum/databaseEnums");

//#region

// Validate that user required fields are not empty.
const validateUserData = async (user, fromPage) => {
  let { name, email, password } = user;
  switch (true) {
    case Pages.REGISTRATION_PAGE === fromPage:
      if (!name && !email && !password)
        throw new Error(COMMON_VALIDATION.RequireAllFields);
      break;
    case Pages.LOGIN_PAGE === fromPage:
      if (!email && !password) throw new Error(COMMON_VALIDATION.registerUser);
      break;
    default:
      throw new Error(COMMON_ERROR.COMMON_VALIDATION);
  }

  return true;
};

// check user exist or not
const validateUser = async (user) => {
  try {
    const userInfo = query(
      collection(db, DB_COLLECTION.USERS),
      where("email", "==", user.email)
    );
    const result = await getDocs(userInfo);
    return result.empty;
  } catch (error) {
    throw new Error("Error checking user existence: " + error.message);
  }
};
//#endregion

exports.registerUser = async (userData) => {
  userData.profilePhoto = userData.profilePhoto != null ? await firebaseService.uploadFileToFirebase(
    userData.profilePhoto
  ) : null;
  const user = new User(userData);

  if (validateUserData(user, Pages.REGISTRATION_PAGE)) {
    return await userService.createUser(user);
  } else {
    return null;
  }
};

exports.userLogin = async ({ email, password }) => {
  try {
    const userQuery = query(
      collection(db, DB_COLLECTION.USERS),
      where("email", "==", email)
    );
    const userSnapshot = await getDocs(userQuery);

    // Check if user exists
    if (userSnapshot.empty) {
      throw new Error("User not found.");
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Step 3: Compare the provided password with the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Incorrect password.");
    }

    return {
      id: userDoc.id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
      accessToken: generateToken(userDoc.id),
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
