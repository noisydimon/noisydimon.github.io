const changePassForm = document.forms.changePassword;

(function () {
  let changePassModal = document.querySelector(".change-password-modal_js");

  if (!changePassModal) return;
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      changePassModal.classList.add("hidden-item");
    }
  });
})();
/////////////////////////////////Функция валидации////////////////////////////////
(function () {
  if (!changePassForm) return;
  const changePassInputs = [...changePassForm.getElementsByTagName("input")];
  const oldPass = changePassForm.elements.oldPassword;
  const newPass = changePassForm.elements.newPassword;
  const repeatPass = changePassForm.elements.repeatPassword;
  let errors = {}; //объект ошибок

  //Нажатие на submit
  changePassForm.addEventListener("submit", (e) => {
    errors = {}; //обнуляем объект
    e.preventDefault(); //отменяем стандартное поведение при submit
    //очищаем предварительно код от ошибки после первого нажатия на submit
    const errorMessages = changePassForm.querySelectorAll(".invalid-feedback");
    if (errorMessages) {
      for (let errorMessage of errorMessages) {
        errorMessage.remove();
      }
    }
    //////проверяем на наличие required////
    changePassInputs.forEach((input) => {
      if (input.hasAttribute("required")) {
        //прописываем сообщения при валидации
        if (input === oldPass) {
          if (!oldPass.value) {
            errors.oldPassword = "This field is required";
            addInvalidColor(oldPass);
          } else if (!isPasswordValid(oldPass.value)) {
            errors.oldPassword =
              "Please enter a valid password (6 symbols minimum)";
            addInvalidColor(oldPass);
          } else {
            addValidColor(oldPass);
          }
        } else if (input === newPass) {
          if (!newPass.value) {
            errors.newPassword = "This field is required";
            addInvalidColor(newPass);
          } else if (!isNewPasswordValid(oldPass.value, newPass.value)) {
            errors.newPassword =
              "Please enter a valid password (6 symbols minimum). Do not use the old password";
            addInvalidColor(newPass);
          } else {
            addValidColor(newPass);
          }
        } else if (input === repeatPass) {
          if (!repeatPass.value) {
            errors.repeatPassword = "This field is required";
            addInvalidColor(repeatPass);
          } else if (!isPasswordRepeatValid(newPass.value, repeatPass.value)) {
            errors.repeatPassword =
              "The entered value does not match with entered password above";
            addInvalidColor(repeatPass);
          } else {
            addValidColor(repeatPass);
          }
        }
      }
    });
    /////////////////сообщение об ошибке/////////////
    if (Object.keys(errors).length) {
      //перебираем массив с ошибками
      Object.keys(errors).forEach((key) => {
        const messageError = errors[key];
        const input = changePassForm.elements[key];
        setErrorText(input, messageError);
      });
    }
    ///////////////////////////////////////////////////////////
    ////////////////////Запрос/////////////////////////////////
    if (!Object.keys(errors).length) {
      showLoader();
      const data = new FormData(changePassForm);
      sendRequest({
        url: "/api/users",
        method: "PUT",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
        body: data,
      })
        .then((response) => {
          console.log(response);
          if (
            response.status === 401 ||
            response.status === 403 ||
            response.status === 422 ||
            response.status === 400 ||
            response.status === 200
          ) {
            return response.json();
          } else {
            throw new Error(`status: ${response.status}`);
          }
        })
        .then((response) => {
          if (response.success) {
            profile = response.data;
            renderProfile(profile);
            let message = `Пароль успешно изменён`;
            afterModalOpen(message, "success");
            changePassModal.classList.add("hidden-item");
            setTimeout(() => {
              afterModalClose();
              changePassModal.classList.add("hidden-item");
              changePassForm.reset();
              // location.pathname = "/";
            }, 2000);
          } else {
            throw response;
          }
        })
        .catch((err) => {
          if (err._message) {
            console.log(err._message);
          }
          // clearErrors(changeOtherForm);
          errorFormHandler(errors, changeOtherForm);
          let message = `Ошибка входа: ${err._message}`;
          afterModalOpen(message, "unsuccess");
          setTimeout(() => {
            afterModalClose();
          }, 2000);
        })
        .finally(() => {
          hideLoader();
        });
    }
  });
})();

//валидация пароля (используется выше)
function isNewPasswordValid(passwordOld, passwordNew) {
  if (passwordNew.length >= 6 && passwordNew !== passwordOld) {
    return true;
  }
}
