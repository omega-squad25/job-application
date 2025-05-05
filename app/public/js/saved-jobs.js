document.addEventListener("DOMContentLoaded", fetchSavedJobs);

const BASE_URL = "http://localhost:3000";

async function fetchSavedJobs() {
  const container = document.getElementById("saved-jobs-container");

  try {
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1");

    if (!token) {
      toastr.error("Authentication token not found");
      return;
    }

    const res = await fetch(`${BASE_URL}/api/save-job`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok && data.savedJobs && data.savedJobs.length > 0) {
      renderSavedJobCards(data.savedJobs, container);
    } else {
      displayEmptySavedState(container);
    }
  } catch (err) {
    console.error("Failed to fetch saved jobs:", err);
    displayEmptySavedState(container);
  }
}

function renderSavedJobCards(jobs, container) {
  container.innerHTML = "";

  jobs.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("card");
    jobCard.dataset.jobId = job.jobId;

    jobCard.innerHTML = `
      <div class="card-item">
        <div class="card-header">
          <div class="company-details">
            <img src="${
              job.companyLogo || "/assets/images/asma-logo.svg"
            }" alt="Company Logo">
            <p class="job-location">${job.company}</p>
          </div>
          <div class="bookmark-icon" data-job-id="${job.jobId}">
            <i class="fa-solid fa-bookmark saved"></i>
          </div>
        </div>
        <h2 class="job-title">${job.title}</h2>
        <div class="job-details">
          <p class="job-location">${job.location}</p>
          <p class="job-type">Full time</p>
        </div>
        <div class="btn-wrapper">
          <div class="btns">
            <button class="apply-btn">View Details</button>
          </div>
          <p>${getTimeAgo(job.createdAt || job.savedAt)}</p>
        </div>
      </div>
    `;

    container.appendChild(jobCard);
  });

  attachBookmarkHandlers();
}

function attachBookmarkHandlers() {
  const icons = document.querySelectorAll(".bookmark-icon");

  icons.forEach((icon) => {
    icon.addEventListener("click", async () => {
      const jobId = icon.dataset.jobId;
      const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1");

      if (!token) {
        toastr.error("No auth token");
        return;
      }

      const isSaved = icon.querySelector("i").classList.contains("saved");

      try {
        const res = await fetch(`${BASE_URL}/api/save-job/${jobId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (res.ok) {
          if (isSaved) {
            icon.querySelector("i").classList.remove("saved");
            toastr.success("Job removed from saved");
          } else {
            icon.querySelector("i").classList.add("saved");
            toastr.success("Job saved!");
          }
        } else {
          toastr.error(result.message || "Action failed");
        }
      } catch (err) {
        console.error("Bookmark toggle error:", err);
        toastr.error("Something went wrong");
      }
    });
  });
}

function displayEmptySavedState(container) {
  container.innerHTML = `
    <div class="empty-job-state">
      <h1 class="job-title">No saved jobs yet! ⭐</h1>
      <p>Find new opportunities and manage your job search progress here.</p>
      <ul class="link-wrapper">
        <li><a class="job-link" href="/jobs">Browse Jobs</a></li>
      </ul>
    </div>
  `;
}

function getTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return "Just now";
}
