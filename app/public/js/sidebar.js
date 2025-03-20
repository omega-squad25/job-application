document.addEventListener("DOMContentLoaded", function () {
  const sidebarMenu = document.getElementById("sidebarMenu");

  // Retrieve the user object from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Fallback: Redirect to login if user or isAdmin is missing
  if (!user || typeof user.isAdmin === "undefined") {
    console.warn("Missing user or isAdmin status. Redirecting to login...");
    window.location.href = "/login";
    return;
  }

  // Extract isAdmin from the user object
  const isAdmin = user.isAdmin;

  // Clear existing menu items (if any)
  sidebarMenu.innerHTML = "";

  // Add Admin menu if the user is an admin
  if (isAdmin) {
    const adminMenuItem = document.createElement("li");
    adminMenuItem.innerHTML = `<a href="/dashboard/admin" class="link ${
      window.location.pathname === "/dashboard/admin" ? "active" : ""
    }">Admin</a>`;
    sidebarMenu.appendChild(adminMenuItem);
  }

  // Add User menu if the user is not an admin
  if (!isAdmin) {
    const userMenuItem = document.createElement("li");
    userMenuItem.innerHTML = `<a href="/dashboard/user" class="link ${
      window.location.pathname === "/dashboard/user" ? "active" : ""
    }">User</a>`;
    sidebarMenu.appendChild(userMenuItem);
  }
});
