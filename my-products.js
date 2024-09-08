import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

function openDeleteModal() {
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));

  // Set up confirmation action
  document.getElementById("confirmDeleteButton").onclick = function () {
    deleteProduct(productId);
  };

  deleteModal.show();
}

// Function to fetch and display user's products
async function fetchAndDisplayUserProducts(userId) {
  const myProductsContainer = document.getElementById('myProductsContainer');


  try {
    // Query to fetch products where the 'userId' field matches the logged-in user's ID
    const productsQuery = query(collection(db, "products"), where("userId", "==", userId));
    const querySnapshot = await getDocs(productsQuery);

    // Loop through each product and display it
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productId = doc.id; // Get the product document ID

      // Create a product card
      const productCard = `
        <div class="col-md-3 col-sm-6 mb-4">
          <div class="card" style="width: 18rem;">
            <img src="${product.imageUrl}" id="product-photo" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p><strong>Location:</strong> ${product.location}</p>
              <p><strong>Price:</strong> $${product.price}</p>
              <a href="#" class="btn btn-primary" onclick="manageProduct('${productId}')">Manage</a>
              <a href="#" class="btn btn-danger" onclick="openDeleteModal()">Delete</a>
            </div>
          </div>
        </div>`;

      // Append the product card to the container
      myProductsContainer.innerHTML += productCard;
    });

  } catch (error) {
    console.error("Error fetching user's products: ", error);
  }
}

// Function to delete a product
async function deleteProduct(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    alert("Product deleted successfully");
    location.reload(); // Reload the page to update the product list
  } catch (error) {
    console.error("Error deleting product: ", error);
    alert("Failed to delete product");
  }
}

// Placeholder for managing a product
function manageProduct(productId) {
  // Redirect to a manage product page or open a modal for editing product details
  window.location.href = `/manage-product.html?productId=${productId}`;
}

// Monitor the authentication state and fetch products of the logged-in user
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If user is logged in, fetch and display their products
    fetchAndDisplayUserProducts(user.uid);
  } else {
    // If no user is logged in, redirect to login page
    window.location.href = "/login.html";
  }
});





