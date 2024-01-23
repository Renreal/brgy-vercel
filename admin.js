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

const dateInputs = [];

const hasPendingStatus = async (historyCollectionRef) => {
  const historyQuerySnapshot = await getDocs(historyCollectionRef);

  // Check if the "history" subcollection has any document with status equal to "pending" or "ready for pickup"
  // and also has an "orderNumber" field
  return historyQuerySnapshot.docs.some((historyDoc) => {
    const data = historyDoc.data();
    const status = data.status;
    const orderNumber = data.orderNumber;
    return orderNumber !== undefined;
  });
};


  

// Function to check if a collection exists
const collectionExists = async (collectionRef) => {
  const snapshot = await getDocs(collectionRef);
  return !snapshot.empty;
};
const rowStates = [];

// Define a variable to store the textarea element  
let declineReasonTextarea;
let currentHistoryDoc;

// Function to show the textarea
const showTextArea = () => {
    document.getElementById('pop-up2').style.display = 'flex';
    declineReasonTextarea = document.getElementById('declineReason');
};



document.getElementById('save').addEventListener('click', async () => {
  try {
    if (!currentHistoryDoc) {
      console.error('Error saving message: currentHistoryDoc is not defined');
      return;
  }
      // Get the value of the textarea
      const declineReason = declineReasonTextarea.value;

      // You can add additional validation or processing if needed

      // Update the document with the declineReason
      await updateDoc(currentHistoryDoc.ref, { status: 'denied-request', declineReason: declineReason });
      alert("document declined successfully");
      document.getElementById('pop-up2').style.display = 'none';
      location.reload();
  } catch (error) {
      console.error('Error saving message:', error);
  }
});



