document.addEventListener("DOMContentLoaded", function () {
  const sidebarMenu = document.getElementById("sidebarMenu");
  const logoutButton = document.querySelector(".logout-btn");

  // Retrieve the user object from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fallback: Redirect to login if user or isAdmin is missing
  if (!user || typeof user.isAdmin === "undefined") {
    console.warn("Missing user or isAdmin status. Redirecting to login...");
    window.location.href = "/login";
    return;
  }

  // Extract isAdmin from the user object
  const isAdmin = user.isAdmin;

  // Clear existing menu items
  sidebarMenu.innerHTML = "";

  // Add relevant menu
  const menuItem = document.createElement("li");
  const path = isAdmin ? "/dashboard/admin" : "/dashboard/user";
  const label = isAdmin ? "Admin" : "User";

  menuItem.innerHTML = `<a href="${path}" class="link ${
    window.location.pathname === path ? "active" : ""
  }">${label}</a>`;
  sidebarMenu.appendChild(menuItem);

  // Validate token (optional)
  if (!token) {
    console.error("Authentication token not found.");
  }

  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      console.log("Logout button clicked");

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect
      window.location.href = "/";
    });
  } else {
    console.warn("Logout button not found.");
  }
});


