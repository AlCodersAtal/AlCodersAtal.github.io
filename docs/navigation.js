function toggleSidebar() {
  const sidebar = document.getElementById('sidebarNav');
  if (!sidebar) return;
  sidebar.classList.toggle('active');
  // Hide body scroll when sidebar is open
  if (sidebar.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
    // Add outside click listener
    setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideSidebarClick);
    }, 0);
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('mousedown', handleOutsideSidebarClick);
  }
}

// Close sidebar when a link is clicked (for better UX)
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebarNav');
  if (!sidebar) return;
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      sidebar.classList.remove('active');
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleOutsideSidebarClick);
    });
  });
});

// Handle click outside sidebar to close it
function handleOutsideSidebarClick(e) {
  const sidebar = document.getElementById('sidebarNav');
  const hamburger = document.querySelector('.hamburger');
  if (!sidebar) return;
  if (
    sidebar.classList.contains('active') &&
    !sidebar.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    sidebar.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('mousedown', handleOutsideSidebarClick);
  }
}

// Show the search pop-up
function showSearchPopup() {
  const popup = document.getElementById("searchPopup");
  if (popup) {
    popup.style.display = "flex";
  } else {
    alert("Search feature is under construction.");
  }
}

// Hide the search pop-up
function hideSearchPopup() {
  const popup = document.getElementById("searchPopup");
  if (popup) popup.style.display = "none";
}

// Show recommendations
function showRecommendations() {
  const searchInput = document.getElementById("searchBar").value.toLowerCase();
  const resultBox = document.getElementById("resultBox");
  const keywords = ["Home", "Home Page", "More Info", "About Us","Advance Coding Project", "Who are Alcoders", "Courses", "What is an Arduino", "What is Sensors", "Login Page", "How to Login In this Website" , "Settings","What is Coding ", "What is HTML","WebDevelopment Course" ];
  const filtered = keywords.filter((word) =>
    word.toLowerCase().includes(searchInput)
  );
  resultBox.innerHTML = filtered
    .map((word) => `<li onclick="redirectToPage('${word}')">${word}</li>`)
    .join("");
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
    "Advance Coding Project": "codingCourse2.html",
  };
  if (pages[keyword]) {
    window.location.href = pages[keyword];
  }
}

// Add event listener for Enter key press
document.addEventListener('DOMContentLoaded', function() {
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        const searchInput = searchBar.value.toLowerCase();
        const keywords = ["Home", "Home Page", "More Info", "About Us", "Who are Alcoders", "Courses","Advance Coding Project", "What is an Arduino", "What is Sensors", "Login Page", "How to Login In this Website", "Settings", "What is Coding ", "What is HTML", "WebDevelopment Course "];
        const filtered = keywords.filter((word) =>
          word.toLowerCase().includes(searchInput)
        );
        if (filtered.length > 0) {
          redirectToPage(filtered[0]);
        }
      }
    });
  }
});
