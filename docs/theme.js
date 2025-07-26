// themeLoader.js
(function () {
  // ⏩ STEP 1: Instant load from localStorage
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark-theme", savedTheme === "dark");
  document.body.classList.toggle("light-theme", savedTheme === "light");

  // ⏳ STEP 2: Load Firebase and sync real theme
  import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js").then(({ initializeApp }) => {
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js").then(({ getAuth, onAuthStateChanged }) => {
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js").then(({ getFirestore, doc, getDoc }) => {

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
              const theme = docSnap.data().theme || "light";
              localStorage.setItem("theme", theme);

              // 🔁 Only re-apply theme if different
              if (theme !== savedTheme) {
                document.body.classList.toggle("dark-theme", theme === "dark");
                document.body.classList.toggle("light-theme", theme === "light");
              }
            } else {
              console.warn("User document not found in Firestore.");
            }
          } else {
            console.warn("No user is signed in.");
          }
        });
      });
    });
  });
})();
