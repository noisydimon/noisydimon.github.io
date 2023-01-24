const swiper = new Swiper(".swiper", {
  speed: 100,
  spaceBetween: 100,
  navigation: {
    nextEl: ".portfolio__slider-button-right_js",
    prevEl: ".portfolio__slider-button-left_js",
  },
  watchOverflow: true,

  // pagination: {
  //   el: ".swiper-pagination-numbers",
  //   type: "bullets",

  //   clickable: true,
  //   renderBullet: function (index, className) {
  //     return '<span class="' + className + '">' + (index + 1) + "</span>";
  //   },
  // },
});
