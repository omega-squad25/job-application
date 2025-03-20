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
          "/assets/images/eye-icon.svg"; 
      } else {
        passwordField.type = "password";
        passwordEyeIcon.querySelector("img").src =
          "/assets/images/blind.svg";
      }
    });
  }
  if (confirmPasswordEyeIcon) {
    confirmPasswordEyeIcon.addEventListener("click", function () {
      if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
        confirmPasswordEyeIcon.querySelector("img").src =
          "/assets/images/eye-icon.svg";
      } else {
        confirmPasswordField.type = "password";
        confirmPasswordEyeIcon.querySelector("img").src =
          "/assets/images/blind.svg";
      }
    });
  }

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const signUpButton = document.querySelector("#signUpForm button[type='submit']");
    signUpButton.disabled = true;
    signUpButton.innerText = "Processing...";

    const fullName = document.getElementById("fullname")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const confirmPassword = document.getElementById("cpassword")?.value.trim();

    if (!fullName || !email || !password || !confirmPassword) {
      toastr.error("Please fill in all fields.");
      signUpButton.disabled = false;
      signUpButton.innerText = "Sign Up";
      return;
    }

    if (password !== confirmPassword) {
      toastr.error("Passwords do not match.");
      signUpButton.disabled = false;
      signUpButton.innerText = "Sign Up";
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
        toastr.success("Registration successful!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toastr.error(data.message || "An error occurred during signup.");
        signUpButton.disabled = false;
        signUpButton.innerText = "Sign Up";
      }
    } catch (error) {
      console.error("Error:", error);
      signUpButton.disabled = false;
      signUpButton.innerText = "Sign Up";
      toastr.error("An unexpected error occurred.");
    }
  });
});
