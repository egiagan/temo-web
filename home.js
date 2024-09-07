import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {  getAuth, signOut,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXM9aKhpYfQqOmlpB1N7yhca6B46PY4w4",

  authDomain: "temo-agriculture-c28d3.firebaseapp.com",

  projectId: "temo-agriculture-c28d3",

  storageBucket: "temo-agriculture-c28d3.appspot.com",

  messagingSenderId: "175597932867",

  appId: "1:175597932867:web:05506f5051c6eead711ff6"


};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signout = document.getElementById("signout");
signout.addEventListener("click", function(){
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
})

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
      window.location.href = "index.html";
    }
  });