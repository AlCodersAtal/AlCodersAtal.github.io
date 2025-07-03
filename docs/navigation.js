function toggleSidebar() {
  const sidebar = document.getElementById("mobileSidebar");
  if (sidebar.style.display === "flex") {
    sidebar.style.display = "none";
  } else {
    sidebar.style.display = "flex";
  }
}



// Show the search pop-up
function showSearchPopup() {
    document.getElementById("searchPopup").style.display = "flex";
  }
  
  // Hide the search pop-up
  function hideSearchPopup() {
    document.getElementById("searchPopup").style.display = "none";
  }
  
  
  // Show recommendations
  function showRecommendations() {
    const searchInput = document.getElementById("searchBar").value.toLowerCase();
    const resultBox = document.getElementById("resultBox");
  
    // Sample recommendations (these could be dynamically fetched)
    const keywords = ["Home", "Home Page", "More Info", "About Us", "Who are Alcoders", "Courses", "What is an Arduino", "What is Sensors", "Login Page", "How to Login In this Website" , "Settings","What is Coding ", "What is HTML","WebDevelopment Course" ];
    const filtered = keywords.filter((word) =>
      word.toLowerCase().includes(searchInput)
    );
  
    // Render recommendations
    resultBox.innerHTML = filtered
      .map((word) => `<li onclick="redirectToPage('${word}')">${word}</li>`)
      .join("");

    // Show or hide the result box based on the filtered results
    if (filtered.length > 0) {
      resultBox.style.display = "block";
    } else {
      resultBox.style.display = "none";
    }
  }
  
  // Redirect to the selected page
  function redirectToPage(keyword) {
    const pages = {
      Home: "index.html",
      "More Info": "More info.html",
      "About Us": "about us.html",
      Courses: "Courses.html",
      Login: "loginpage.html",
      "Home Page": "index.html",
      "Who are Alcoders": "about us.html",
      "What is an Arduino": "arduinoCourse.html",
      "What is Sensors": "sensorCourse.html.html",
      "Login Page":"loginpage.html", 
      "How to Login In this Website": "loginpage.html",
      Settings: "menu.html",
      "WebDevelopment Course": "webDevCourse.html",
      "What is HTML ": "webDevCourse.html",
      "What is Coding ": "codingCourse.html",

    };
  
    if (pages[keyword]) {
      window.location.href = pages[keyword];
    }
  }

// Add event listener for Enter key press
document.getElementById("searchBar").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    const searchInput = document.getElementById("searchBar").value.toLowerCase();
    const keywords = ["Home", "Home Page", "More Info", "About Us", "Who are Alcoders", "Courses", "What is an Arduino", "What is Sensors", "Login Page", "How to Login In this Website", "Settings", "What is Coding ", "What is HTML", "WebDevelopment Course "];
    const filtered = keywords.filter((word) =>
      word.toLowerCase().includes(searchInput)
    );

    if (filtered.length > 0) {
      redirectToPage(filtered[0]);
    }
  }
});




























