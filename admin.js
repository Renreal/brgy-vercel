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

  // Check if the "history" subcollection has any document with status equal to "pending" or "denied-request"
  return historyQuerySnapshot.docs.some((historyDoc) => {
      const status = historyDoc.data().status;
      return status === "pending";
  });
};

  

// Function to check if a collection exists
const collectionExists = async (collectionRef) => {
  const snapshot = await getDocs(collectionRef);
  return !snapshot.empty;
};

const displayUserNames = async () => {
  try {
      // Query the "userRecords" collection
      const userRecordsCollection = collection(db, 'userRecords');
      const querySnapshot = await getDocs(userRecordsCollection);

      // Get the table
      const table = document.getElementById('table1').getElementsByTagName('tbody')[0];

      // Clear previous content
      table.innerHTML = '';

      // Loop through the documents and display rows in the table
      querySnapshot.forEach(async (doc) => {
          const historyID = doc.data().userId;
          // Check if the "history" subcollection exists
          const historyCollectionRef = collection(db, 'userRecords', historyID, 'history');
          const hasPending = await hasPendingStatus(historyCollectionRef);
          if (hasPending) {
              const userData = doc.data();
              const userName = `${userData.name} ${userData.middlename} ${userData.lastname}`;

              // Fetch the data from the subcollection
              const historyQuerySnapshot = await getDocs(historyCollectionRef);

              // Loop through the subcollection documents and append 'value' fields with 'status' equal to 'pending'
              historyQuerySnapshot.forEach((historyDoc) => {
                  const status = historyDoc.data().status;

                  if (status === 'pending') {
                      const value = historyDoc.data().value;
                      const orderNum = historyDoc.data().orderNumber;
                      const reqDate = historyDoc.data().timestamp.toDate(); // Convert timestamp to Date object
                      const formattedReqDate = reqDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                      // Create a new row for each 'value'
                      const newRow = table.insertRow();

                      // Insert cells into the row
                      const orderNoCell = newRow.insertCell(0);
                      const nameCell = newRow.insertCell(1);
                      const typeCell = newRow.insertCell(2);
                      const dateRequestedCell = newRow.insertCell(3);
                      const setClaimDateCell = newRow.insertCell(4);
                      const setStatusCell = newRow.insertCell(5);

                      // Set the cell content
                      orderNoCell.textContent = orderNum; // Set the orderNumber in a separate row
                      nameCell.textContent = userName;
                      typeCell.textContent = value; // Set the 'value' in a separate row
                      dateRequestedCell.textContent = formattedReqDate; // Set the formatted date
                      // Set the formatted date

                      // Create a span for the check symbol
                      const checkSymbolSpan = document.createElement('span');
                      checkSymbolSpan.innerHTML = '&#9989;';


                      // Create an input element with type="date" for the setClaimDateCell
                      const setClaimDateInput = document.createElement('input');
                      setClaimDateInput.type = 'date';
                      setClaimDateInput.addEventListener('change', (event) => {
                          // Handle the selected date change if needed
                          console.log('Selected date:', event.target.value);
                      });
                      setClaimDateCell.appendChild(setClaimDateInput);

                                // Create a dropdown (select) element for setStatusCell
                  const setStatusSelect = document.createElement('select');
                  setStatusSelect.addEventListener('change', (event) => {
                      // Handle the selected status change if needed
                      console.log('Selected status:', event.target.value);
                        });
                  // Add options for each status
                  ['pending', 'ready for pickup', 'denied-request', 'released'].forEach((statusOption) => {
                    const option = document.createElement('option');
                    option.value = statusOption;
                    option.textContent = statusOption;
                    setStatusSelect.appendChild(option);
                  });
                  

                  checkSymbolSpan.addEventListener('click', async () => {
                    showModal();
                
                    const yesButton = document.getElementById('yes');
                    yesButton.addEventListener('click', async () => {
                        try {
                            const selectedStatus = setStatusSelect.value;
                            const selectedClaimDate = setClaimDateInput.value; // Get the selected date
                
                            // Update the 'status' and 'claimDate' fields in Firestore for the current subcollection document
                            await updateDoc(historyDoc.ref, { status: selectedStatus, claimDate: selectedClaimDate });
                            console.log('Status updated:', selectedStatus);
                
                            // Retrieve the latest data after updating the document
                            const updatedHistoryDoc = await getDoc(historyDoc.ref);
                
                            if (updatedHistoryDoc.exists()) {
                                const sts = updatedHistoryDoc.data().status;
                                const updatedOrderNum = updatedHistoryDoc.data().orderNumber;
                                const updatedClaimDate = updatedHistoryDoc.data().claimDate;
                
                                // Log the updated values
                                console.log('Updated value:', sts);
                                console.log('Updated orderNum:', updatedOrderNum);
                                console.log('Updated claimDate:', updatedClaimDate);
                
                                alert('Status updated:', selectedStatus);
                                hideModal();
                            } else {
                                console.log('Updated document not found.');
                            }
                        } catch (error) {
                            console.error('Error updating status:', error);
                            // Handle the error as needed
                        }
                        location.reload(); // Refresh the displayed data after updating
                    });
                });
                
                  
                  setStatusCell.appendChild(setStatusSelect);
                  setStatusCell.appendChild(checkSymbolSpan);
                            // Add an event listener to orderNoCell to capture the clicked orderNum
                           
                            orderNoCell.addEventListener('click', async () => {
                              try {
                                    const userDoc = await getDoc(doc.ref);

                                    if (userDoc.exists()) {
                                      const userData = userDoc.data();
                                      console.log('User Data:', userDoc.data());

                                      // Log the clicked orderNum and user data to the console
                                      console.log('Clicked orderNum:', orderNum);
                                      console.log('User Data:', userData);

                                      // Show the info modal with user data
                                      showinfoModal();

                                      // Populate the modal with user information
                                      document.getElementById('fullName').textContent = `${userData.name} ${userData.middlename} ${userData.lastname}`;
                                      document.getElementById('nationality').textContent =`${userData.Nationality}`;
                                      document.getElementById('address').textContent = ` ${userData.address}`;
                                      document.getElementById('userAge').textContent = `Age: ${userData.age}`;
                                      document.getElementById('bplace').textContent = `Birthplace: ${userData.birth_place}`;
                                      document.getElementById('bday').textContent = `Birthday: ${userData.birthday}`;
                                      document.getElementById('contact').textContent = `Contact Number: ${userData.contactNum}`;
                                      document.getElementById('Uemail').textContent = `Email: ${userData.email}`;
                                      document.getElementById('Ugender').textContent = `Gender: ${userData.gender}`;
                                      document.getElementById('status').textContent = `Status: ${userData.status}`;
                                      document.getElementById('occupation').textContent = `Work: ${userData.work}`;
                                  } else {
                                      console.log('User document not found.');
                                  }
                              } catch (error) {
                                  console.error('Error retrieving user data:', error);
                                  // Handle the error as needed
                              }
                            });

                  }
              });
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
              document.getElementById('info-modal').style.display = 'flex';   
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

