document.addEventListener("DOMContentLoaded", fetchAppliedJobs);

const BASE_URL = "http://localhost:3000";

// Function to calculate "time ago" in days
function getTimeAgo(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffMs = now - createdDate;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days}d ago` : "Today";
}

async function fetchAppliedJobs() {
  const container = document.getElementById("applied-jobs-container");

  try {
    const token = localStorage.getItem("token");
    const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

    if (!parsedToken) {
      toastr.error("Authentication token not found");
      return;
    }

    const res = await fetch(
      `${BASE_URL}/api/applications?status=submitted&page=1&limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok && data.data.applications.length > 0) {
      renderJobCards(data.data.applications, container);
    } else {
      displayEmptyState(container);
    }
  } catch (err) {
    console.error("Failed to fetch applied jobs:", err);
    displayEmptyState(container);
  }
}

function renderJobCards(applications, container) {
  container.innerHTML = "";

  applications.forEach(({ job, appliedAt }) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("card");
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
            }">Job Submitted</button>
          </div>
          <p>Applied ${getTimeAgo(appliedAt)}</p>
        </div>
      </div>
    `;

    container.appendChild(jobCard);
  });
}

function displayEmptyState(container) {
  container.innerHTML = `
    <div class="empty-job-state">
      <h1 class="job-title">You have not applied for any jobs yet</h1>
      <p>Find new opportunities and manage your job search progress here.</p>
      <ul class="link-wrapper">
        <li><a class="job-link" href="/jobs">Browse Jobs</a></li>
      </ul>
    </div>
  `;
}
