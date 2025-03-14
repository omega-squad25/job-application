document.addEventListener("DOMContentLoaded", function () {
  const modalOverlays = document.querySelectorAll(".modal-overlay");
  const modalCloseElements = document.querySelectorAll(
    ".modal-close, .modal-close-btn"
  );
  const modalTriggers = document.querySelectorAll(".modal-trigger");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const targetModal = document.querySelector(this.dataset.target);
      targetModal.classList.remove("hidden");
    });
  });

  modalCloseElements.forEach((element) => {
    element.addEventListener("click", function () {
      this.closest(".modal-overlay").classList.add("hidden");
    });
  });
});
