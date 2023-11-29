import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
  } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";


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


      //sign out button instance 
      const signOutButton = document.querySelector('#signOutButton');

      //signout
      const userSignout =async() => {
                  await signOut(auth);
                  location.replace("index.html");
          }
          signOutButton.addEventListener('click', userSignout);
          

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