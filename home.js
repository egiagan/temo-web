import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged ,} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc,getDocs  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

import {  getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXM9aKhpYfQqOmlpB1N7yhca6B46PY4w4",
  authDomain: "temo-agriculture-c28d3.firebaseapp.com",
  projectId: "temo-agriculture-c28d3",
  storageBucket: "temo-agriculture-c28d3.appspot.com",
  messagingSenderId: "175597932867",
  appId: "1:175597932867:web:05506f5051c6eead711ff6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Elements for buyer and seller sections
const sellerSection = document.getElementById("seller-section");
const buyerSection = document.getElementById("buyer-section");

// Sign out logic
const signout = document.getElementById("signout");
signout.addEventListener("click", function () {
  signOut(auth).then(() => {
    console.log("User signed out.");
  }).catch((error) => {
    console.error("Error signing out: ", error);
  });
});

// Handle authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    console.log("User UID:", uid);

    try {
      // Get the user's document from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User document data:", userData);

        // Check if the user is a buyer or seller
        if (userData.role === "buyer") {
          // Hide seller section, show buyer section
          alert("im a buyer")
          sellerSection.classList.add("d-none");
          buyerSection.classList.remove("d-none");
        } else if (userData.role === "farmer") {

alert("im a seller")
          // Hide buyer section, show seller section
          buyerSection.classList.add("d-none");
          sellerSection.classList.remove("d-none");
        } else {
          console.error("Unknown role:", userData.role);
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }


//upload image










  } else {
    // User is signed out, redirect to login
    window.location.href = "index.html";
  }

  
  const addProduct = document.getElementById("createProduct");

  // Attach event listener to create product button
  addProduct.addEventListener("click", async function () {
    // Get product details from form
    const productName = document.getElementById("productName").value;
    const productDescription = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value;
    const productQuantity = document.getElementById("productQuantity").value;
    const productLocation = document.getElementById("productLocation").value;
    const productPhoto = document.getElementById("productPhoto").files[0]; // Get the uploaded file
  
    if (productPhoto) {
      try {
        // Check if user is authenticated
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const uid = user.uid; // Get the current user's UID
  
            // Upload the product image to Firebase Storage
            const storageRef = ref(storage, `productImages/${productPhoto.name}`);
            const snapshot = await uploadBytes(storageRef, productPhoto);
            console.log("Uploaded a blob or file!");
  
            // Get the download URL for the uploaded image
            const productPhotoUrl = await getDownloadURL(snapshot.ref);
            console.log("File available at", productPhotoUrl);
  
            // Create the product entry in Firestore with the user ID
            const productData = {
              name: productName,
              description: productDescription,
              price: price,
              quantity: productQuantity,
              location: productLocation,
              imageUrl: productPhotoUrl, // Add the image URL to Firestore
              userId: uid, // Attach the user ID to the product
              createdAt: new Date()
            };
  
            // Add the product to Firestore
            const docRef = await addDoc(collection(db, "products"), productData);
            console.log("Product added with ID: ", docRef.id);
  
            alert("Product uploaded successfully!");
          } else {
            alert("You must be logged in to upload a product.");
          }
        });
      } catch (error) {
        console.error("Error uploading product: ", error);
        alert("Failed to upload product.");
      }
    } else {
      alert("Please select a product photo to upload.");
    }
  });


  //fetch the product
  // Function to fetch and display products
async function fetchAndDisplayProducts() {
    const productsContainer = document.getElementById("our-products"); // Target the row container
  
    try {
      // Fetch all products from Firestore
      const querySnapshot = await getDocs(collection(db, "products"));
  
      // Loop through each document in the collection
      querySnapshot.forEach((doc) => {
        const product = doc.data();
  
        // Create a product card
        const productCard = `
          <div class="col-md-3 col-sm-6 mb-4">
            <div class="card" style="width: 18rem;">
              <img src="${product.imageUrl}" class="card-img-top" id="product-photo" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p><strong>Location:</strong> ${product.location}</p>
                <p><strong>Price:</strong> R${product.price}</p>
                <a href="#" class="btn btn-success">Buy</a>
              </div>
            </div>
          </div>`;
  
        // Append the product card to the products container
        productsContainer.innerHTML += productCard;
      });
  
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  }
  
  // Call the function to fetch and display products
  fetchAndDisplayProducts();
  

});

