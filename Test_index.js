const express = require("express");
const { db } = require("./src/config/firebaseConfig");
const { collection, addDoc, updateDoc, doc } = require("firebase/firestore");
const User = require("./src/models/User"); // Import User model

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Add new User (Create)
app.post("/add-user", async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    const newUser = new User(name, email, password, pic); // Use the User model
    const docRef = await addDoc(collection(db, "Users"), { ...newUser });
    res.status(200).send({ message: "User added successfully", id: docRef.id });
  } catch (e) {
    res.status(500).send({ error: "Error adding user", details: e.message });
  }
});

// Get all Users (Read)
app.get("/get-users", async (req, res) => {
  try {
    const usersCollection = collection(db, "Users");
    const querySnapshot = await getDocs(usersCollection);
    let users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({ error: "Error fetching users", details: e.message });
  }
});

// Update User by ID (Update)
app.put("/update-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = doc(db, "Users", userId);
    const { name, email, password, pic } = req.body;
    const updatedUser = {
      name: name,
      email: email,
      password: password,
      pic: pic || newUser.pic, // Keep default if not provided
      updatedAt: Date.now(),
    };
    await updateDoc(userRef, updatedUser);
    res.status(200).send({ message: "User updated successfully" });
  } catch (e) {
    res.status(500).send({ error: "Error updating user", details: e.message });
  }
});

// Delete User by ID (Delete)
app.delete("/delete-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = doc(db, "Users", userId);
    await deleteDoc(userRef);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).send({ error: "Error deleting user", details: e.message });
  }
});

// Start the server
dotenv.config();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
