// document.addEventListener("DOMContentLoaded", function () {
//   toastr.options = {
//     closeButton: true,
//     progressBar: true,
//     positionClass: "toast-top-right",
//     preventDuplicates: true,
//     showDuration: "300",
//     hideDuration: "1000",
//     timeOut: "5000",
//     extendedTimeOut: "1000",
//   };

//   const loginForm = document.getElementById("loginForm");

//   // Get password and confirm password fields from the form
//   const passwordField = document.getElementById("password");
//   const passwordEyeIcon = document.getElementById("password-eye");

//   const BASE_URL = "http://localhost:3000";

//   if (passwordEyeIcon) {
//     passwordEyeIcon.addEventListener("click", function () {
//       if (passwordField.type === "password") {
//         passwordField.type = "text";
//         passwordEyeIcon.querySelector("img").src =
//           "/assets/images/eye-icon.svg";
//       } else {
//         passwordField.type = "password";
//         passwordEyeIcon.querySelector("img").src =
//           "/assets/images/blind.svg";
//       }
//     });
//   }

//   loginForm.addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const loginButton = document.querySelector("#loginForm button[type='submit']");
//     loginButton.disabled = true;
//     loginButton.innerText = "Processing...";

//     const email = document.getElementById("email")?.value.trim();
//     const password = document.getElementById("password")?.value.trim();

//     if (!email || !password) {
//       toastr.error("Please fill in all fields.");
//       loginButton.disabled = false;
//       loginButton.innerText = "Login";
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       const data = await response.json();
//       console.log('data', data)

//       if (response.ok) {
//         toastr.success("Login successful!");

//         localStorage.setItem("user", JSON.stringify(data?.user));
//         localStorage.setItem("token", JSON.stringify(data?.token));

//         if (data?.user?.isAdmin === true) {
//           setTimeout(() => {
//             window.location.href = "/dashboard/admin";
//           }, 1500);
//         } else {
//           setTimeout(() => {
//             window.location.href = "/dashboard/user";
//           }, 1500);
//         }
//       } else {
//         toastr.error(data.message || "An error occurred during login.");
//         loginButton.disabled = false;
//         loginButton.innerText = "Login";
//       }
//     } catch (error) {
//       toastr.error("An unexpected error occurred.");
//       loginButton.disabled = false;
//       loginButton.innerText = "Login";
//     }
//   });
// });


loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    toastr.error("Please fill in all fields.");
    return;
  }

  toastr.success("Login successful (Test Mode)!");

  // Simulate saving user data
  const fakeUser = {
    email: email,
    isAdmin: false, // or true if you want to simulate admin
  };
  localStorage.setItem("user", JSON.stringify(fakeUser));
  localStorage.setItem("token", "fake-token-for-testing");

  setTimeout(() => {
    window.location.href = "/dashboard/user";
  }, 1000); // small delay to mimic real login
});
