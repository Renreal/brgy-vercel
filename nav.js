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

// Reference to the container elements for displaying user data
const firstNameElement = document.getElementById('firstName');
const navItemsContainer = document.getElementById('navItems');


                // Function to update the navigation items based on user authentication state
            const updateNavItems = async (user) => {
            if (user) {
                // User is logged in
                navItemsContainer.innerHTML = `
                    <a href="#about">About Us</a>
                    <a href="newDashboard.html">Dashboard</a>
                    <a href="/LandingPage.html">Services</a>
                    <a id="signOutButton">Sign Out</a>
                    <a href="" id="profileImage"><img src="personIcon.svg">
                    <span class="notif" id="notif">3</span></a>
                `;
                const signOutButton = document.getElementById('signOutButton');
                signOutButton.addEventListener('click', userSignout);
               
                // Find the user document in Firestore
                const querySnapshot = await getDocs(query(collection(db, 'userRecords'), where('email', '==', user.email)));
    
                if (!querySnapshot.empty) {
                    const userDocument = querySnapshot.docs[0].data();
                    const profileImage = document.getElementById('profileImage');
                     // Set the image src to the retrieved imageURL
                    if (userDocument.imageURL) {
                        profileImage.querySelector('img').src = userDocument.imageURL;
                    }
                }
            } else {
                // User is logged out
                navItemsContainer.innerHTML = `
                    <a href="#about">About Us</a>
                    <a href="/Index.html">Services</a>
                    <a href="/Index.html">Login</a>
                    <a href="/Index.html">Signup</a>
                    <a href="/Index.html">Admin</a>
                `;
            }
        };

        
        const userSignout =async() => {
            await signOut(auth);
    }

//tracks the user's st wether they are logged in or logged out
const checkAuthState = async() => { 
           onAuthStateChanged(auth, user => {
            updateNavItems(user);
           }) 
       }

       checkAuthState(); 
