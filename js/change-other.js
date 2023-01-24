const changeOtherForm = document.forms.changeOther;

////////////////////Закрытие окна Esc//////////
if (changeOtherForm) {
  (function () {
    let changeOtherModal = document.querySelector(".change-other-modal_js");

    if (!changeOtherModal) return;
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 27) {
        changeOtherModal.classList.add("hidden-item");
      }
    });
  })();

  /////////////////////Изменение текста в поле инпут file//////////////////////////
  (function uploadName() {
    if (!changeOtherForm) return;
    //   inputFileFieldText.innerHTML = "Choose a file...";
    const inputFileField = changeOtherForm.elements.avatar;
    const inputFileFieldText = document.querySelector(
      ".change-other-modal__file-info_js"
    );

    inputFileField.addEventListener("change", function (e) {
      let fileName = this.files[0].name;
      //console.log(fileName);
      if (fileName) {
        inputFileFieldText.innerHTML = fileName;
      }
    });
  })();

  ////////////////////////////////////////////////////////////////////
  /////////////////Запрос на редактирование данных////////////////////
  ////////////////////////////////////////////////////////////////////
  (function () {
    const email = changeOtherForm.elements.email;
    const name = changeOtherForm.elements.name;
    const surname = changeOtherForm.elements.surname;
    const location = changeOtherForm.elements.location;
    const age = changeOtherForm.elements.age;
    const avatar = changeOtherForm.elements.avatar;

    //получаем элементы формы

    // console.log(age);

    let errors = {}; //объект ошибок
    // let profile = null;
    rerenderLinks();
    getProfile();

    /////////////////////////////////////////////////////////
    //////////////Получаем данные пользователя с сервера/////
    /////////////////////////////////////////////////////////
    function getProfile() {
      sendRequest({
        method: "GET",
        url: `/api/users/${localStorage.getItem("userId")}`,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            profile = res.data; // для заполнения полей формы ниже
            renderProfile(res.data);
          } else {
            throw new Error(`${res.status} ${res.message}`);
            console.log("throw");
          }
        })
        .catch((err) => {
          console.log("catch");
          //     err = err.split('');
          // if(err.message === 204){
          //   alert(err[message])
          // }
        });
    }
    //////////////////////////////////////////////////////////////
    /////////////////Изменение данных пользователя////////////////
    //////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////
    /////////////////заполнение формы данными при открытиии///////

    changeOtherBtn.addEventListener("click", () => {
      changeOtherForm.email.value = profile.email;
      changeOtherForm.name.value = profile.name;
      changeOtherForm.surname.value = profile.surname;
      changeOtherForm.location.value = profile.location;
      changeOtherForm.age.value = profile.age;
    });

    /////////////////////////////////////////////////////////////////////
    /////////////////////Отправка  данных на сервер//////////////////////
    /////////////////////////////////////////////////////////////////////
    const changeData = (e) => {
      errors = {}; //обнуляем объект
      e.preventDefault(); //отменяем стандартное поведение при submit

      //очищаем предварительно код от ошибки после первого нажатия на submit
      const errorMessages =
        changeOtherForm.querySelectorAll(".invalid-feedback");
      if (errorMessages) {
        for (let errorMessage of errorMessages) {
          errorMessage.remove();
        }
      }
      //условия валидации
      if (email.value) {
        if (!isEmailValid(email.value)) {
          errors.email =
            'Please enter a valid email address (your entry is not in the format "somebody@example.com")';
        }
      }
      if (name.value) {
        if (!name.value) {
          errors.name =
            "Please enter a valid name (2 letters minimum, and no numbers and other symbols)";
        }
      }
      if (surname.value) {
        if (!surname.value) {
          errors.surname =
            "Please enter a valid surname (2 letters minimum, and no numbers and other symbols)";
        }
      }
      if (location.value) {
        if (!location.value) {
          errors.location = "Please enter a valid location (2 letters minimum)";
        }
      }
      if (age.value) {
        if (!isAgeValid(age.value)) {
          errors.age =
            "Please enter your age 7+ (only integer numbers required)";
        }
      }

      /////////////////сообщение об ошибке/////////////
      if (Object.keys(errors).length) {
        //перебираем массив с ошибками
        Object.keys(errors).forEach((key) => {
          const messageError = errors[key];
          const input = changeOtherForm.elements[key];
          setErrorText(input, messageError);
          // console.log(messageError);
        });
      }
      ////////////////////Запрос/////////////////////////////////
      if (!Object.keys(errors).length) {
        showLoader();
        const data = new FormData(changeOtherForm);
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
              // localStorage.removeItem("token");
              // localStorage.removeItem("userId");
              profile = response.data;
              renderProfile(profile);
              let message = `Данные успешно обновлены`;
              afterModalOpen(message, "success");
              changeOtherModal.classList.add("hidden-item");
            } else {
              throw response;
            }
          })
          .catch((err) => {
            if (err._message) {
              console.log(err._message);
            }
            let message = `Ошибка обновления данных: ${err._message}`;
            afterModalOpen(message, "unsuccess");
            errorFormHandler(errors, changeOtherForm);
          })
          .finally(() => {
            hideLoader();
            setTimeout(() => {
              afterModalClose();
            }, 2000);
          });
      }
    };
    //////////////////////////////////////////////////////////////
    /////////////////////////Submit///////////////////////////////
    changeOtherForm.addEventListener("submit", changeData);
  })();
}
