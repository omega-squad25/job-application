document.addEventListener("DOMContentLoaded", function () {
    const saveBtn = document.querySelector("#modal-skills .modal-save-btn");
    const skillInput = document.getElementById("skill");
    const experienceSelect = document.getElementById("experience");
    const skillsList = document.getElementById("skills-list");
    const modalOverlay = document.getElementById("modal-skills");
  
    // Helper to render skill on the page
    function renderSkill(skill, experience) {
      const li = document.createElement("li");
      li.classList.add("skill-item");
      li.textContent = `${skill} - ${experience} year(s)`;
      skillsList.appendChild(li);
    }
  
    // Clear form after save
    function resetForm() {
      skillInput.value = "";
      experienceSelect.value = "";
    }
  
    // Save skill
    saveBtn.addEventListener("click", async function () {
      const skill = skillInput.value.trim();
      const experience = experienceSelect.value;
  
      if (!skill || !experience) {
        toastr.error("Please fill in all fields.");
        return;
      }
  
      try {
        // Mock API POST (replace URL with actual endpoint)
        const response = await fetch("/api/skills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ skill, experience }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to save skill.");
        }
  
        const data = await response.json();
  
        // Show in UI
        renderSkill(data.skill, data.experience);
  
        // Feedback
        toastr.success("Skill saved!");
  
        // Close modal and reset
        resetForm();
        modalOverlay.classList.add("hidden");
      } catch (error) {
        console.error(error);
        toastr.error("Error saving skill.");
      }
    });
  });
  