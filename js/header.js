let signInButton = document.querySelector(".header__sign-in_js");
let registerButton = document.querySelector(".header__register_js");
let toProfileButton = document.querySelector(".header__my-profile_js");
let signInModal = document.querySelector(".sign-in-modal_js");
let registerModal = document.querySelector(".register-modal_js");
let closeButtonLogin = document.querySelector(".close-button-login_js");
let closeButtonRegister = document.querySelector(".close-button-register_js");
let logoutButton = document.querySelector(".header__logout_js");
/////////////////Открытие Sign in//////////////////////////////
(function () {
  if (!signInButton) return;
  signInButton.addEventListener("click", () => {
    signInModal.classList.remove("hidden-item");
  });
})();
/////////////////Открытие Register//////////////////////////////
(function () {
  if (!registerButton) return;
  registerButton.addEventListener("click", () => {
    registerModal.classList.remove("hidden-item");
  });
})();
///////////////Закрытие Login нажатием крестика//////////////////////////////
(function () {
  if (!closeButtonLogin) return;
  closeButtonLogin.addEventListener("click", () => {
    signInModal.classList.add("hidden-item");
  });
})();

///////////////Закрытие Register нажатием крестика//////////////////////////////
(function () {
  if (!closeButtonRegister) return;
  closeButtonRegister.addEventListener("click", () => {
    registerModal.classList.add("hidden-item");
  });
})();

//////////////Закрытие нажатием Esc//////////////////////////////
(function () {
  if (!signInModal && !registerModal) return;
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      signInModal.classList.add("hidden-item");
      registerModal.classList.add("hidden-item");
    }
  });
})();

/////////////Выход из аккаунта///////////////////////////////////
(function () {
  if (!logoutButton) return;
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    rerenderLinks();
    // renderProfile();
    location.pathname = "/";
  });
})();
