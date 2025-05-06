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

  async function updateSkill(skillId, skill, experience, BASE_URL) {
    const token = localStorage.getItem("token");
    const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

    if (!parsedToken) {
      toastr.error("Authentication token not found");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/skills/${skillId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
        body: JSON.stringify({ name: skill, yearsOfExperience: experience }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Failed to update skill.");
      }

      const data = await response.json();
      toastr.success(data.message || "Skill updated!");

      return data;
    } catch (error) {
      toastr.error("Error updating skill: " + error.message);
      console.error(error);
    }
  }

  let currentSkillId = null;

  function resetForm() {
    skillInput.value = "";
    experienceSelect.value = "";
    currentSkillId = null;
    skillInput.disabled = false;
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

    if (currentSkillId) {
      const updated = await updateSkill(
        currentSkillId,
        skill,
        experience,
        BASE_URL
      );
      if (updated) {
        const skillItem = skillsList
          .querySelector(`.edit-skill[data-id="${currentSkillId}"]`)
          .closest(".skill-item");

        if (skillItem) {
          skillItem.querySelector(".skill-name").textContent = skill;
          skillItem.querySelector(".skill-name").dataset.skill = skill;

          skillItem.querySelector(
            ".skill-years"
          ).textContent = `${experience} year(s)`;
          skillItem.querySelector(".skill-years").dataset.experience =
            experience;

          skillItem.querySelector(".edit-skill").dataset.skill = skill;
          skillItem.querySelector(".edit-skill").dataset.experience =
            experience;
        }

        resetForm();
        modalOverlay.classList.add("hidden");
      }
    } else {
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

        renderSkill(
          data.skill.name,
          data.skill.yearsOfExperience,
          data.skill.id
        );
        toastr.success(data.message || "Skill saved!");
        resetForm();
        modalOverlay.classList.add("hidden");
      } catch (error) {
        console.error(error);
        toastr.error("Error saving skill: " + error.message);
        renderSkill(skill, experience);
        modalOverlay.classList.add("hidden");
        resetForm();
      }
    }
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

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      modalOverlay.classList.add("hidden");
      resetForm();
    });
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
/* document.addEventListener("DOMContentLoaded", function () {
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
        toastr.success("Education Added successfully!");
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
    educationEntry.classList.add("skill-item");
    educationEntry.innerHTML = `
        <span class="skill-name" > <strong>${data.education.degree}</strong> in ${data.education.fieldOfStudy}</span>
        <span class="skill-name">${data.education.institution}</span>
        <span class="education-years">${data.education.startDate} - ${data.education.endDate}</span>
        <i class="fa fa-edit edit-education" data-id="${data.education.id}" data-edu="${data.education.degree}" data-study="${data.education.fieldOfStudy}"
        data-inst="${data.education.institution}" data-SD="${data.education.startMonth}" data-ED="${data.education.endMonth}" data-SY="${data.education.startYear} 
        data-SD="${data.education.endYear}"
        style="cursor:pointer;"> </i>
      `;
    container.appendChild(educationEntry);
  }
}); */

