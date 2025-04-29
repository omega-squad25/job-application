document.addEventListener("DOMContentLoaded", function () {
  const tabItems = document.querySelectorAll(".job-tab-item");
  const authLinks = document.querySelectorAll(".auth-links");

  tabItems.forEach((item) => {
    item.addEventListener("click", function () {
      const target = this.getAttribute("data-job-tab");

      // Remove active class from all tab items and panes
      tabItems.forEach((i) => i.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Add active class to the clicked tab item and corresponding pane
      this.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
});
