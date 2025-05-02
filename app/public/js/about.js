
/*ADD SKILLS MODAL*/

document.addEventListener("DOMContentLoaded", function () {
    const saveBtn = document.querySelector("#modal-skills .modal-save-btn");
    const skillInput = document.getElementById("skill");
    const experienceSelect = document.getElementById("experience");
    const skillsList = document.getElementById("skills-list");
    const modalOverlay = document.getElementById("modal-skills");

    function renderSkill(skill, experience) {
      const li = document.createElement("li");
      li.classList.add("skill-item");
      li.textContent = `${skill} - ${experience} year(s)`;
      skillsList.appendChild(li);
    }
  
    function resetForm() {
      skillInput.value = "";
      experienceSelect.value = "";
    }
  
    /* Save skill */
    saveBtn.addEventListener("click", async function () {
      const skill = skillInput.value.trim();
      const experience = parseInt(experienceSelect.value);
  
      if (!skill || isNaN(!experience)) {
        toastr.error("Please fill in all fields.");
        return;
      }
  
      try {
        const response = await fetch("/api/skills/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name:skill, yearsOfExperience:experience }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to save skill.");
        }
  
        const data = await response.json();
  
        renderSkill(data.skill, data.experience);
        toastr.success("Skill saved!");
  
        resetForm();
        modalOverlay.classList.add("hidden");
      } catch (error) {
        console.error(error);
        toastr.error("Error saving skill.");
      }
    });
  });


  /*ADD EXPERIENCE MODAL*/
  document.addEventListener("DOMContentLoaded", function () {
    const saveBtn = document.querySelector("#modal-experience .modal-save-btn");
    const modal = document.getElementById("modal-experience");
    const workExpSection = document.querySelector(".about-info"); // or use a new section if needed
  
    saveBtn.addEventListener("click", async function () {
      const jobTitle = document.getElementById("job-title").value.trim();
      const company = document.getElementById("company").value.trim();
      const isCurrent = document.getElementById("current-job").checked;
  
      const startMonth = parseInt(document.querySelector('#start-month').value, 10);
      const startYear = parseInt(document.querySelector('#start-year').value, 10);
      const endMonth = parseInt(document.querySelector('#end-month').value, 10);
      const endYear = parseInt(document.querySelector('#end-year').value, 10);
  
      const responsibility = document.getElementById("responsibility").value.trim();
  
      if (!jobTitle || !company || !startMonth || !startYear || (!isCurrent && (!endMonth || !endYear)) || !responsibility) {
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
        responsibility
      };
  
      try {
        const response = await fetch("/api/experience/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) throw new Error("Failed to save experience");
  
        const savedData = await response.json();
  
        // Render new item
        const item = document.createElement("div");
        item.className = "work-exp-item";
        item.innerHTML = `
          <h3>${savedData.jobTitle}</h3>
          <p><strong>${savedData.company}</strong> (${payload.startDate} - ${payload.endDate || "Present"})</p>
          <p>${savedData.responsibility}</p>
        `;
  
        // You can append to a dedicated container instead of `about-info`
        workExpSection.appendChild(item);
  
        // Close modal
        modal.classList.add("hidden");
  
        // Clear form
        modal.querySelector("form").reset();
  
        // Show success toast
        toastr.success("Work experience saved successfully!");
      } catch (err) {
        toastr.error(err.message || "Something went wrong");
      }
    });
  });
  

  /*ADD EDUCATION MODAL*/
  document.addEventListener('DOMContentLoaded', function () {
    const saveBtn = document.querySelector('#modal-education .modal-save-btn');
    const modal = document.querySelector('#modal-education');
    const closeBtns = modal.querySelectorAll('.modal-close, .modal-close-btn');
  
    saveBtn.addEventListener('click', async () => {
      const institution = document.querySelector('#institution').value.trim();
      const course = document.querySelector('#course').value.trim();
      const degree = document.querySelector('#degree').value.trim();
      const startMonth = parseInt(document.querySelector('#modal-education #start-month').value, 10);
      const startYear = parseInt(document.querySelector('#modal-education #start-year').value, 10);
      const endMonth = parseInt(document.querySelector('#modal-education #end-month').value, 10);
      const endYear = parseInt(document.querySelector('#modal-education #end-year').value, 10);
  
      if (!institution || !course || !degree || !startMonth || !startYear || !endMonth || !endYear) {
        toastr.error('Please fill in all fields.');
        return;
      }
  
      const payload = {
        institution,
        course,
        degree,
        startMonth,
        startYear,
        endMonth,
        endYear
      };
  
      try {
        const response = await fetch('/api/education', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (response.ok) {
          toastr.success('Education added successfully!');
          modal.classList.add('hidden');
  
          // Optionally reset form
          modal.querySelector('form').reset();
  
          // Optionally display saved data (addEducationToDOM function)
          const newData = await response.json();
          addEducationToDOM(newData);
        } else {
          const data = await response.json();
          toastr.error(data.message || 'Failed to add education.');
        }
      } catch (error) {
        console.error(error);
        toastr.error('Something went wrong. Try again.');
      }
    });
  
    // Close modal logic
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    });
  
    function addEducationToDOM(data) {
      const container = document.querySelector('.about-info');
      const educationEntry = document.createElement('div');
      educationEntry.classList.add('about-info-item');
      educationEntry.innerHTML = `
        <p><strong>${data.degree}</strong> in ${data.course}</p>
        <p>${data.institution}</p>
        <p>${monthName(data.startMonth)} ${data.startYear} - ${monthName(data.endMonth)} ${data.endYear}</p>
      `;
      container.appendChild(educationEntry);
    }
  
    function monthName(month) {
      const months = [
        '', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[month] || '';
    }
  });
  
    
  