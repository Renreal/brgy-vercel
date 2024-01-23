
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
                    getFirestore, collection, addDoc, getDocs, query, where,
                    } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
                    import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";

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
                    const storage = getStorage(app);


                    const userEmailSignIn = document.querySelector("#userEmailSignIn"); 
                    const userEmailSignUp = document.querySelector("#userEmailSignUp"); 
                    const userPasswordSignIn = document.querySelector("#userPasswordSignIn");
                    const userPasswordSignUp = document.querySelector("#userPasswordSignUp");
                    const signUpButton = document.querySelector('#signUpButton');
                    const signInButton = document.querySelector('#signInButton');
                    const dashboard = document.querySelector('#dashboard');
                    




/* form transform */
                    document.getElementById('signup-link').addEventListener('click', function () {
                        document.querySelector('.form-container.register').style.display = 'contents';
                        document.querySelector('.form-container:not(.register)').style.display = 'none';
                    });
            
                    document.getElementById('login-link').addEventListener('click', function () {
                        document.querySelector('.form-container.register').style.display = 'none';
                        document.querySelector('.form-container:not(.register)').style.display = 'contents';
                    });
               

//////////user sign up========================================
                                     /* image placeholder */       
                        const fileInput = document.getElementById("fileInput");
                        const uploadedImage = document.getElementById("uploadedImage");

                        fileInput.addEventListener("change", (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                            uploadedImage.src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                        }
                        });

                        const uploadImageToStorage = async (file, userId) => {
                            // Create a reference to the Firebase Storage location
                            const storageRef = ref(storage, `userImages/${userId}/${file.name}`);
                          
                            // Upload the file to Firebase Storage
                            const snapshot = await uploadBytes(storageRef, file);
                          
                            // Get the download URL of the uploaded file
                            const downloadURL = await getDownloadURL(snapshot.ref);
                          
                            return downloadURL;
                          };
                         




                          
                          const userSignUp = async () => {
                            try {
                                const signUpEmail = userEmailSignUp.value;
                                const signUpPassword = userPasswordSignUp.value;
                                const firstName = document.querySelector("#firstname").value;
                                const lastName = document.querySelector("#lastname").value;
                                const midName = document.querySelector("#middleName").value;
                                const Age = document.querySelector("#Age").value;
                                const Gender = document.querySelector("#Gender").value;
                                const bday = document.querySelector("#birthday").value;
                                const birthPlace = document.querySelector("#birthPlace").value;
                                const address = document.querySelector("#Address").value;
                                const Nationality = document.querySelector("#nationality").value;
                                const status = document.querySelector("#status").value;
                                const Occupation = document.querySelector("#Occupation").value;
                                const contact = document.querySelector("#Phone").value;
                                
                                // Check if a file is selected
                                const fileInput = document.getElementById("fileInput");
                                const file = fileInput.files[0];
                                
                                if (!file) {
                                    alert("Please select an image file.");
                                    return;
                                }
                                
                                // Validate the birthday
                                const currentYear = new Date().getFullYear();
                                const selectedBirthday = new Date(bday);
                                const selectedYear = selectedBirthday.getFullYear();

                                if (selectedYear > currentYear) {
                                    alert("Invalid birthday. Double check the year of birth.");
                                    return;
                                }


                                // Create a user with email and password
                                const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
                        
                                const user = userCredential.user;
                                const userId = user.uid;
                        
                                // Store user data in Firestore
                                const imageURL = await uploadImageToStorage(file, userId);
                        
                                const userDocRef = await addDoc(collection(db, 'userRecords'), {
                                    email: signUpEmail,
                                    name: firstName,
                                    lastname: lastName,
                                    middlename: midName,
                                    age: Age,
                                    gender: Gender,
                                    birthday: bday,
                                    birth_place: birthPlace,
                                    address: address,
                                    Nationality: Nationality,
                                    status: status,
                                    work: Occupation,
                                    contactNum: contact,
                                    password: signUpPassword, 
                                    userId: userId,
                                    imageURL: imageURL,
                                });
                        
                                alert("Registered Successfully!");
                                location.replace("LandingPage.html");
                            } catch (error) {
                                // Handle the error
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                console.log(error);
                                if (errorCode === "auth/email-already-in-use") {
                                    alert("This email address is already in use. Please choose a different email address.");
                                } else {
                                    alert("Error: " + errorMessage);
                                    console.log(errorCode + errorMessage);
                                }
                            }
                        };
                        
                        
                        


//=======user sign IN=============//



                    const userSignIn = async () => {
                        const signInEmail = userEmailSignIn.value;
                        const signInPassword = userPasswordSignIn.value;
                    
                        try {
                        const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
                        const user = userCredential.user;
                    
                        // Check if the user is an admin
                        const isAdmin = await checkIfAdmin(user.email);
                    
                        alert("You have signed in successfully!");
                    
                        if (isAdmin) {
                            // Redirect to admin.html if the user is an admin

                            location.replace("admin.html");
                        } else {
                            // Redirect to LandingPage.html for regular users
                            location.replace("LandingPage.html");
                        }
                        } catch (error) {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode + errorMessage);
                    
                        if (errorCode === "auth/invalid-email") {
                            alert("Please enter a valid email");
                        } else if (errorCode === "auth/wrong-password") {
                            alert("You have entered a wrong password");
                        } else {
                            alert("Error: " + errorMessage);
                            console.log(errorCode + errorMessage);
                        }
                        }
                    };
                    
                    // Function to check if the user is an admin
                    const checkIfAdmin = async (email) => {
                        try {
                        const querySnapshot = await getDocs(query(collection(db, 'admins'), where('email', '==', email)));
                        return !querySnapshot.empty;
                        } catch (error) {
                        console.error("Error checking if admin:", error);
                        return false;
                        }
                    };
  
                       
            signUpButton.addEventListener('click', userSignUp);
            signInButton.addEventListener('click', userSignIn);
  









            