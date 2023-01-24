// const { data } = require("autoprefixer");

const messageForm = document.forms.message; //получаем форму
///////////////////Включение кнопки чекбоксом///////////////////////////////
const messageCheckbox = messageForm.elements.checkbox;
const sendButton = document.querySelector(".send-message-button_js");
const messageInputs = [...messageForm.getElementsByTagName("input")];
///////////////////////////////////включаем кнопку////////////
messageCheckbox.addEventListener("change", () => {
  if (messageCheckbox.checked) {
    sendButton.removeAttribute("disabled", "disabled");
  } else {
    sendButton.setAttribute("disabled", "disabled");
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Главная функция////////////////////////////////////////////////////
(function () {
  //получаем элементы формы
  const email = messageForm.elements.email;
  const name = messageForm.elements.name;
  const subject = messageForm.elements.subject;
  const mobilePhone = messageForm.elements.mobilePhone;
  const message = messageForm.elements.message;

  //объект ошибок
  let errors = {};

  //Нажатие на submit
  messageForm.addEventListener("submit", (e) => {
    errors = {}; //обнуляем объект
    e.preventDefault(); //отменяем стандартное поведение при submit

    //очищаем предварительно код от ошибки после первого нажатия на submit
    const errorMessages = messageForm.querySelectorAll(".invalid-feedback");
    if (errorMessages) {
      for (let errorMessage of errorMessages) {
        errorMessage.remove();
      }
    }
    //////проверяем на наличие required////
    messageInputs.forEach((input) => {
      if (input.hasAttribute("required")) {
        //условия валидации
        if (input === email) {
          if (!email.value) {
            errors.email = "This field is required";
            addInvalidColor(email);
          } else if (!isEmailValid(email.value)) {
            errors.email =
              'Please enter a valid email address (your entry is not in the format "somebody@example.com")';
            addInvalidColor(email);
          } else {
            addValidColor(email);
          }
        } else if (input === name) {
          if (!name.value) {
            errors.name = "This field is required";
            addInvalidColor(name);
          } else if (!name.value) {
            errors.name =
              "Please enter a valid name (2 letters minimum, and no numbers and other symbols)";
            addInvalidColor(name);
          } else {
            addValidColor(name);
          }
        } else if (input === subject) {
          if (!subject.value) {
            errors.subject = "This field is required";
            addInvalidColor(subject);
          } else if (!subject.value) {
            errors.subject = "Please enter a subject of your message";
            addInvalidColor(subject);
          } else {
            addValidColor(subject);
          }
        } else if (input === mobilePhone) {
          if (!mobilePhone.value) {
            errors.mobilePhone = "This field is required";
            addInvalidColor(mobilePhone);
          } else if (!isMobilePhoneValid(mobilePhone.value)) {
            errors.mobilePhone =
              "Please enter a valid phone number (example: +7 945 385 4534)";
            addInvalidColor(mobilePhone);
          } else {
            addValidColor(mobilePhone);
          }
        }
        ///////////Валидация поля с сообщением ( не требуется, сделал на всякий случай)
        // if (!message.value) {
        //   errors.message = "Please enter a message";
        //   addInvalidColor(message);
        // } else {
        //   addValidColor(message);
        // }
      }
    });
    /////////////////сообщение об ошибке/////////////
    if (Object.keys(errors).length) {
      //перебираем массив с ошибками
      Object.keys(errors).forEach((key) => {
        const messageError = errors[key];
        const input = messageForm.elements[key];
        setErrorText(input, messageError);
      });
    }

    /////////////////////////////////
    //Данные для отправки на сервер//
    /////////////////////////////////
    const data = {
      email: email.value,
      name: name.value,
      subject: subject.value,
      mobilePhone: mobilePhone.value,
      message: message.value,
    };

    if (!Object.keys(errors).length) {
      showLoader();
      let sendMessageData = {
        to: data.email,
        body: JSON.stringify(data),
      };
      sendRequest({
        url: "/api/emails",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendMessageData),
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
            let message = `Сообщение от пользователя ${data.name} успешно отправлено`;
            afterModalOpen(message, "success");
            messageForm.reset();
            setTimeout(() => {
              afterModalClose();
              signInModal.classList.add("hidden-item");
              location.pathname = "/";
            }, 2000);
          } else {
            throw response;
          }
        })
        .catch((err) => {
          let message = `Не отправлено: ${err._message}`;
          afterModalOpen(message, "unsuccess");
          setTimeout(() => {
            afterModalClose();
          }, 2000);
          console.log(err);
          // clearErrors(messageForm);
          errorFormHandler(err.errors, messageForm);
        })
        .finally(() => {
          hideLoader();
        });
    } else {
      console.log("Есть ошибки в заполнении формы");
    }
  });
})();
