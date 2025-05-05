document.addEventListener("DOMContentLoaded", function () {
  const sidebarMenu = document.getElementById("sidebarMenu");
  const logoutButton = document.querySelector(".logout-btn");

  // Retrieve the user object from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  console.log("User data:", user.isAdmin);
  //  this give true
  console.log("Token data:", token);

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
  const path = isAdmin === 'true' ? "/dashboard/admin" : "/dashboard/user";
  const label = isAdmin === 'true' ? "Admin" : "User";

  menuItem.innerHTML = `<a href="${path}" class="link ${
    window.location.pathname === path ? "active" : ""
  }">${label}</a>`;
  sidebarMenu.appendChild(menuItem);

  // Validate token (optional)
  if (!token) {
    console.error("Authentication token not found.");
  }
});


