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
                    addDoc, getDocs
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
                
                //tracks the user's st wether they are logged in or logged out
                const checkAuthState = async() => { 
                                onAuthStateChanged(auth, user => {
                                    if(user){
                                      console.log("User is logged in");
                                        }
                                        else{
                                        location.replace("index.html");
                                          console.log("user logged out");
                                        }
                                }) 
                            }

                            checkAuthState(); 
                  
                //to display firestore collection of current user
  // Get a reference to the "View Transaction" button
const viewTransactionButton = document.getElementById('dashboard');

// Reference to your <ul> element
const guidesList = document.querySelector('.guides');

// Function to fetch and display data from Firestore for the current user
const displayCurrentUserData = async () => {
  try {
    // Get the currently logged-in user
    const user = auth.currentUser;

    if (user) {
      // Get the UID of the current user
      const userId = user.uid;

      // Query the Firestore "newUsers" collection with a filter for the current user's UID
      const querySnapshot = await getDocs(query(collection(db, 'userInfo'), where('uid', '==', userId)));

      // Clear the existing list items
      guidesList.innerHTML = '';

      // Loop through each document in the collection
      querySnapshot.forEach((doc) => {
        // Get the data of each document
        const userData = doc.data();

        // Create a list item for the user and add it to the <ul> element
        const listItem = document.createElement('li');
        listItem.textContent = `First Name: ${userData.firstName}, Last Name: ${userData.lastName}, Email: ${userData.email}`;
        guidesList.appendChild(listItem);
      });
    } else {
      // Handle the case where no user is logged in
      console.log('No user is currently logged in.');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Add an event listener to the "View Transaction" button
viewTransactionButton.addEventListener('click', displayCurrentUserData);

