(function mainSlide() {
  const slider = document.querySelector(".portfolio__slider");
  const wrapper = document.querySelector(".portfolio__slider-wrapper");
  const innerWrapper = document.querySelector(
    ".portfolio__slider-inner-wrapper"
  );
  const slides = [...document.querySelectorAll(".portfolio__slider-slide")];
  const buttonLeft = document.querySelector(
    ".portfolio__slider-button-left_js"
  );
  const buttonRight = document.querySelector(
    ".portfolio__slider-button-right_js"
  );
  // const sliderPagination = document.querySelector(
  //   ".portfolio__navigation-spots_js"
  // );
  const animationDuration = 700;
  let timer = null;
  let slideWidth = wrapper.offsetWidth; // ширина врапера
  let activeSlideIndex = 0;

  //////////делаем управление кнопками//////////
  buttonLeft.addEventListener("click", () => {
    setActiveSlide(activeSlideIndex - 1);
  });
  buttonRight.addEventListener("click", () => {
    setActiveSlide(activeSlideIndex + 1);
  });
  /////вызываем функцию подстраивающую ширину слайда под ширину контейнера////////
  window.addEventListener("resize", () => {
    initWidth();
    setActiveSlide(activeSlideIndex, false);
  });
  initWidth(); //вызов инициализации ширины слайда
  setActiveSlide(0); //вызов начального положения

  ///////////////Функция установка нужного слайда//////////////
  function setActiveSlide(index, withAnimation = true) {
    if (index < 0 || index >= slides.length) return;
    innerWrapper.style.transform = `translateX(${index * slideWidth * -1}px)`;

    buttonLeft.removeAttribute("disabled");
    buttonRight.removeAttribute("disabled");

    if (withAnimation) {
      //чтоб не мелькало перед глазами при перемещении
      clearTimeout(timer);
      innerWrapper.style.transition = `transform ${animationDuration}ms`;
      timer = setTimeout(() => {
        innerWrapper.style.transition = "";
      }, animationDuration);
    }

    activeSlideIndex = index;
    //////////делаем управление кнопками//////////
    if (index === 0) {
      buttonLeft.setAttribute("disabled", "");
    }
    if (index === slides.length - 1) {
      buttonRight.setAttribute("disabled", "");
    }
  }

  ///////////////////Функция задаем автоматическую подстраиваемость ширины слайда под ширину контейнера//////
  function initWidth() {
    slideWidth = wrapper.offsetWidth;
    //////////устанавливаем ширину слайда////////////////
    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });
  }
})();
