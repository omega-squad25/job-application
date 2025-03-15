document.addEventListener("DOMContentLoaded", function () {
  const resumeUpload = document.getElementById("resume-upload");
  const uploadLabel = document.querySelector(".upload-label");
  const uploadText = document.querySelector(".upload-text");
  const plusIcon = document.querySelector(".fa-plus");
  const fileName = document.querySelector(".file-name");

  resumeUpload.addEventListener("change", function () {
    if (resumeUpload.files.length > 0) {
      uploadText.textContent = "Change file";
      plusIcon.classList.remove("resume-icon");
      plusIcon.classList.add("resume-file");
      fileName.textContent = resumeUpload.files[0].name;
    } else {
      uploadText.textContent = "Upload your resume";
      plusIcon.classList.remove("resume-file");
      plusIcon.classList.add("resume-icon");
      fileName.textContent = "No file chosen";
    }
  });

  uploadLabel.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    resumeUpload.click();
  });
});
