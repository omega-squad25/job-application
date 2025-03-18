document.addEventListener("DOMContentLoaded", function () {
  const modalOverlays = document.querySelectorAll(".modal-overlay");
  const modalCloseElements = document.querySelectorAll(
    ".modal-close, .modal-close-btn"
  );
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  const viewIcons = document.querySelectorAll(".view-icon");
  const editIcons = document.querySelectorAll(".edit-icon");

  // Generic modal triggers
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const targetModal = document.querySelector(this.dataset.target);
      if (targetModal) {
        targetModal.classList.remove("hidden");
      }
    });
  });

  // View icon triggers
  viewIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const modal = document.getElementById("modal-view");
      if (modal) {
        modal.classList.remove("hidden");
      }
    });
  });

  // Edit icon triggers
  editIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const modal = document.getElementById("modal-edit");
      if (modal) {
        modal.classList.remove("hidden");
      }
    });
  });

  // Close modal elements
  modalCloseElements.forEach((element) => {
    element.addEventListener("click", function () {
      const modal = this.closest(".modal-overlay");
      if (modal) {
        modal.classList.add("hidden");
      }
    });
  });

  // Close modal when clicking outside the modal content
  modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", function (event) {
      if (event.target === this) {
        this.classList.add("hidden");
      }
    });
  });
});
