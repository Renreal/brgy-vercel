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
                    addDoc,
                    doc,
                    getDocs,
                    query,where, runTransaction 
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

                

                    const checkAuthState = async () => {
                        onAuthStateChanged(auth, async (user) => {
                            if (user) {
                                console.log("Current user is", user);
                    
                                // Assuming you have a Firestore collection named 'userRecords'
                                const usersCollection = collection(db, 'userRecords');
                    
                                // Query the collection based on the user's email
                                const querySnapshot = await getDocs(query(usersCollection, where('email', '==', user.email)));
                    
                                // Check if there's a matching user
                                if (querySnapshot.size > 0) {
                                    // Update the input fields with the data of the matching user
                                    querySnapshot.forEach((doc) => {
                                        const userData = doc.data();
                    
                                        // Update input fields
                                        document.getElementById('firstName').value = userData.name || '';
                                        document.getElementById('lastName').value = userData.lastname || '';
                                        document.getElementById('middleName').value = userData.middlename || '';
                                        document.getElementById('Age').value = userData.age || '';
                                        document.getElementById('Gender').value = userData.gender || '';
                                        document.getElementById('bday').value = userData.birthday || '';
                                        document.getElementById('bplace').value = userData.birth_place || '';
                                        document.getElementById('Address').value = userData.address || '';
                                        document.getElementById('Nationality').value = userData.Nationality || '';
                                        document.getElementById('status').value = userData.status || '';
                                        document.getElementById('work').value = userData.work || '';
                                        document.getElementById('contact').value = userData.contactNum || '';
                                        const profileImage = document.getElementById('confirmationModal');
                                        profileImage.querySelector('img').src = userData.imageURL;
                                    });
                                } else {
                                    console.log("No matching user found in Firestore");
                                }
                            } else {
                                window.location.href = 'index.html';
                                console.log("User logged out");
                            }
                        });
                    };
                    
                    

                
        
                checkAuthState();
                
                
                      
                            


        // Function to show the modal and overlay
                    function showModal() {
                        document.getElementById('confirmationModal').style.display = 'block';
                        document.getElementById('overlay').style.display = 'block';
                    }

                    // Function to hide the modal and overlay
                    function hideModal() {
                        document.getElementById('confirmationModal').style.display = 'none';
                        document.getElementById('overlay').style.display = 'none';
                    }

                    document.getElementById('dashboardLink').addEventListener('click', showModal);        
                    document.getElementById('noButton').addEventListener('click', hideModal);        
                    

                    
           
          
          
          
          
            function updateOrder() {
                // Get the selected option from the dropdown
                var selectedOption = document.getElementById("selectOption");
                var selectedValue = selectedOption.options[selectedOption.selectedIndex].value;
            
                // Update the content of the <p> element with the ID "Order"
                document.getElementById("Order").textContent = "Selected Order: " + selectedValue;
            }
            window.updateOrder = updateOrder;

          let increment = 1;
          
          
          document.getElementById('yesButton').addEventListener('click', async () => {
            try {
                // Get the selected option value
                const selectedOption = document.getElementById("selectOption");
                const selectedValue = selectedOption.options[selectedOption.selectedIndex].value;
        
                // Get the currently logged-in user
                const user = auth.currentUser;
        
                if (user) {
                    // Store the selected value in Firestore subcollection
                    const userId = user.uid;
        
                    // Reference to the parent document
                    const parentDocRef = doc(db, 'userRecords', userId);
                    const countersDocRef = doc(db, 'counters', 'wpLtpQGyMnP3tbiliXB0');
        
                    // Use a transaction to ensure atomicity
                    await runTransaction(db, async (transaction) => {
                        const countersDocSnapshot = await transaction.get(countersDocRef);
                        const orderNumber = countersDocSnapshot.data().OrderNumber;
        
                        // Update the OrderNumber in the counters collection
                        transaction.update(countersDocRef, { OrderNumber: orderNumber + 1 });
        
                        // Reference to the subcollection
                        const subcollectionRef = collection(parentDocRef, 'history');
        
                        // Add a document to the subcollection with the updated OrderNumber value
                        await addDoc(subcollectionRef, {
                            value: selectedValue,
                            timestamp: new Date(),
                            status: 'pending',
                            orderNumber: orderNumber + 1, // Include the updated OrderNumber in your subcollection document
                        });
                    });
        
                    // Display a success message
                    console.log(`Selected value "${selectedValue}" has been stored in Firestore`);
                    alert(`Your document "${selectedValue}" is ordered. Check the dashboard for status`);
                } else {
                    // User is not logged in, handle accordingly
                    alert('Please log in to place your order.');
                }
            } catch (error) {
                // Handle any errors
                console.error(error);
                alert('Error storing selected value in Firestore.');
            }
        
            // Hide the modal
            hideModal();
        });
        

            



           
    