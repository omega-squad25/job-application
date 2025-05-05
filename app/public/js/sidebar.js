document.addEventListener("DOMContentLoaded", function () {
  const sidebarMenu = document.getElementById("sidebarMenu");

  if (!sidebarMenu) {
    // Try to find the element by alternative means
    const sidebarMenus = document.querySelectorAll(".sidebar-menu");

    if (sidebarMenus.length > 0) {
      // Use the first one as fallback
      buildSidebarMenu(sidebarMenus[0]);
    } else {
      console.error("No sidebar menu elements found at all.");
    }
  } else {
    buildSidebarMenu(sidebarMenu);
  }

  function buildSidebarMenu(menuElement) {
    // Retrieve the user object from localStorage
    let user;
    try {
      const userString = localStorage.getItem("user");
      user = userString ? JSON.parse(userString) : null;
    } catch (e) {
      console.error("Error parsing user data:", e);
      user = null;
    }

    const token = localStorage.getItem("token");

    // Fallback: Redirect to login if user or token is missing
    if (!user || !token) {
      window.location.href = "/login";
      return;
    }

    // Extract isAdmin from the user object and convert to boolean if needed
    const isAdmin = user.isAdmin === true || user.isAdmin === "true";

    // Clear existing menu items
    menuElement.innerHTML = "";

    // Build menu based on admin status
    if (isAdmin) {
      // Admin only sees the admin option
      const adminItem = document.createElement("li");
      const adminPath = "/dashboard/admin";
      adminItem.innerHTML = `<a href="${adminPath}" class="link ${
        window.location.pathname === adminPath ? "active" : ""
      }">Admin Dashboard</a>`;
      menuElement.appendChild(adminItem);
    } else {
      // Regular users only see the user option
      const userItem = document.createElement("li");
      const userPath = "/dashboard/user";
      userItem.innerHTML = `<a href="${userPath}" class="link ${
        window.location.pathname === userPath ? "active" : ""
      }">User Dashboard</a>`;
      menuElement.appendChild(userItem);
    }
  }
});
