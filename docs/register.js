import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBIMtf6DXnAxWKdkoLkfxn7b7zBoAr8Ouk",
  authDomain: "alcodersatal-database.firebaseapp.com",
  projectId: "alcodersatal-database",
  storageBucket: "alcodersatal-database.firebasestorage.app",
  messagingSenderId: "1092849520429",
  appId: "1:1092849520429:web:ecf950a9aa868e37760da4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper popup functions (assumes these exist on your page)
function showPopup(message) {
  const overlay = document.getElementById("popupOverlay");
  const msgElem = document.getElementById("popupMessage");
  msgElem.textContent = message;
  overlay.style.display = "flex";
}

function closePopup() {
  const overlay = document.getElementById("popupOverlay");
  overlay.style.display = "none";
  // Optionally redirect or do something else here
}

// Register new user
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fName = document.getElementById("fName").value.trim();
  const lName = document.getElementById("lName").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store extra info in Firestore "users" collection, doc ID = user.uid
    await setDoc(doc(db, "users", user.uid), {
      firstName: fName,
      lastName: lName,
      username: username,
      email: email,
      theme: "light",   // default theme
      createdAt: new Date()
    });

    showPopup(`Welcome, ${username}! Registration successful.`);

    // After popup OK click, switch to login form
    document.getElementById("signup").style.display = "none";
    document.getElementById("signIn").style.display = "block";

  } catch (error) {
    showPopup("Registration failed: " + error.message);
  }
});

// Login existing user
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      // Store in localStorage for use on all pages
      localStorage.setItem("username", userData.username);
      localStorage.setItem("email", userData.email || user.email);

      showPopup(`Welcome back, ${userData.username}!`);

      // After popup OK, redirect to home
      document.getElementById("popupOverlay").querySelector("button").onclick = () => {
        closePopup();
        window.location.href = "index.html";
      };

    } else {
      showPopup("User profile not found!");
    }
  } catch (error) {
    showPopup("Login failed: " + error.message);
  }
});





















