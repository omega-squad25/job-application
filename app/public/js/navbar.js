// Updated navbar.js file
document.addEventListener("DOMContentLoaded", function () {
  // Check if token exists in sessionStorage
  const token = sessionStorage.getItem("token");
  console.log("Token:", token);

  // Get auth section elements
  const authLinks = document.querySelector(".auth-links");
  const userProfile = document.querySelector(".user-profile");

  // Toggle visibility based on token presence
  if (token) {
    // If token exists, hide auth links and show user profile section
    if (authLinks) authLinks.classList.add("hidden");
    if (userProfile) userProfile.classList.remove("hidden");
  } else {
    // If no token, show auth links and hide user profile section
    if (authLinks) authLinks.classList.remove("hidden");
    if (userProfile) userProfile.classList.add("hidden");
  }

  // Add logout functionality
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // Clear token from sessionStorage
      sessionStorage.removeItem("token");
      // Redirect to home page or login page
      window.location.href = "/";
    });
  }
});
