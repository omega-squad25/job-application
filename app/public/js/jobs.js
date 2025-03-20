document.addEventListener("DOMContentLoaded", async () => {
  const jobsContainer = document.querySelector(".card-container");
  const jobTitleEl = document.querySelector(".job-title");
  const jobLocationEl = document.querySelector(".job-location");
  const companyNameEl = document.querySelector(".company-name");
  const jobDescriptionEl = document.querySelector(".job-description");

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
            <button class="apply-btn">View Details</button>
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
  }

  try {
    const response = await fetch("/api/jobs");
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
});
