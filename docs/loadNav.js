  document.addEventListener("DOMContentLoaded", function () {
    // Load the navigation bar
    fetch("nav.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("nav").innerHTML = data;
      });

    // Load the footer
    fetch("footer.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      });
  });