document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "http://localhost:3000";
  const saveBtn = document.querySelector("#modal-education .modal-save-btn");
  const modal = document.querySelector("#modal-education");
  const closeBtns = modal.querySelectorAll(".modal-close, .modal-close-btn");
  const educationList = document.querySelector(".about-info");

  let currentEducationId = null;

  function resetEducationForm() {
    modal.querySelector("form").reset();
    currentEducationId = null;
  }

  async function updateEducation(
    id,
    institution,
    fieldOfStudy,
    degree,
    startMonth,
    startYear,
    endMonth,
    endYear
  ) {
    const token = localStorage.getItem("token");
    const parsedToken = token ? token.replace(/^"(.*)"$/, "$1") : null;

    if (!parsedToken) {
      toastr.error("Authentication token not found");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/education/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
        },
        body: JSON.stringify({
          institution,
          fieldOfStudy,
          degree,
          startMonth,
          startYear,
          endMonth,
          endYear,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Failed to update education.");
      }

      const data = await response.json();
      toastr.success(data.message || "Education updated!");
      return data;
    } catch (error) {
      toastr.error("Error updating education: " + error.message);
      console.error(error);
    }
  }

  educationList.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-education")) {
      const btn = event.target;
      currentEducationId = btn.dataset.id;
      modal.querySelector("#institution").value = btn.dataset.inst || "";
      modal.querySelector("#course").value = btn.dataset.edu || "";
      modal.querySelector("#degree").value = btn.dataset.edu || "";
      modal.querySelector("#start-month").value = btn.dataset.sd || "";
      modal.querySelector("#start-year").value = btn.dataset.sy || "";
      modal.querySelector("#end-month").value = btn.dataset.ed || "";
      modal.querySelector("#end-year").value = btn.dataset.ey || "";

      modal.classList.remove("hidden");
    }
  });

  saveBtn.addEventListener("click", async () => {
    const institution = modal.querySelector("#institution").value.trim();
    const fieldOfStudy = modal.querySelector("#course").value.trim();
    const degree = modal.querySelector("#degree").value.trim();
    const startMonth = parseInt(modal.querySelector("#start-month").value, 10);
    const startYear = parseInt(modal.querySelector("#start-year").value, 10);
    const endMonth = parseInt(modal.querySelector("#end-month").value, 10);
    const endYear = parseInt(modal.querySelector("#end-year").value, 10);

    if (
      !institution ||
      !fieldOfStudy ||
      !degree ||
      isNaN(startMonth) ||
      isNaN(startYear) ||
      isNaN(endMonth) ||
      isNaN(endYear)
    ) {
      toastr.error("Please fill in all fields.");
      return;
    }

    if (currentEducationId) {
      const updated = await updateEducation(
        currentEducationId,
        institution,
        fieldOfStudy,
        degree,
        startMonth,
        startYear,
        endMonth,
        endYear
      );

      if (updated) {
        const eduItem = educationList
          .querySelector(`.edit-education[data-id="${currentEducationId}"]`)
          .closest(".skill-item");

        if (eduItem) {
          eduItem.querySelector(
            ".skill-name"
          ).innerHTML = `<strong>${degree}</strong> in ${fieldOfStudy}`;
          eduItem.querySelectorAll(".skill-name")[1].textContent = institution;
          eduItem.querySelector(
            ".education-years"
          ).textContent = `${startMonth}/${startYear} - ${endMonth}/${endYear}`;

          const editIcon = eduItem.querySelector(".edit-education");
          editIcon.dataset.edu = fieldOfStudy;
          editIcon.dataset.inst = institution;
          editIcon.dataset.sd = startMonth;
          editIcon.dataset.sy = startYear;
          editIcon.dataset.ed = endMonth;
          editIcon.dataset.ey = endYear;
        }

        modal.classList.add("hidden");
        resetEducationForm();
      }
    } else {
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
          body: JSON.stringify({
            institution,
            fieldOfStudy,
            degree,
            startMonth,
            startYear,
            endMonth,
            endYear,
          }),
        });

        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(errorMsg || "Failed to save education.");
        }

        const data = await response.json();
        renderEducation(data.education);
        toastr.success(data.message || "Education added!");
        resetEducationForm();
        modal.classList.add("hidden");
      } catch (error) {
        toastr.error("Error saving education: " + error.message);
       
      }
    }
  });

  function renderEducation(edu) {
    const div = document.createElement("div");
    div.classList.add("skill-item");
    div.innerHTML = `
      <span class="skill-name"><strong>${edu.degree}</strong> in ${edu.fieldOfStudy}</span>
      <span class="skill-name">${edu.institution}</span>
      <span class="education-years">${edu.startDate} - ${edu.endDate}</span>
      <i class="fa fa-edit edit-education" data-id="${edu.id}" data-edu="${edu.fieldOfStudy}" data-inst="${edu.institution}"
      data-ed="${edu.startDate}" data-ey="${edu.endDate}" style="cursor:pointer;"></i>
      `;
    educationList.appendChild(div);
  }

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.add("hidden");
      resetEducationForm();
    });
  });
});
