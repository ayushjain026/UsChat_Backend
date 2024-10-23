const { db } = require("../config/firebaseConfig");
const { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } = require("firebase/firestore");

const User = require("../models/userModel");

//#region for custom functions here
//#endregion

// Get all users details.
exports.getUsers = async () => {
  const usersCollection = collection(db, "Users");
  const response = await getDocs(usersCollection);
  return response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

exports.createUser = async (userData) => {
    let user = new User(userData);
    const createdUser = await addDoc(
      collection(db, "Users"),
      user.toFirestore()
    );
    return createdUser.id;
}

exports.updateUser = async (id, userData) => {
    let user = new User(userData);
    const userRef = doc(db, "Users", id);
    await updateDoc(userRef, user.toFirestore());

    return user;
}

exports.deleteUser = async (id) => {
    let user = doc(db, "Users", id);
    await deleteDoc(user);
    return id;
}
