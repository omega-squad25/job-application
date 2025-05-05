/*ADD SKILLS MODAL*/

document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://localhost:3000";
  const saveBtn = document.querySelector("#modal-skills .modal-save-btn");
  const skillInput = document.getElementById("skill");
  const experienceSelect = document.getElementById("experience");
  const skillsList = document.getElementById("skills-list");
  const modalOverlay = document.getElementById("modal-skills");
  const closeButtons = document.querySelectorAll(
    "#modal-skills .modal-close, #modal-skills .modal-close-btn"
  );

  let currentSkillId = null;

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      modalOverlay.classList.add("hidden");
      resetForm();
    });
  });

  function renderSkill(skill, experience, id = Date.now()) {
    const li = document.createElement("li");
    li.classList.add("skill-item");

    li.innerHTML = `
        <span class="skill-name" data-skill="${skill}">${skill}</span>
        <span class="skill-years" data-experience="${experience}">${experience} year(s)</span>
        <i class="fa fa-edit edit-skill" data-id="${id}" data-skill="${skill}" data-experience="${experience}" style="cursor:pointer;"></i>
      `;
    skillsList.appendChild(li);
  }

  function resetForm() {
    skillInput.value = "";
    experienceSelect.value = "";
  }

  skillsList.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-skill")) {
      const skillId = event.target.dataset.id;
      const skillName = event.target.dataset.skill;
      const skillExperience = event.target.dataset.experience;

      currentSkillId = skillId;

      skillInput.value = skillName;
      skillInput.disabled = true;
      experienceSelect.value = skillExperience;

      modalOverlay.classList.remove("hidden");
    }
  });

  saveBtn.addEventListener("click", async function () {
    const skill = skillInput.value.trim();
    const experience = parseInt(experienceSelect.value);

    if (!skill || isNaN(experience)) {
      toastr.error("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/skills/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
        body: JSON.stringify({ name: skill, yearsOfExperience: experience }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Failed to save skill.");
      }

      const data = await response.json();

      renderSkill(data.name, data.yearsOfExperience);
      toastr.success("Skill saved!");

      resetForm();
      modalOverlay.classList.add("hidden");
    } catch (error) {
      console.error(error);
      toastr.error("Error saving skill: " + error.message);
      renderSkill(skill, experience);
      modalOverlay.classList.add("hidden");
      resetForm();
    }
  });
});

/*ADD EXPERIENCE MODAL*/
document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://localhost:3000";

  const saveBtn = document.querySelector("#modal-experience .modal-save-btn");
  const modal = document.getElementById("modal-experience");
  const workExpSection = document.querySelector(".about-info");

  saveBtn.addEventListener("click", async function () {
    const jobTitle = document.getElementById("job-title").value.trim();
    const company = document.getElementById("company").value.trim();
    const isCurrent = document.getElementById("current-job").checked;

    const startMonth = parseInt(
      document.querySelector("#start-month").value,
      10
    );
    const startYear = parseInt(document.querySelector("#start-year").value, 10);
    const endMonth = parseInt(document.querySelector("#end-month").value, 10);
    const endYear = parseInt(document.querySelector("#end-year").value, 10);

    const responsibility = document
      .getElementById("responsibility")
      .value.trim();

    if (
      !jobTitle ||
      !company ||
      !startMonth ||
      !startYear ||
      (!isCurrent && (!endMonth || !endYear)) ||
      !responsibility
    ) {
      toastr.error("Please fill in all required fields");
      return;
    }

    const payload = {
      jobTitle,
      company,
      startMonth: startMonth,
      startYear: startYear,
      endMonth: endMonth,
      endYear: endYear,
      isCurrentlyWorkingOnRole: isCurrent,
      responsibility,
    };

    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/experience/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save experience");

      const savedData = await response.json();

      // Render new item
      const item = document.createElement("div");
      item.className = "work-exp-item";
      item.innerHTML = `
          <h3>${savedData.jobTitle}</h3>
          <p><strong>${savedData.company}</strong> (${payload.startDate} - ${
        payload.endDate || "Present"
      })</p>
          <p>${savedData.responsibility}</p>
        `;

      workExpSection.appendChild(item);
      modal.classList.add("hidden");

      modal.querySelector("form").reset();

      toastr.success("Work experience saved successfully!");
    } catch (err) {
      toastr.error(err.message || "Something went wrong");
    }
  });
});

/*ADD EDUCATION MODAL*/
document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://localhost:3000";

  const saveBtn = document.querySelector("#modal-education .modal-save-btn");
  const modal = document.querySelector("#modal-education");
  const closeBtns = modal.querySelectorAll(".modal-close, .modal-close-btn");

  saveBtn.addEventListener("click", async () => {
    const institution = document.querySelector("#institution").value.trim();
    const fieldOfStudy = document.querySelector("#course").value.trim();
    const degree = document.querySelector("#degree").value.trim();
    const startMonth = parseInt(
      document.querySelector("#modal-education #start-month").value,
      10
    );
    const startYear = parseInt(
      document.querySelector("#modal-education #start-year").value,
      10
    );
    const endMonth = parseInt(
      document.querySelector("#modal-education #end-month").value,
      10
    );
    const endYear = parseInt(
      document.querySelector("#modal-education #end-year").value,
      10
    );

    if (
      !institution ||
      !fieldOfStudy ||
      !degree ||
      !startMonth ||
      !startYear ||
      !endMonth ||
      !endYear
    ) {
      toastr.error("Please fill in all fields.");
      return;
    }

    const payload = {
      institution,
      fieldOfStudy,
      degree,
      startMonth,
      startYear,
      endMonth,
      endYear,
    };

    try {
      const token = localStorage.getItem("token");
      const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

      if (!parsedToken) {
        toastr.error("Authentication token not found");
        return;
      }
      const response = await fetch(`${BASE_URL}/api/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toastr.success("Education added successfully!");
        modal.classList.add("hidden");

        modal.querySelector("form").reset();

        const newData = await response.json();
        addEducationToDOM(newData);
      } else {
        const data = await response.json();
        toastr.error(data.message || "Failed to add education.");
      }
    } catch (error) {
      console.error(error);
      toastr.error("Something went wrong. Try again.");
    }
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  });

  function addEducationToDOM(data) {
    const container = document.querySelector(".about-info");
    const educationEntry = document.createElement("div");
    educationEntry.classList.add("about-info-item");
    educationEntry.innerHTML = `
        <p><strong>${data.degree}</strong> in ${data.course}</p>
        <p>${data.institution}</p>
        <p>${monthName(data.startMonth)} ${data.startYear} - ${monthName(
      data.endMonth
    )} ${data.endYear}</p>
      `;
    container.appendChild(educationEntry);
  }

  function monthName(month) {
    const months = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month] || "";
  }
});
