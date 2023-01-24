let changePassBtn = document.querySelector(".my-profile__password-btn_js");
let changeOtherBtn = document.querySelector(".my-profile__other-btn_js");
let deleteAccBtn = document.querySelector(".my-profile__delete-btn_js");
let changePassModal = document.querySelector(".change-password-modal_js");
let changeOtherModal = document.querySelector(".change-other-modal_js");
let deletAccModal = document.querySelector(".delete-account-modal_js");
let closeBtnChangePass = document.querySelector(
  ".close-button-change-password_js"
);
let closeBtnChangeOther = document.querySelector(
  ".close-button-change-other_js"
);
const deleteBtnProfile = document.querySelector(".my-profile__delete-btn_js");
let profileImgWrapper = document.querySelector(".my-profile__picture_js");
const profileImg = document.querySelector(".my-profile__image_js");
const profileName = document.querySelector(".my-profile__name_js");
const profileSurname = document.querySelector(".my-profile__surname_js");
const profileEmail = document.querySelector(".my-profile__email_js");
const profileLocation = document.querySelector(".my-profile__location_js");
const profileAge = document.querySelector(".my-profile__age_js");

// /////////////////Открытие Change password//////////////////////////////
(function () {
  if (!changePassBtn) return;
  changePassBtn.addEventListener("click", () => {
    changePassModal.classList.remove("hidden-item");
  });
})();
// /////////////////Открытие Change other//////////////////////////////
(function () {
  if (!changeOtherBtn) return;
  changeOtherBtn.addEventListener("click", () => {
    changeOtherModal.classList.remove("hidden-item");
  });
})();
// ///////////////Закрытие Change password нажатием крестика//////////////////////////////
(function () {
  if (!closeBtnChangePass) return;
  closeBtnChangePass.addEventListener("click", () => {
    changePassModal.classList.add("hidden-item");
  });
})();

// ///////////////Закрытие Change other нажатием крестика//////////////////////////////
(function () {
  if (!closeBtnChangeOther) return;
  closeBtnChangeOther.addEventListener("click", () => {
    changeOtherModal.classList.add("hidden-item");
  });
})();

/////////////////////////////////////////////////////////////////
// ///////////////Удаление аккаунта//////////////////////////////
/////////////////////////////////////////////////////////////////
(function () {
  if (deleteBtnProfile) {
    deleteBtnProfile.addEventListener("click", deleteProfile);

    function deleteProfile() {
      console.log(`${localStorage.getItem("userId")}`);
      if (localStorage.getItem("token")) {
        sendRequest({
          url: `/api/users/${localStorage.getItem("userId")}`,
          method: "DELETE",
          headers: {
            "x-access-token": `${localStorage.getItem("token")}`,
            "Content-Type": "application/json;charset=utf-8",
          },
        })
          .then((response) => {
            console.log(response);
            if (
              response.status === 401 ||
              response.status === 403 ||
              response.status === 422
            ) {
              return response.json();
            } else {
              throw new Error(`status: ${response.status}`);
            }
          })
          .then((response) => {
            if (response.success) {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
            } else {
              throw response;
            }
          })
          .catch((err) => {
            if (err._message) {
              alert(err._message);
            }
            console.log(err);
          })
          .finally(() => {
            setTimeout(() => {
              // afterModalClose(afterLoginModal);
            }, 2000);
            location.pathname = "/";
          });
      } else {
        return;
      }
    }
  }
})();

//////////////Закрытие нажатием Esc//////////////////////////////
// (function () {
//   if (!signInModal && !registerModal) return;
//   window.addEventListener("keydown", (e) => {
//     if (e.keyCode === 27) {
//       signInModal.classList.add("hidden-item");
//       registerModal.classList.add("hidden-item");
//     }
//   });
// })();
