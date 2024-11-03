const { db } = require("../config/firebase");
const { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } = require("firebase/firestore");

const User = require("../models/userModel");
const DB_COLLECTION = require("../enum/databaseEnums");

//#region for custom functions here
//#endregion

// Get all users details.
exports.getUsers = async () => {
  const usersCollection = collection(db, DB_COLLECTION.USERS);
  const response = await getDocs(usersCollection);
  return response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.createUser = async (userData) => {
  let user = new User(userData);
  user.password = await user.hashPassword();
  const createdUser = await addDoc(collection(db, DB_COLLECTION.USERS), await user.toFirestore());
  return createdUser.id;
};

exports.updateUser = async (id, userData) => {
    let user = new User(userData);
    const userRef = doc(db, DB_COLLECTION.USERS, id);
    await updateDoc(userRef, user.toFirestore());

    return user;
}

exports.deleteUser = async (id) => {
    let user = doc(db, DB_COLLECTION.USERS, id);
    await deleteDoc(user);
    return id;
}
