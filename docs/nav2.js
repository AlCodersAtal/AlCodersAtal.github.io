function redirectToPage() {
    // Get the value of the input field
    var input = document.getElementById("input-box").value.toLowerCase();

    // Define a mapping of keywords to URLs
    var pageRedirects = {
      "home": "index.html",
      "who are alcoders": "about us.html",
      "contact": "contact.html",
      "projects": "projects.html",
    };

    // Check if the input keyword exists in the mapping
    if (input in pageRedirects) {
      window.location.href = pageRedirects[input];
    } else {
      alert("Page not found. Try a different keyword.");
    }
  }

  // Event listener for the Enter key
  function checkEnter(event) {
    if (event.key === "Enter") {
      redirectToPage();
    }
  }