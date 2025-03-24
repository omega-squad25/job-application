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

  // Fetch all jobs when page loads
  fetchAndRenderJobs();

  // Get form element
  const createJobForm = document.getElementById("create-job-form");

  if (createJobForm) {
    createJobForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const submitButton = createJobForm.querySelector("button[type='submit']");
      submitButton.disabled = true;
      submitButton.innerText = "Processing...";

      const title = document.getElementById("title")?.value.trim();
      const company = document.getElementById("company")?.value.trim();
      const location = document.getElementById("gps")?.value.trim();
      const description = document.getElementById("description")?.value.trim();

      if (!title || !company || !location || !description) {
        toastr.error("All fields are required.");
        submitButton.disabled = false;
        submitButton.innerText = "Create Job";
        return;
      }

      const jobData = { title, company, location, description };

      try {
        const newJob = await createJob(jobData);
        if (newJob) {
          addJobToTable(newJob);
        }
        createJobForm.reset();
      } catch (error) {
        console.error("Error:", error);
      }

      submitButton.disabled = false;
      submitButton.innerText = "Create Job";
    });
  }

  async function fetchAndRenderJobs() {
    try {
      const response = await fetch(`${BASE_URL}/api/jobs`);
      const data = await response.json();

      if (response.ok) {
        renderJobs(data.data.jobs);
      } else {
        toastr.error(data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  function renderJobs(jobs) {
    const tableBody = document.querySelector(".table-container table tbody");
    if (!tableBody) return;

    tableBody.innerHTML = ""; // Clear previous rows before rendering

    jobs.forEach((job) => {
      addJobToTable(job);
    });
  }

  function addJobToTable(job) {
    const tableBody = document.querySelector(".table-container table tbody");
    if (!tableBody) return;

    // Check if job already exists in the table to prevent duplicates
    const existingJob = [...tableBody.querySelectorAll("tr")].some((row) =>
      row.querySelector("td")?.innerText.includes(job.title)
    );

    if (existingJob) return;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${job.title}</td>
      <td>${job.company}</td>
      <td>${new Date(job.createdAt).toLocaleDateString()}</td>
      <td>${job.location}</td>
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
      const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1");
      if (!token) {
        toastr.error("Authentication token not found");
        return null;
      }

      const response = await fetch(`${BASE_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (response.ok) {
        toastr.success(data.message || "Job created successfully");
        document.getElementById("modal-create-job")?.classList.add("hidden");
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
});
