document.addEventListener("DOMContentLoaded", function () {
  // Function to update UI based on authentication status
  function updateNavbarUI() {
    // Check if token exists in localStorage
    const tokenString = localStorage.getItem("token");

    // Get auth section elements
    const authLinks = document.querySelector(".auth-links");
    const userProfile = document.querySelector(".user-profile");

    // Toggle visibility based on token presence
    if (tokenString) {
      try {
        // Try to parse the token (since it's stored as JSON string)
        const token = JSON.parse(tokenString);
        console.log("User is logged in");

        // If token exists, hide auth links and show user profile section
        if (authLinks) authLinks.classList.add("hidden");
        if (userProfile) userProfile.classList.remove("hidden");
      } catch (e) {
        console.error("Error parsing token:", e);
        // If token is invalid JSON, treat as not logged in
        if (authLinks) authLinks.classList.remove("hidden");
        if (userProfile) userProfile.classList.add("hidden");
      }
    } else {
      console.log("No auth token found, user not logged in");

      // If no token, show auth links and hide user profile section
      if (authLinks) authLinks.classList.remove("hidden");
      if (userProfile) userProfile.classList.add("hidden");
    }
  }

  // Call the function on page load
  updateNavbarUI();

  // Add logout functionality
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // Clear token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("User logged out, token removed");
      // Update UI immediately
      updateNavbarUI();
      // Redirect to home page or login page
      window.location.href = "/";
    });
  }
});
