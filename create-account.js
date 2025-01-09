import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAlth1sxiP-S3r3fVDXhwadVVnEvpdO6s",
  authDomain: "login-egi-agan.firebaseapp.com",
  databaseURL: "https://login-egi-agan-default-rtdb.firebaseio.com",
  projectId: "login-egi-agan",
  storageBucket: "login-egi-agan.firebasestorage.app",
  messagingSenderId: "395059466114",
  appId: "1:395059466114:web:5c6b0621e9739df6b5c99b"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

auth.useDeviceLanguage();

// Grab register button
const spinner = document.getElementById("spinner");
const spinnerG = document.getElementById("spinner-g");

const register = document.getElementById("register");
register.addEventListener("click", function (event) {
    spinner.style.display = "inline-block";
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("username").value;
    const location = document.getElementById("location").value;
    const role = document.getElementById("role").value;
    const phone = document.getElementById("phone").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Send verification email
            sendEmailVerification(user)
                .then(() => {
                    // Save user data to Firestore
                    setDoc(doc(db, "users", user.uid), {
                        fullName: fullName,
                        email: user.email,
                        uid: user.uid,
                        location: location,
                        role: role,
                        phone: phone
                    })
                    .then(() => {
                        alert("Account created. Please verify your email before logging in.");
                        window.location.href = "login.html";
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                        alert("Error saving user data");
                        spinner.style.display = "none";
                    });
                })
                .catch((error) => {
                    console.error("Error sending email verification: ", error);
                    alert("Error sending verification email");
                    spinner.style.display = "none";
                });
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
            spinner.style.display = "none";
        });
});

// Google Sign-in button
const google = document.getElementById("google");
google.addEventListener("click", function registerWithGoogle() {
    spinnerG.style.display = "inline-block";
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            // Save user data to Firestore
            setDoc(doc(db, "users", user.uid), {
                fullName: user.displayName || 'Not provided',
                email: user.email,
                uid: user.uid,
                location: 'Not provided',
                role: 'Not provided',
                phone: 'Not provided'
            })
            .then(() => {
                window.location.href = "/p/index.html";
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
                alert("Error saving user data");
                spinnerG.style.display = "none";
            });
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
            spinnerG.style.display = "none";
        });
});
