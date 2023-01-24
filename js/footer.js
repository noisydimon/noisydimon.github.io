let sendMessageButton = document.querySelector(".footer__button_js");
let sendMessageModal = document.querySelector(".send-message-modal_js");
let closeButtonSendMessage = document.querySelector(
  ".close-button-send-message_js"
);

/////////////////Открытие Sign in//////////////////////////////
(function () {
  if (!sendMessageButton) return;
  sendMessageButton.addEventListener("click", () => {
    sendMessageModal.classList.remove("hidden-item");
  });
})();

///////////////Закрытие Login нажатием крестика//////////////////////////////
(function () {
  if (!closeButtonSendMessage) return;
  closeButtonSendMessage.addEventListener("click", () => {
    sendMessageModal.classList.add("hidden-item");
  });
})();

//////////////Закрытие нажатием Esc//////////////////////////////
(function () {
  if (!sendMessageModal) return;
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      sendMessageModal.classList.add("hidden-item");
      sendMessageModal.classList.add("hidden-item");
    }
  });
})();
