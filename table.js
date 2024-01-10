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
addDoc, getDoc, doc, query, where, getDocs, updateDoc
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



const hasPendingStatus = async (historyCollectionRef) => {
    const historyQuerySnapshot = await getDocs(historyCollectionRef);
  
    // Check if the "history" subcollection has any document with status = "pending"
    return historyQuerySnapshot.docs.some((historyDoc) => {
      return historyDoc.data().status === "pending";
    });
  };
  

// Function to check if a collection exists
const collectionExists = async (collectionRef) => {
  const snapshot = await getDocs(collectionRef);
  return !snapshot.empty;
};

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
      querySnapshot.forEach(async (doc) => {
            
        const historyID = doc.data().userId;
          // Check if the "history" subcollection exists
         const historyCollectionRef = collection(db, 'userRecords', historyID, 'history');
          const hasPending = await hasPendingStatus(historyCollectionRef);
          if (hasPending) {
            const userData = doc.data();
            const userName = `${userData.name} ${userData.middlename} ${userData.lastname}`;
            const uid = doc.id;
        
            // Create a container div for each user
            const userContainer = document.createElement('div');
            userContainer.classList.add('order-container');
            const iconsContainer = document.createElement('div');
            iconsContainer.classList.add('icons');
        
            // Create a div for user name and append to the user container
            const userNameDiv = document.createElement('div');
            userNameDiv.classList.add('type');
            userNameDiv.textContent = userName;
            userNameDiv.classList.add('action');
            userContainer.appendChild(userNameDiv);
        
            // Create a check icon and append to the iconscontainer div
            const checkIcon = document.createElement('p');
            checkIcon.id = `check_${uid}`;
            checkIcon.innerHTML = '&#9989;';
            checkIcon.classList.add('check-icon'); // Add a class for easier identification
            checkIcon.addEventListener('click', () => {
              showModal();
            });
            iconsContainer.appendChild(checkIcon);
        



        // Create an info icon and append to the iconscontainer div
        const infoIcon = document.createElement('p');
        infoIcon.id = `info_${uid}`;
        infoIcon.innerHTML = '&#9432';

        
      //info icon event listener
        infoIcon.addEventListener('click', async () => {
          showinfoModal();
          try {
            // Query the document for the clicked user
            const userDoc = await getDoc(doc.ref);
            // Check if the document exists
            if (userDoc.exists()) {
              // Log the user data to the console
              console.log('User Data:', userDoc.data());

              const userAge = userDoc.data().age;
              const nationality = userDoc.data().Nationality;
              const address = userDoc.data().address;
              const bplace = userDoc.data().birth_place;
              const bday = userDoc.data().birthday;
              const contact = userDoc.data().contactNum;
              const email = userDoc.data().email;
              const gender = userDoc.data().gender;
              const status = userDoc.data().status;
              const occupation = userDoc.data().work;
              const historyID = userDoc.data().userId;
              const imageURL = userDoc.data().imageURL; 

              document.getElementById('fullName').textContent = `${userData.name} ${userData.middlename} ${userData.lastname}`;
              document.getElementById('nationality').textContent = ` ${nationality}`;
              document.getElementById('address').textContent = ` ${address}`;
              document.getElementById('userAge').textContent = `Age: ${userAge}`;
              document.getElementById('bplace').textContent = `Birthplace : ${bplace}`;
              document.getElementById('bday').textContent = `bday: ${bday}`;
              document.getElementById('contact').textContent = `contact: ${contact}`;
              document.getElementById('Uemail').textContent = `email: ${email}`;
              document.getElementById('Ugender').textContent = `gender: ${gender}`;
              document.getElementById('status').textContent = `status: ${status}`;
              document.getElementById('occupation').textContent = `work: ${occupation}`;

              // Update image source
              const imageElement = document.querySelector('.image img');
              imageElement.src = imageURL;
            



              const historyCollectionRef = collection(db, 'userRecords', historyID, 'history');
              // Check if the "history" subcollection exists
              const historyCollectionExists = await collectionExists(historyCollectionRef);
      
              if (historyCollectionExists) {
                const historyQuerySnapshot = await getDocs(historyCollectionRef);

                
                // Create an array to store history values
                const historyValues = [];

          // Display the data from the "history" subcollection for the specific user
                historyQuerySnapshot.forEach((historyDoc) => {
                  const hstatus = historyDoc.data().status;
                  const tstamp = historyDoc.data().timestamp;
                  const val = historyDoc.data().value;

                  if (hstatus === "pending") {
                    // Get the document reference
                    const docRef = historyDoc.ref;

                    // Push values to the array along with docRef
                    historyValues.push({ hstatus, tstamp, val, docRef });

                    console.log('History Data:', hstatus, 'timestamp: ', tstamp, ' doc: ', val);
                  }
                });

              
            // Display the values outside the loop
          
          if (historyValues.length > 0) {
            const lastHistory = historyValues[historyValues.length - 1];
            document.getElementById('request-status').textContent = `Request Status: ${lastHistory.hstatus}`;

            const docuRequestContainer = document.getElementById('doc-request');
            // Clear previous content
            docuRequestContainer.innerHTML = '';

            // Display all values that status is = pending
            historyValues.forEach((history) => {
              const reqVal = document.createElement('p');
              reqVal.textContent =  `docu-request : ${history.val}`;
              docuRequestContainer.appendChild(reqVal);
          });
            
          
          // Add event listener for the "yes" button
            const yesButton = document.getElementById('yes');
            yesButton.addEventListener('click', async () => {
              try {
                // Update the hstatus in Firestore for the latest pending document
                await updateDoc(lastHistory.docRef, { status: "ready for pickup" });
                console.log('History status updated to "ready for pickup"');
                hideModal();
                location.reload();
              } catch (error) {
                console.error('Error updating history status:', error);
                // Handle the error as needed
              }
            
            });


          }
        } 
        
        else {
                console.log('History subcollection does not exist for this user.');
              }
            } else {
              console.log('User document not found.');
            }
          } catch (error) {
            console.error('Error retrieving user data:', error);
            // Handle the error as needed
          }
        });

        iconsContainer.appendChild(infoIcon);
        // Append to the userContainer
        userContainer.appendChild(iconsContainer);
        // Append the user container to the user names container
        userNamesContainer.appendChild(userContainer);
          } 
    });
    } catch (error) {
      console.error('Error displaying user names:', error);
    }
  };

  // Call the function to display user names
  displayUserNames();

  

          //show modal when check icon is clicked
              function showModal() {
                document.getElementById('pop-up').style.display = 'block';   
            }

            // Function to hide the modal 
            function hideModal() {
                document.getElementById('pop-up').style.display = 'none';
            }

            //cancel button
            document.getElementById('cancel').addEventListener('click', () => {
              hideModal();
            });


     //info modal funtions
            function showinfoModal() {
              document.getElementById('info-modal').style.display = 'block';   
          }
          function hideinfoModal() {
              document.getElementById('info-modal').style.display = 'none';
          }

    //cancel button for info modal
          document.getElementById('exit').addEventListener('click', () => {
            hideinfoModal();
          });












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

