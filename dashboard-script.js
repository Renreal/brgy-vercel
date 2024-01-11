
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


//tracks the user's st wether they are logged in or logged out
const checkAuthState = async() => { 
           onAuthStateChanged(auth, user => {
               if(user){
                 //viewTransactionButton.addEventListener('click', displayCurrentUserData);
                 console.log("User is logged in");
                 displayCurrentUserData();
                   }
                   else{
                   location.replace("index.html");
                     console.log("user logged out");
                   }
           }) 
       }

       checkAuthState(); 
  
      

// Function to fetch and display the current user's data
const displayCurrentUserData = async () => {
try {
// Get the currently authenticated user
const user = auth.currentUser;

if (user) { 

const userId = user.uid;
const parentDocRef = doc(db, 'userRecords', userId);
const subcollectionRef = collection(parentDocRef, 'history');
const querySnap = await getDocs(subcollectionRef);

const dataDisplay = document.getElementById('data-display'); // Get the HTML element
const docValue = document.getElementById('document-value');
let totalClaims = 0;

querySnap.forEach((doc) => {
 const data = doc.data();
 const timestamp = data.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
 const value = data.value;
 const status = data.status;
 const cDate = data.claimDate;
 const orderNum = data.orderNumber;
 console.log(cDate);
 
 // Create a new HTML element to display the formatted data
 const dataElement = document.createElement('p');
 const date = document.createElement('p');
 const satus = document.createElement('p');
 const divider = document.createElement('p');
 const claimDateElement = document.createElement('p');
 const orderNumElement = document.createElement('p');

 dataElement.textContent = `Document: ${value}`;
 orderNumElement.textContent =  `order number: ${orderNum}`;
 satus.textContent = `Status: ${status}`;
 date.textContent = `Date: ${timestamp.toLocaleString()}`;
 divider.textContent = `==============================`;

 claimDateElement.textContent = `Claim Date: ${cDate}`;

 if (status === 'ready for pickup') {
  let totalAmount = 100; 
  const divider = document.createElement('div');
  divider.classList.add('div');
  const claim = document.createElement('p');
  const sched = document.createElement('p');
  const amount = document.getElementById('amount');
  const claimDateElement = document.getElementById('Date'); // Add this line

  // Convert the claimDate string to a JavaScript Date object
  const claimDateObject = new Date(cDate);

  /* // Display the claim date in the claimDate element
  claimDateElement.textContent = `Claim Date: ${claimDateObject.toLocaleDateString('en-US')}`;  */

  claim.textContent = `Document: ${value} -Order #: ${orderNum} `;
  sched.textContent = `Claim Date: ${cDate}`;
  divider.appendChild(claim);
  divider.appendChild(sched);

  docValue.appendChild(divider);

  amount.textContent = 'To pay: ' + totalAmount * (++totalClaims) + ' Pesos';
}



 // Append the new data element to the data-display div
 dataDisplay.appendChild(dataElement);
 dataDisplay.appendChild(orderNumElement);
 dataDisplay.appendChild(satus);
 dataDisplay.appendChild(date);
 dataDisplay.appendChild(claimDateElement); 
 dataDisplay.appendChild(divider);
 
});

                   

 

// Get the email of the current user
const userEmail = user.email;
console.log('User Email:', userEmail);

// Query Firestore to find the document with the matching email
const userQuery = query(collection(db, 'userRecords'), where('email', '==', userEmail));
const querySnapshot = await getDocs(userQuery);

if (!querySnapshot.empty) {
 // Assuming there's only one document with the matching email
 const userDocSnapshot = querySnapshot.docs[0];
 const userData = userDocSnapshot.data();
 console.log('User Data:', userData);

 // Display the user's data on the page
 firstNameElement.textContent = userData.name;

} else {
 // Handle the case where no matching document is found
 console.log('User document with the email does not exist.');
}
} else {
// Handle the case where no user is logged in
console.log('No user is currently logged in.');
}
} catch (error) {
console.error('Error fetching user data:', error);
}
}; 