const mobileMenu = document.querySelector(".mobile-menu_js");
const sandwitchBtn = document.querySelector(".main__sandwich-button_js");
const closeSandwitch = document.querySelector(".mobile-menu__close_js");
const mobileSignInBtn = document.querySelector(".mobile-menu-login-btn_js");
const mobileRegisterBtn = document.querySelector(
  ".mobile-menu-register-btn_js"
);
const mobileToProfileBtn = document.querySelector(
  ".mobile-menu-profile-btn_js"
);
const mobileLogoutBtn = document.querySelector(".mobile-menu-logout-btn_js");

//////////////////////////////////////////////////////////////
///////////////Открытие мобильного меню///////////////////////
if (sandwitchBtn) {
  sandwitchBtn.addEventListener("click", () => {
    let mobileMenu = document.querySelector(".mobile-menu_js");
    mobileMenu.classList.remove("hidden-item");
  });
}
//////////////////////////////////////////////////////////////
///////////////Закрытие мобильного меню///////////////////////
if (closeSandwitch) {
  closeSandwitch.addEventListener("click", () => {
    let mobileMenu = document.querySelector(".mobile-menu_js");
    mobileMenu.classList.add("hidden-item");
  });
}

if (mobileMenu) {
  ///////////////////////////////////////////////////
  ///////////////////Кнопка Sign in//////////////////
  (function () {
    if (!mobileSignInBtn) return;
    mobileSignInBtn.addEventListener("click", () => {
      signInModal.classList.remove("hidden-item");
      // mobileMenu.classList.add("hidden-item");
    });
  })();
  ///////////////////////////////////////////////////
  ///////////////////Кнопка Register/////////////////
  (function () {
    if (!mobileRegisterBtn) return;
    mobileRegisterBtn.addEventListener("click", () => {
      registerModal.classList.remove("hidden-item");
      mobileMenu.classList.add("hidden-item");
    });
  })();

  ///////////////////////////////////////////////////
  ///////////////////Кнопка Logout///////////////////
  (function () {
    if (!mobileLogoutBtn) return;
    mobileLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      rerenderLinks();
      // renderProfile();
      location.pathname = "/";
      mobileMenu.classList.add("hidden-item");
    });
  })();
}
