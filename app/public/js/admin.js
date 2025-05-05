document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://localhost:3000";

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

  // Initialize jobs table only once at page load
  fetchAndRenderJobs();

  // Initialize the create job form
  initCreateJobForm();

  // Initialize the edit job form
  initEditJobForm();

  function initCreateJobForm() {
    const createJobForm = document.getElementById("create-job-form");

    if (createJobForm) {
      // Remove any existing event listeners to prevent duplicates
      const clonedForm = createJobForm.cloneNode(true);
      createJobForm.parentNode.replaceChild(clonedForm, createJobForm);

      // Add event listener to the new cloned form
      clonedForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = clonedForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.innerText = "Processing...";

        const title = document.getElementById("title")?.value.trim();
        const company = document.getElementById("company")?.value.trim();
        const location = document.getElementById("gps")?.value.trim();
        const description = document
          .getElementById("description")
          ?.value.trim();

        if (!title || !company || !location || !description) {
          toastr.error("All fields are required.");
          submitButton.disabled = false;
          submitButton.innerText = "Save";
          return;
        }

        const jobData = { title, company, location, description };

        try {
          await createJob(jobData);
          clonedForm.reset();
        } catch (error) {
          console.error("Error:", error);
        }

        submitButton.disabled = false;
        submitButton.innerText = "Save";
      });
    }
  }

  function initEditJobForm() {
    const editJobForm = document.getElementById("edit-job-form");

    if (editJobForm) {
      // Remove any existing event listeners to prevent duplicates
      const clonedForm = editJobForm.cloneNode(true);
      editJobForm.parentNode.replaceChild(clonedForm, editJobForm);

      // Add event listener to the new cloned form
      clonedForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = clonedForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.innerText = "Processing...";

        const jobId = document.getElementById("edit-job-id")?.value;
        const title = document.getElementById("edit-title")?.value.trim();
        const company = document.getElementById("edit-company")?.value.trim();
        const location = document.getElementById("edit-gps")?.value.trim();
        const description = document
          .getElementById("edit-description")
          ?.value.trim();

        if (!jobId || !title || !company || !location || !description) {
          toastr.error("All fields are required.");
          submitButton.disabled = false;
          submitButton.innerText = "Update";
          return;
        }

        const jobData = { title, company, location, description };

        try {
          await updateJob(jobId, jobData);
          document.getElementById("modal-edit")?.classList.add("hidden");
        } catch (error) {
          console.error("Error:", error);
        }

        submitButton.disabled = false;
        submitButton.innerText = "Update";
      });
    }
  }

  async function fetchAndRenderJobs() {
    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/jobs/admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        renderJobs(data.data.jobs || []);
        renderStatistics(data.data.statistics || {});
      } else {
        toastr.error(data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toastr.error("Failed to connect to the server");
    }
  }

  function renderJobs(jobs) {
    const tableBody = document.querySelector(".table-container table tbody");
    if (!tableBody) return;

    // Clear the entire table first
    tableBody.innerHTML = "";

    if (jobs.length === 0) {
      const emptyRow = document.createElement("tr");
      const emptyCell = document.createElement("td");
      const colSpan = document.querySelectorAll(
        ".table-container table thead th"
      ).length;
      emptyCell.setAttribute("colspan", colSpan || 6);
      emptyCell.textContent = "No data available";
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
      return;
    }

    // Add jobs one by one
    jobs.forEach((job) => {
      addJobToTable(job);
    });

    // Add event listeners to icons
    addTableIconEventListeners();
  }

  function renderStatistics(statistics) {
    // Find elements with appropriate classes and update their content
    const totalJobsElement = document.querySelector(".total-jobs");
    if (totalJobsElement) {
      totalJobsElement.textContent = statistics.totalNumberOfJobs || 0;
    }

    const approvedJobsElement = document.querySelector(".approved-jobs");
    if (approvedJobsElement) {
      approvedJobsElement.textContent =
        statistics.totalNumberOfApprovedJobs || 0;
    }

    const pendingJobsElement = document.querySelector(".pending-jobs");
    if (pendingJobsElement) {
      pendingJobsElement.textContent = statistics.totalNumberOfPendingJobs || 0;
    }
  }

  function addJobToTable(job) {
    const tableBody = document.querySelector(".table-container table tbody");
    if (!tableBody) return;

    // Clear "No data available" row if it exists
    if (tableBody.querySelector("tr td[colspan]")) {
      tableBody.innerHTML = "";
    }

    // Don't check for duplicates since we already cleared the table in renderJobs
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${job.title || ""}</td>
      <td>${job.company || ""}</td>
      <td>${
        job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""
      }</td>
      <td>${job.location || ""}</td>
      <td><span class=${
        job.status === "pending" ? "status-text" : "approve-text"
      }>${job.status || "pending"}</span>
      </td>
      <td>
        <a class="action-icon view-icon" href="#" title="View" data-id="${
          job.id
        }">
          <i class="fa fa-eye"></i>
        </a>
        <a class="action-icon edit-icon" href="#" title="Edit" data-id="${
          job.id
        }">
          <i class="fa fa-edit"></i>
        </a>
        <a class="action-icon status-icon" href="#" title="Status" data-id="${
          job.id
        }">
          <i class="fa fa-circle-check"></i>
        </a>
         <a class="action-icon delete-icon" href="#" title="Delete" data-id="${
           job.id
         }">
          <i class="fa fa-trash"></i>
        </a>
      </td>
    `;

    tableBody.appendChild(newRow);
  }

  async function createJob(jobData) {
    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return null;
      }

      const response = await fetch(`${BASE_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (response.ok) {
        toastr.success(data.message || "Job created successfully");
        document.getElementById("modal-create-job")?.classList.add("hidden");

        // Fetch all jobs again to update the table (this will clear and rebuild the entire table)
        fetchAndRenderJobs();
        return data.data;
      } else {
        toastr.error(data.message || "Failed to create job");
        return null;
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toastr.error("An error occurred. Please try again.");
      return null;
    }
  }

  async function getJobDetails(jobId) {
    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return null;
      }

      // Use the direct endpoint to fetch the specific job
      const response = await fetch(`${BASE_URL}/api/jobs/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
      });

      if (!response.ok) {
        toastr.error(
          "Failed to fetch job details. The job may have been deleted."
        );
        console.error("Job fetch failed with status:", response.status);
        return null;
      }

      const data = await response.json();
      console.log("Job details response:", data);

      // Check if we have a nested data property (which appears to be the case in your API)
      if (data && data.data) {
        console.log("Found nested data object:", data.data);
        return data.data;
      }

      // Fallback to the entire response if no nested data
      return data;
    } catch (error) {
      console.error("Error fetching job details:", error);
      toastr.error("An error occurred while fetching job details");
      return null;
    }
  }

  async function updateJob(jobId, jobData) {
    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return null;
      }

      // Use the job-details endpoint for updating
      const response = await fetch(
        `${BASE_URL}/api/jobs/job-details/${jobId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedToken}`,
          },
          body: JSON.stringify(jobData),
        }
      );

      const data = await response.json().catch((e) => {
        console.warn("Failed to parse response as JSON:", e);
        return { message: "No response body or invalid JSON" };
      });

      if (response.ok) {
        toastr.success(data.message || "Job Updated successfully");

        // Fetch all jobs again to update the table
        fetchAndRenderJobs();
        return data.data || data;
      } else {
        toastr.error(data.message || "Failed to update job");
        return null;
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toastr.error("An error occurred while updating the job");
      return null;
    }
  }

  function addTableIconEventListeners() {
    // First remove all existing event listeners
    document
      .querySelectorAll(".view-icon, .edit-icon, .delete-icon, .status-icon")
      .forEach((icon) => {
        const newIcon = icon.cloneNode(true);
        icon.parentNode.replaceChild(newIcon, icon);
      });

    // Then add fresh event listeners
    document.querySelectorAll(".view-icon").forEach((icon) => {
      icon.addEventListener("click", function (event) {
        event.preventDefault();
        const jobId = this.getAttribute("data-id");
        openViewModal(jobId);
      });
    });

    document.querySelectorAll(".edit-icon").forEach((icon) => {
      icon.addEventListener("click", function (event) {
        event.preventDefault();
        const jobId = this.getAttribute("data-id");
        openEditModal(jobId);
      });
    });

    document.querySelectorAll(".status-icon").forEach((icon) => {
      icon.addEventListener("click", function (event) {
        event.preventDefault();
        const jobId = this.getAttribute("data-id");
        openStatusModal(jobId);
      });
    });
    document.querySelectorAll(".delete-icon").forEach((icon) => {
      icon.addEventListener("click", function (event) {
        event.preventDefault();
        const jobId = this.getAttribute("data-id");
        openDeleteModal(jobId);
      });
    });
  }

  async function openViewModal(jobId) {
    console.log("View job:", jobId);
    const modal = document.getElementById("modal-view");

    if (modal) {
      // Show loading state
      modal.classList.remove("hidden");
      const jobContents = document.getElementById("job-details");

      // Set a loading message
      if (jobContents) {
        jobContents.innerHTML =
          '<div class="loading-message">Loading job details...</div>';
      }

      try {
        // Fetch job details using the getJobDetails function
        const jobDetails = await getJobDetails(jobId);

        if (jobDetails) {
          console.log("Retrieved job details:", jobDetails);

          // Define the escapeHtml function
          const escapeHtml = (str) => {
            if (!str) return "";
            return String(str)
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
          };

          // Extract job details with default empty strings if properties don't exist
          const title = jobDetails.title || "";
          const description = jobDetails.description || "";
          const location =
            jobDetails.location || jobDetails.gps || jobDetails.address || "";
          const company = jobDetails.company || "";
          const createdAt = jobDetails.createdAt
            ? new Date(jobDetails.createdAt).toLocaleDateString()
            : "Unknown";
          const status = jobDetails.status || "Approved";

          // Populate the modal with job details
          jobContents.innerHTML = `
            <h3>${escapeHtml(title)}</h3>
            <p><strong>Company name: </strong> ${escapeHtml(company)}</p>
            <p><strong>Location: </strong> ${escapeHtml(location)}</p>
            <p><strong>Date Posted: </strong> ${escapeHtml(createdAt)}</p>
            <p><strong>Status: </strong> ${escapeHtml(status)}</p>
            <div class="description-container">
              <p><strong>Description:</strong></p>
              <p>${escapeHtml(description)}</p>
            </div>
            <div class="modal-footer">
              <button class="modal-close-btn">Close</button>
            </div>
          `;

          // Add event listener to the close button
          const closeBtn = jobContents.querySelector(".modal-close-btn");
          if (closeBtn) {
            closeBtn.addEventListener("click", function () {
              modal.classList.add("hidden");
            });
          }
        } else {
          // No job details found, show error
          jobContents.innerHTML = `
            <div class="error-message">
              <p>Could not load job details. The job may have been deleted.</p>
            </div>
            <div class="modal-footer">
              <button class="modal-close-btn">Close</button>
            </div>
          `;

          // Add event listener to the close button
          const closeBtn = jobContents.querySelector(".modal-close-btn");
          if (closeBtn) {
            closeBtn.addEventListener("click", function () {
              modal.classList.add("hidden");
            });
          }
        }
      } catch (error) {
        console.error("Error in openViewModal:", error);

        // Show error message in modal
        if (jobContents) {
          jobContents.innerHTML = `
            <div class="error-message">
              <p>An error occurred while fetching job details.</p>
            </div>
            <div class="modal-footer">
              <button class="modal-close-btn">Close</button>
            </div>
          `;

          // Add event listener to the close button
          const closeBtn = jobContents.querySelector(".modal-close-btn");
          if (closeBtn) {
            closeBtn.addEventListener("click", function () {
              modal.classList.add("hidden");
            });
          }
        }
      }
    }
  }

  async function openEditModal(jobId) {
    console.log("Edit job:", jobId);
    const modal = document.getElementById("modal-edit");

    if (modal) {
      // Show loading state
      modal.classList.remove("hidden");

      // Set a loading message
      const form = document.getElementById("edit-job-form");
      if (form) {
        form.innerHTML =
          '<div class="loading-message">Loading job details...</div>';
      }

      try {
        // Fetch job details using the specific endpoint
        const jobDetails = await getJobDetails(jobId);

        if (jobDetails) {
          console.log("Retrieved job details:", jobDetails);

          // Add a small delay to ensure DOM is ready (sometimes helps with rendering issues)
          setTimeout(() => {
            // Reset the form and populate with job details
            populateEditForm(jobDetails);
          }, 100);
        } else {
          throw new Error("Unable to fetch job details");
        }
      } catch (error) {
        console.error("Error in openEditModal:", error);
        toastr.error("Failed to load job details. Please try again.");
        modal.classList.add("hidden");
      }
    }
  }

  function populateEditForm(jobDetails) {
    // Get the form and reset it
    const form = document.getElementById("edit-job-form");
    if (!form) {
      console.error("Edit form element not found!");
      return;
    }
    console.log("---->>>>job details:", jobDetails.location);
    // Check if we got valid job details
    if (!jobDetails) {
      console.error("No job details provided to populateEditForm");
      form.innerHTML =
        '<div class="error-message">Error: No job details available</div>';
      return;
    }

    // Extract and sanitize job details, with verbose logging
    console.log("Job details received in populateEditForm:", jobDetails);

    // Handle different possible response structures
    const id = jobDetails.id || "";
    const title = jobDetails.title || "";
    const company = jobDetails.company || "";
    // Handle location which could be called location, gps, or address
    const location = jobDetails.location || "";
    const description = jobDetails.description || "";

    // For debugging - log the extracted values
    console.log("Extracted values for form:", {
      id,
      title,
      company,
      location,
      description,
    });

    // Function to safely escape HTML values
    const escapeHtml = (str) => {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Recreate the form with the job details
    form.innerHTML = `
      <input type="hidden" name="jobId" id="edit-job-id" value="${escapeHtml(
        id
      )}">
      <div class="form-group">
        <label for="edit-title">Job Title</label>
        <input type="text" name="title" id="edit-title" placeholder="Data Analyst" value="${escapeHtml(
          title
        )}" required>
      </div>
      <div class="form-group">
        <label for="edit-company">Company Name</label>
        <input type="text" name="company" id="edit-company" placeholder="Google" value="${escapeHtml(
          company
        )}" required>
      </div>
      <div class="form-group">
        <label for="edit-gps">Location</label>
        <input type="text" name="gps" id="edit-gps" placeholder="London, UK" value="${escapeHtml(
          location
        )}" required>
      </div>
      <div class="form-group">
        <label for="edit-description">Job Description</label>
        <textarea name="description" id="edit-description" placeholder="Job Description" required>${escapeHtml(
          description
        )}</textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-close-btn">Cancel</button>
        <button type="submit" class="modal-save-btn">Update</button>
      </div>
    `;

    // Verify that the form was populated correctly
    console.log(
      "Form populated. Value of edit-title input:",
      document.getElementById("edit-title")?.value
    );
    console.log(
      "Form populated. Value of edit-company input:",
      document.getElementById("edit-company")?.value
    );

    // Re-attach event listeners to the form and close buttons
    initEditJobForm();

    const closeBtn = form.querySelector(".modal-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        document.getElementById("modal-edit")?.classList.add("hidden");
      });
    } else {
      console.error("Close button not found in the form!");
    }
  }

  function openDeleteModal(jobId) {
    if (confirm("Are you sure you want to delete this job?")) {
      deleteJob(jobId);
    }
  }

  async function deleteJob(jobId) {
    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${parsedToken}`,
        },
      });

      if (response.status === 204 || response.ok) {
        toastr.success("Job Deleted successfully");

        // Fetch all jobs again to update the table
        fetchAndRenderJobs();
      } else {
        // Try to parse error message if there is content
        let errorMessage = "Failed to delete job";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use default error message
        }
        toastr.error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toastr.error("An error occurred. Please try again.");
    }
  }

  function openStatusModal(jobId) {
    if (confirm("Are you sure you want approve this job?")) {
      changeJobStatus(jobId);
    }
  }

  async function changeJobStatus(jobId) {
    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/jobs/status/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });
      const data = await response.json().catch((e) => {
        console.warn("Failed to parse response as JSON:", e);
        return { message: "No response body or invalid JSON" };
      });

      if (response.ok) {
        toastr.success(data.message || "Job Approved successfully");

        // Fetch all jobs again to update the table
        fetchAndRenderJobs();
        return data.data || data;
      } else {
        toastr.error(data.message || "Failed to approve job");
        return null;
      }
    } catch (error) {
      console.error("Error approving job:", error);
      toastr.error("An error occurred. Please try again.");
    }
  }

  // Initialize modal close events
  document
    .querySelectorAll(".modal-close, .modal-close-btn")
    .forEach((closeBtn) => {
      closeBtn.addEventListener("click", function () {
        const modalOverlay = this.closest(".modal-overlay");
        if (modalOverlay) {
          modalOverlay.classList.add("hidden");
        }
      });
    });
});
