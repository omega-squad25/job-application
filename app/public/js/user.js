document.addEventListener("DOMContentLoaded", function () {
  const avatarUpload = document.getElementById("avatar-upload");
  const avatar = document.getElementById("avatar");
  const defaultAvatarSrc = avatar.src; // Store the default avatar src

  avatarUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        avatar.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      avatar.src = defaultAvatarSrc; // Reset to default avatar if no file is selected
    }
  });
});
