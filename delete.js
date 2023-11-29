import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHWn2BsQUOLs4LdGeRwY9HqL-t9zlYEjQ",
  authDomain: "authfun-b2577.firebaseapp.com",
  projectId: "authfun-b2577",
  storageBucket: "authfun-b2577.appspot.com",
  messagingSenderId: "130874970746",
  appId: "1:130874970746:web:3952d2f045e4905af361c3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  // Your existing code here...

  // Your addUser function
  async function addUser() {
    const club = document.getElementById("club").value;
    const sports = document.getElementById("sports").value;

    const activity = [club, ...sports]; // Combine club and sports into a single array

    const db = await getFirestore(); // Use await to ensure db is initialized

    // Add a document to the "user-data" collection
    db.collection("user-data").doc("user's-activity").set({
      activity: activity,
    }).then(() => {
      console.log("User activity added successfully!");
    }).catch((error) => {
      console.error("Error adding user activity:", error);
    });
  }

  // Attach the addUser function to the button click event
  const addUserButton = document.getElementById("addUserButton");
  addUserButton.addEventListener("click", addUser);
});
