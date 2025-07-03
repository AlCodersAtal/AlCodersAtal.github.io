// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIMtf6DXnAxWKdkoLkfxn7b7zBoAr8Ouk",
  authDomain: "alcodersatal-database.firebaseapp.com",
  projectId: "alcodersatal-database",
  storageBucket: "alcodersatal-database.firebasestorage.app",
  messagingSenderId: "1092849520429",
  appId: "1:1092849520429:web:ecf950a9aa868e37760da4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.theme) {
        applyTheme(userData.theme);
      }
      if (userData.name) {
        localStorage.setItem("username", userData.name);
      }
    }
  }
});

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  }
}