// Add a new function to handle filtering based on order number
const filterByOrderNumber = (orderNumber) => {
  const table = document.getElementById('table1').getElementsByTagName('tbody')[0];
  const rows = table.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const orderNoCell = rows[i].getElementsByTagName('td')[0];
    if (orderNoCell) {
      const orderNoText = orderNoCell.textContent || orderNoCell.innerText;
      // Hide or show rows based on the search input
      rows[i].style.display = orderNoText.includes(orderNumber) ? '' : 'none';
    }
  }
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

    // Add the search input element by its ID
    const searchInput = document.getElementById('orderNumberSearch');
    // Add an input event listener to the search input
    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.trim();
      filterByOrderNumber(searchTerm);
    });

    // Loop through the documents and display rows in the table
    querySnapshot.forEach(async (doc) => {
      const historyID = doc.data().userId;
      const historyCollectionRef = collection(db, 'userRecords', historyID, 'history');
      const hasPending = await hasPendingStatus(historyCollectionRef);

      if (hasPending) {
        const userData = doc.data();
        const userName = `${userData.name} ${userData.middlename} ${userData.lastname}`;

        const historyQuerySnapshot = await getDocs(historyCollectionRef);

        // Get all history documents and group them by value
        const groupedHistory = {};
        historyQuerySnapshot.forEach((historyDoc) => {
          const value = historyDoc.data().value;
          if (!groupedHistory[value]) {
            groupedHistory[value] = [];
          }
          groupedHistory[value].push(historyDoc);
        });

        // Iterate over each group and sort by timestamp in descending order
        for (const value in groupedHistory) {
          groupedHistory[value].sort((a, b) =>
            b.data().timestamp.toMillis() - a.data().timestamp.toMillis()
          );
        }

        // Iterate over each group and display the rows in the table
        for (const value in groupedHistory) {
          groupedHistory[value].forEach((historyDoc) => {
            const status = historyDoc.data().status;
            const order = historyDoc.data().orderNumber;

            if (order !== undefined) {
              const value = historyDoc.data().value;
              const orderNum = historyDoc.data().orderNumber;

              const reqDate = historyDoc.data().timestamp.toDate();
              const formattedReqDate = reqDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              const newRow = table.insertRow();
              const orderNoCell = newRow.insertCell(0);
              const nameCell = newRow.insertCell(1);
              const typeCell = newRow.insertCell(2);
              const dateRequestedCell = newRow.insertCell(3);
              const setClaimDateCell = newRow.insertCell(4);
              const setStatusCell = newRow.insertCell(5);

              orderNoCell.textContent = orderNum;
              nameCell.textContent = userName;
              typeCell.textContent = value;
              dateRequestedCell.textContent = formattedReqDate;

              const docStatus = historyDoc.data().status;
              setStatusCell.textContent = docStatus;
              setStatusCell.classList.add('status');

              const checkSymbolSpan = document.createElement('span');
              checkSymbolSpan.innerHTML = '&#9989;';

              const setClaimDateInput = document.createElement('input');
              setClaimDateInput.type = 'date';
              setClaimDateInput.id = 'setClaimDateInput';
              setClaimDateInput.addEventListener('change', (event) => {});

              dateInputs.push(setClaimDateInput);
              setClaimDateCell.appendChild(setClaimDateInput);

              const setStatusSelect = document.createElement('select');
              setStatusSelect.classList.add('drop-down');
              setStatusSelect.addEventListener('change', (event) => {
                console.log('Selected status:', event.target.value);
              });

              ['pending', 'ready for pickup', 'denied-request', 'released'].forEach(
                (statusOption) => {
                  const option = document.createElement('option');
                  option.value = statusOption;
                  option.textContent = statusOption;
                  setStatusSelect.appendChild(option);
                }
              );

              checkSymbolSpan.addEventListener('click', async () => {
                const index = dateInputs.indexOf(setClaimDateInput);
                const selectedStatus = rowStates[index].setStatusSelect.value;

                if (selectedStatus === 'denied-request') {
                  showTextArea();
                } else {
                  showModal(rowStates[index]);
                }
                currentHistoryDoc = historyDoc;

                const yesButton = document.getElementById('yes');
                yesButton.addEventListener('click', async () => {
                  try {
                    const selectedClaimDate = rowStates[index].setClaimDateInput.value;

                    if (selectedClaimDate) {
                      await updateDoc(historyDoc.ref, {
                        status: selectedStatus,
                        claimDate: selectedClaimDate,
                      });
                      console.log('Status updated:', selectedStatus);

                      const updatedHistoryDoc = await getDoc(historyDoc.ref);

                      if (updatedHistoryDoc.exists()) {
                        console.log('Updated value:', updatedHistoryDoc.data().status);
                        console.log('Updated orderNum:', updatedHistoryDoc.data().orderNumber);
                        console.log('Updated claimDate:', updatedHistoryDoc.data().claimDate);

                        alert('Status updated: ' + selectedStatus);
                        location.reload();
                      } else {
                        console.log('Updated document not found.');
                      }
                    } else {
                      alert('Please set a claim date before updating the status.');
                    }
                  } catch (error) {
                    console.error('Error updating status:', error);
                  } finally {
                    hideModal();
                  }
                });
              });

              setStatusCell.appendChild(setStatusSelect);
              setStatusCell.appendChild(checkSymbolSpan);

              orderNoCell.addEventListener('click', async () => {
                try {
                  const userDoc = await getDoc(doc.ref);

                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log('User Data:', userDoc.data());

                    console.log('Clicked orderNum:', orderNum);
                    console.log('User Data:', userData);

                    showinfoModal();

                    document.getElementById('fullName').textContent = `${userData.name} ${userData.middlename} ${userData.lastname}`;
                    document.getElementById('nationality').textContent = `${userData.Nationality}`;
                    document.getElementById('address').textContent = ` ${userData.address}`;
                    document.getElementById('userAge').textContent = ` ${userData.age}`;
                    document.getElementById('bplace').textContent = `${userData.birth_place}`;
                    document.getElementById('bday').textContent = `${userData.birthday}`;
                    document.getElementById('contact').textContent = ` ${userData.contactNum}`;
                    document.getElementById('Uemail').textContent = ` ${userData.email}`;
                    document.getElementById('Ugender').textContent = ` ${userData.gender}`;
                    document.getElementById('status').textContent = ` ${userData.status}`;
                    document.getElementById('occupation').textContent = ` ${userData.work}`;
                  } else {
                    console.log('User document not found.');
                  }
                } catch (error) {
                  console.error('Error retrieving user data:', error);
                }
              });

              // Store the state for this row
              const rowState = {
                setClaimDateInput: setClaimDateInput,
                setStatusSelect: setStatusSelect,
              };

              rowStates.push(rowState);
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('Error displaying user names:', error);
  }
};

// Call the function to display user names
displayUserNames();








  function showModal(rowState) {
    document.getElementById('pop-up').style.display = 'block';

    if (!rowState.setClaimDateInput.value) {
        document.getElementById('pop-up').style.backgroundColor = 'red';
        document.getElementById('info').textContent = 'You have not set a claim date';
    } else {
        document.getElementById('pop-up').style.backgroundColor = ''; // Reset to default color
        document.getElementById('info').textContent = 'This action will notify the user about their document status';
    }
}


              // Function to hide the modal 
              function hideModal() {
                document.getElementById('pop-up').style.display = 'none';
                document.getElementById('pop-up2').style.display = 'none';

              }

              //cancel button
              document.getElementById('cancel').addEventListener('click', () => {
              hideModal();
              });
               //cancel button
               document.getElementById('save').addEventListener('click', () => {
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

