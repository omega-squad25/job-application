document.addEventListener('DOMContentLoaded', function () {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('cpassword');
    const eyeIcon = document.querySelector('.eye-icon img');
  
    eyeIcon.addEventListener('click', function () {
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        confirmPasswordField.type = 'text';
        eyeIcon.src = '/assets/images/eye-icon.svg'; 
      } else {
        passwordField.type = 'password';
        confirmPasswordField.type = 'password';
        eyeIcon.src = '/assets/images/eye-icon.svg'; 
      }
    });
  });