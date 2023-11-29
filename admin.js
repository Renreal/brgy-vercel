// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { 
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import {
getFirestore,
collection,
addDoc, getDoc, doc, query, where, getDocs
} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';

// Your web app's Firebase configuration

const firebaseConfig = {
apiKey: "AIzaSyDHWn2BsQUOLs4LdGeRwY9HqL-t9zlYEjQ",
authDomain: "authfun-b2577.firebaseapp.com",
projectId: "authfun-b2577",
storageBucket: "authfun-b2577.appspot.com",
messagingSenderId: "130874970746",
appId: "1:130874970746:web:3952d2f045e4905af361c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


                        
// ...

// Function to get user names and update the HTML
const displayUserNames = async () => {
    try {
      // Query the "userRecords" collection
      const userRecordsCollection = collection(db, 'userRecords');
      const querySnapshot = await getDocs(userRecordsCollection);
  
      // Get the container
      const userNamesContainer = document.getElementById('userNamesContainer');
  
      // Clear previous content
      userNamesContainer.innerHTML = '';
  
      // Loop through the documents and display names with check and info icons
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userName = `${userData.name} ${userData.lastname}`;
        const userId = doc.id;
  
        // Create a container div for each user
        const userContainer = document.createElement('div');
        userContainer.classList.add('order-container');
  
        // Create a div for user name and append to the user container
        const userNameDiv = document.createElement('div');
        userNameDiv.classList.add('type');
        userNameDiv.textContent = userName;
        userNameDiv.classList.add('action');
        userContainer.appendChild(userNameDiv);
  
        
  
        // Create a check icon and append to the action div
        const checkIcon = document.createElement('p');
        checkIcon.id = `check_${userId}`;
        checkIcon.innerHTML = '&#9989;';
        userContainer.appendChild(checkIcon);
        // Create an info icon and append to the action div
        const infoIcon = document.createElement('p');
        infoIcon.id = `info_${userId}`;
        infoIcon.innerHTML = '&#9432;';
        userContainer.appendChild(infoIcon);
        
  
        // Append the user container to the user names container
        userNamesContainer.appendChild(userContainer);
      });
    } catch (error) {
      console.error("Error displaying user names:", error);
      // Handle the error as needed
    }
  };
  
  // Call the function to display user names
  displayUserNames();
  
                
                

  /* admin auth state */
      
             // Function to handle user logout
const handleLogout = async () => {
    try {
      // Sign out the user
      await signOut(auth);
      alert("You have been successfully logged out!");
      // Redirect to the landing page or any other desired page
      location.replace("LandingPage.html");
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle the error as needed
    }
  };
  
// Add an event listener to the "Logout" link
const logoutLink = document.getElementById('Logout');
logoutLink.addEventListener('click', handleLogout);



        //display date
                const currentDate = new Date();
                const dateElement = document.getElementById("date");
                dateElement.textContent = currentDate.toDateString();

