document.addEventListener("DOMContentLoaded", function () {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
  };

  // Get form element
  const createJobForm = document.getElementById("create-job-form");

  if (createJobForm) {
    console.log("Found form, adding event listener");

    createJobForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("Form submitted");

      // Get submit button
      const submitButton = createJobForm.querySelector("button[type='submit']");
      submitButton.disabled = true;
      submitButton.innerText = "Processing...";

      // Get form inputs
      const location = document.getElementById("location")?.value.trim();
      const title = document.getElementById("title")?.value.trim();
      const company = document.getElementById("company")?.value.trim();
      const description = document.getElementById("description")?.value.trim();

      console.log("Job data:", { title, company, location, description });

      // Validation
      if (!title || !company || !location || !description) {
        toastr.error("All fields are required.");
        submitButton.disabled = false;
        submitButton.innerText = "Create Job";
        return;
      }

      // Create job data object
      const jobData = { title, company, location, description };

      try {
        await createJob(jobData);
        createJobForm.reset(); // Reset form on success
      } catch (error) {
        console.error("Error:", error);
      }

      submitButton.disabled = false;
      submitButton.innerText = "Create Job";
    });
  } else {
    console.error("Form element not found!");
  }

  // Function to create a job
  async function createJob(jobData) {
    const BASE_URL = "http://localhost:3000";

    try {
      console.log("Creating job with data:", jobData);

      // Get token from local storage
      const token = localStorage.getItem("token");
      if (!token) {
        toastr.error("Authentication token not found");
        return;
      }

      // Make API request
      const response = await fetch(`${BASE_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          company,
          location,
          description,
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        toastr.success(data.message || "Job created successfully");

        // Close the modal
        const modal = document.getElementById("modal-create-job");
        if (modal) modal.classList.add("hidden");

        // Reload the page or update the table
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(data.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toastr.error("An error occurred. Please try again.");
    }
  }

  // Add event listeners for closing the modal
  document
    .querySelectorAll(".modal-close, .modal-close-btn")
    .forEach((button) => {
      button.addEventListener("click", function () {
        const modal = document.getElementById("modal-create-job");
        if (modal) modal.classList.add("hidden");
      });
    });
});
