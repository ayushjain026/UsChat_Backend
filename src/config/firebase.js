const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq4zvFLZbN9VbrCdZKbz25uOwcvDF2Bg0",
  authDomain: "uschat-radix.firebaseapp.com",
  projectId: "uschat-radix",
  storageBucket: "uschat-radix.appspot.com",
  messagingSenderId: "584163941287",
  appId: "1:584163941287:web:3531d671e4dc6a5ed0f482",
  measurementId: "G-E2XR9PHKC8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (the database service)
const db = getFirestore(app);

module.exports = { db };
