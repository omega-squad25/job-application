document.addEventListener("DOMContentLoaded", function () {
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

  const signupForm = document.getElementById("signupForm");

  // Get password and confirm password fields from the form
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("cpassword");
  const passwordEyeIcon = document.getElementById("password-eye");
  const confirmPasswordEyeIcon = document.getElementById("cpassword-eye");

  const BASE_URL = "http://localhost:3000";

  // Toggle password visibility for the password field
  if (passwordEyeIcon) {
    passwordEyeIcon.addEventListener("click", function () {
      if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordEyeIcon.querySelector("img").src =
          "/assets/images/eye-icon.svg"; // Change to "eye open" icon
      } else {
        passwordField.type = "password";
        passwordEyeIcon.querySelector("img").src =
          "/assets/images/eye-icon.svg"; // Change to "eye closed" icon
      }
    });
  }

  // Toggle password visibility for the confirm password field
  if (confirmPasswordEyeIcon) {
    confirmPasswordEyeIcon.addEventListener("click", function () {
      if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
        confirmPasswordEyeIcon.querySelector("img").src =
          "/assets/images/eye-icon.svg";
      } else {
        confirmPasswordField.type = "password";
        confirmPasswordEyeIcon.querySelector("img").src =
          "/assets/images/eye-icon.svg";
      }
    });
  }

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullname")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const confirmPassword = document.getElementById("cpassword")?.value.trim();

    if (!fullName || !email || !password || !confirmPassword) {
      toastr.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toastr.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toastr.success(data.message || "Registration successful!");
        window.location.href = "/login";
      } else {
        toastr.error(data.message || "An error occurred during signup.");
      }
    } catch (error) {
      console.error("Error:", error);
      toastr.error("An unexpected error occurred.");
    }
  });
});
