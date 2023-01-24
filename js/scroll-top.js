let scrollUpButton = document.querySelector(".scroll-top_js");

(function () {
  ////////если нет кнопки то выход из функции///////////
  if (!scrollUpButton) return;

  //////появление или исчезновение кнопки////////////////
  window.addEventListener("scroll", (e) => {
    if (window.pageYOffset > 1500) {
      scrollUpButton.classList.remove("hidden-item");
    } else {
      scrollUpButton.classList.add("hidden-item");
    }
  });
  //////клик по кнопке и скролл вверх////////////////
  scrollUpButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
})();
