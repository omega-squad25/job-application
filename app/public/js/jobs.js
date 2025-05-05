// jobs.js - Combined file for job listings and application functionality
document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = "http://localhost:3000";
  // === JOB LISTING FUNCTIONALITY ===
  const jobsContainer = document.querySelector(".card-container");
  const jobTitleEl = document.querySelector(".job-title");
  const jobLocationEl = document.querySelector(".job-location");
  const companyNameEl = document.querySelector(".company-name");
  const jobDescriptionEl = document.querySelector(".job-description");
  const easyApplyBtn = document.querySelector(".easy-apply");

  // Current job ID to be used when submitting the application
  let currentJobId = null;

  // Flag to track if a submission is in progress
  let isSubmitting = false;

  // Function to calculate "time ago" in days
  function getTimeAgo(createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d ago` : "Today";
  }

  // Function to create a job card dynamically
  function createJobCard(job) {
    const jobCard = document.createElement("div");
    jobCard.classList.add("card");
    // Store job ID as a data attribute
    jobCard.dataset.jobId = job.id;

    jobCard.innerHTML = `
      <div class="card-item">
        <div class="card-header">
          <div class="company-details">
            <img src="${
              job.companyLogo || "/assets/images/asma-logo.svg"
            }" alt="Company Logo">
            <p class="job-location">${job.company}</p>
          </div>
          <div class="bookmark-icon">
            <i class="fa-regular fa-bookmark"></i>
          </div>
        </div>
        <h2 class="job-title">${job.title}</h2>
        <div class="job-details">
          <p class="job-location">${job.location}</p>
          <p class="job-type">Full time</p>
        </div>
        <div class="btn-wrapper">
          <div class="btns">
            <button class="apply-btn" data-job-id="${
              job.id
            }">View Details</button>
          </div>
          <p>${getTimeAgo(job.createdAt)}</p>
        </div>
      </div>
    `;

    // Click event to update job details section
    jobCard.querySelector(".apply-btn").addEventListener("click", () => {
      updateJobDetails(job);
    });

    return jobCard;
  }

  // Function to update the job details section
  function updateJobDetails(job) {
    jobTitleEl.textContent = job.title;
    jobLocationEl.textContent = job.location;
    companyNameEl.textContent = job.company;
    jobDescriptionEl.textContent = job.description;

    // Store the current job ID for application
    currentJobId = job.id;
    console.log("Set current job ID to:", currentJobId);

    // Update the Easy Apply button with the current job ID
    if (easyApplyBtn) {
      easyApplyBtn.dataset.jobId = job.id;
    }
  }

  // Load jobs from API
  try {
    const response = await fetch(`${BASE_URL}/api/jobs`);
    const result = await response.json();

    if (result.message === "Jobs retrieved successfully") {
      const jobs = result.data.jobs;
      jobsContainer.innerHTML = "";

      // Populate the job cards
      jobs.forEach((job, index) => {
        const jobCard = createJobCard(job);
        jobsContainer.appendChild(jobCard);

        // Automatically display the details of the first job
        if (index === 0) {
          updateJobDetails(job);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }

  // === JOB APPLICATION FUNCTIONALITY ===
  const modalApply = document.getElementById("modal-apply");
  const applyForm = document.querySelector("#application-form");
  const modalCloseBtn = document.querySelector(".modal-close-btn");
  const modalClose = document.querySelector(".modal-close");

  // Setup Easy Apply button to open modal
  if (easyApplyBtn) {
    // Remove any existing event listeners first
    const newEasyApplyBtn = easyApplyBtn.cloneNode(true);
    easyApplyBtn.parentNode.replaceChild(newEasyApplyBtn, easyApplyBtn);

    // Add event listener to the new button
    newEasyApplyBtn.addEventListener("click", function () {
      // Using the currentJobId that was set in updateJobDetails
      if (!currentJobId) {
        toastr.error("Please select a job first.");
        return;
      }

      // Open the modal
      modalApply.classList.remove("hidden");

      // Reset form
      if (applyForm) applyForm.reset();

      console.log("Opening modal for job ID:", currentJobId);
    });
  }

  // Close modal functionality
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      modalApply.classList.add("hidden");
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", function () {
      modalApply.classList.add("hidden");
    });
  }

  // Configure form submission - only add event listener once
  const modalSaveBtn = document.querySelector(".modal-save-btn");
  if (modalSaveBtn && applyForm) {
    // Remove existing event listeners by cloning and replacing the button
    const newModalSaveBtn = modalSaveBtn.cloneNode(true);
    modalSaveBtn.parentNode.replaceChild(newModalSaveBtn, modalSaveBtn);

    // Add a single event listener to the new button
    newModalSaveBtn.addEventListener("click", async function (event) {
      // Prevent any default form submission
      event.preventDefault();

      // Prevent duplicate submissions
      if (isSubmitting) {
        console.log("Submission already in progress, ignoring click");
        return;
      }

      console.log("Starting submission for job ID:", currentJobId);

      // Basic validation
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const resume = document.getElementById("resume").files[0];
      const additionalFile = document.getElementById("additionalFile").files[0];
      const isAgreeToPrivacyPolicy = document.getElementById(
        "isAgreeToPrivacyPolicy"
      ).checked;

      // Validate required fields
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !resume ||
        !isAgreeToPrivacyPolicy
      ) {
        toastr.error(
          "Please fill in all required fields and agree to the privacy policy."
        );
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toastr.error("Please enter a valid email address.");
        return;
      }

      // Store job ID in a local variable to prevent it from changing during submission
      const jobIdToSubmit = currentJobId;

      if (!jobIdToSubmit) {
        toastr.error("Job ID is missing. Please try again.");
        return;
      }

      console.log("Submitting application for job ID:", jobIdToSubmit);

      // Create form data for submission
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("resume", resume);
      formData.append("isAgreeToPrivacyPolicy", isAgreeToPrivacyPolicy);

      // Add additional file if provided
      if (additionalFile) {
        formData.append("additionalFile", additionalFile);
      }

      try {
        // Set submission flag and disable button
        isSubmitting = true;
        newModalSaveBtn.disabled = true;
        newModalSaveBtn.textContent = "Submitting...";

        // Get auth token from localStorage
        const token = localStorage.getItem("token");
        // Try to parse the token properly - it could be stored as JSON or plain string
        let parsedToken;

        try {
          // First try to parse as JSON
          parsedToken = JSON.parse(token);
        } catch (e) {
          // If that fails, try to remove quotes if they exist
          parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;
        }

        if (!parsedToken) {
          toastr.error("You need to be logged in to apply for jobs.");
          isSubmitting = false;
          newModalSaveBtn.disabled = false;
          newModalSaveBtn.textContent = "Submit Application";
          return;
        }

        // Submit application - using the local jobIdToSubmit variable
        const response = await fetch(
          `${BASE_URL}/api/applications/submit/${jobIdToSubmit}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${parsedToken}`,
            },
            body: formData,
          }
        );

        const result = await response.json();

        // Re-enable the button
        isSubmitting = false;
        newModalSaveBtn.disabled = false;
        newModalSaveBtn.textContent = "Submit Application";

        if (response.ok) {
          // Success handling
          toastr.success("Application submitted successfully!");
          modalApply.classList.add("hidden");
          applyForm.reset();
        } else {
          // Error handling
          toastr.error(
            result.message || "Failed to submit application. Please try again."
          );
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        toastr.error("An error occurred. Please try again later.");

        // Re-enable the button in case of error
        isSubmitting = false;
        newModalSaveBtn.disabled = false;
        newModalSaveBtn.textContent = "Submit Application";
      }
    });
  }
});
