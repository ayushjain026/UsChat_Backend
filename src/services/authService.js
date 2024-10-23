const { db } = require("../config/firebaseConfig");
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

const User = require("../models/userModel");

//#region 

// Validate that user required fields are not empty.
const validateUserData = async(user) => {
    let { name, email, password } = user;
    if(!name && !email && !password)
        throw new Error("Please select all fields");
    return true;
}

// check user exist or not
const validateUser = async(user) => {
    try {
        const userInfo = query(
          collection(db, "Users"),
          where("email", "==", user.email)
        );
        const result = await getDocs(userInfo);
        return result.empty;
    } catch (error) {
        throw new Error('Error checking user existence: ' + error.message);
    }
}
//#endregion


exports.registerUser = async(userData) => {
    const user = new User(userData);

    if (validateUserData(user) && await validateUser(user)) {
        return userService.createUser(user);
    } 
    else {
        return null;
    }
}