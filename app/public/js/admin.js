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
      const description = document.getElementById("description")?.value.trim();

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
        console.log("Received data:", data);
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
      <td>${job.status || "Pending"}</td>
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

  function addTableIconEventListeners() {
    // First remove all existing event listeners
    document
      .querySelectorAll(".view-icon, .edit-icon, .delete-icon")
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
      // Here you would typically fetch job details and populate the modal
      modal.classList.remove("hidden");
    }
  }

  async function openEditModal(jobId) {
    console.log("Edit job:", jobId);
    const modal = document.getElementById("modal-edit");
    if (modal) {
      // Here you would typically fetch job details and populate the form
      modal.classList.remove("hidden");
    }
  }

  function openDeleteModal(jobId) {
    if (confirm("Are you sure you want to delete this job?")) {
      console.log("Delete job:", jobId);
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
        toastr.success("Job deleted successfully");

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
