(function mainSlide() {
  const slider = document.querySelector(".main__slider");
  const wrapper = document.querySelector(".main__slider-wrapper");
  const innerWrapper = document.querySelector(".main__slider-inner-wrapper");
  const slides = [...document.querySelectorAll(".main__slider-slide")];
  const buttonLeft = document.querySelector(".main__slider-button-left_js");
  const buttonRight = document.querySelector(".main__slider-button-right_js");
  const sliderPagination = document.querySelector(".main__navigation-spots_js");
  const animationDuration = 700;
  let timer = null;
  let dots = [];
  let slideWidth = wrapper.offsetWidth; // ширина врапера
  let activeSlideIndex;

  updateSlideCount();

  //////////делаем управление кнопками//////////
  buttonLeft.addEventListener("click", () => {
    setActiveSlide(activeSlideIndex - 1);
    localStorage.setItem("activeSlideIndex", activeSlideIndex);
    updateSlideCount();
  });
  buttonRight.addEventListener("click", () => {
    setActiveSlide(activeSlideIndex + 1);
    localStorage.setItem("activeSlideIndex", activeSlideIndex);
    updateSlideCount();
  });
  /////вызываем функцию подстраивающую ширину слайда под ширину контейнера////////
  window.addEventListener("resize", () => {
    initWidth();
    setActiveSlide(activeSlideIndex, false);
  });
  createDots(); //вызываем создание точек пагинации
  initWidth(); //вызов инициализации ширины слайда
  setActiveSlide(activeSlideIndex, false); //вызов начального положения

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
    dots[activeSlideIndex].classList.remove("slider__spot_active");
    dots[index].classList.add("slider__spot_active");
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
  /////////////Функция создаем точку пагинации//////////
  function createDot(index) {
    const dot = document.createElement("button");
    dot.classList.add("slider__spot-button");

    if (index === activeSlideIndex) {
      dot.classList.add("slider__spot_active");
    }

    dot.addEventListener("click", () => {
      setActiveSlide(index);
      localStorage.setItem("activeSlideIndex", activeSlideIndex);
      updateSlideCount();
    });

    return dot;
  }
  ///////////Функция создаем точки пагинации//////////
  function createDots() {
    for (let i = 0; i < slides.length; i++) {
      const dot = createDot(i);
      dots.push(dot);
      sliderPagination.insertAdjacentElement("beforeend", dot);
    }
  }

  ///////////////////////////////////////////////////////////////
  ////////////////////////Сохраняем слайдер//////////////////////
  ///////////////////////////////////////////////////////////////

  function updateSlideCount() {
    +localStorage.getItem("activeSlideIndex")
      ? (activeSlideIndex = +localStorage.getItem("activeSlideIndex"))
      : (activeSlideIndex = 0);
  }
})();
