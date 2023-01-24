// const { active } = require("browser-sync");

let filterForm = document.forms.myBlogFilterForm;
const SERVER_URL = "https://academy.directlinedev.com";
const paginationLinks = document.querySelector(".my-blog__pagination_js");
const myBlogBtnLeft = document.querySelector(".my-blog__slider-button-left");
const myBlogBtnRight = document.querySelector(".my-blog__slider-button-right");
const resetButton = filterForm.querySelector(".filter__reset-button_js");
////////////////////////////////////////////////////////////////////
////////////////////Формируем строку с нажатыми фильтрами///////////
////////////////////////////////////////////////////////////////////
//проверяем наличие поискового запроса в url
if (location.search) {
  const params = {}; //создаем объект будущих параметров
  //создаем массив строк параметров например ['tags=checkbox-blue, 'tags=checkbox-light-blue', 'howShow=radio-show-5'];
  const arrayStringParams = location.search.substring(1).split("&");
  //делаем перебор массива, коротый мы создали выше.
  for (let stringParam of arrayStringParams) {
    // создаем массив одного параметра ('tags=checkbox-blue' => ['tags', 'checkbox-blue'])
    let param = stringParam.split("=");
    let nameParam = param[0]; // получаем имя параметра.
    let valueParam = param[1]; // получаем значение параметра
    //выполняем проверку на то, присутствует ли имя параметра в нашем объекте params.

    if (nameParam in params) {
      // если присутствует то добавляем в массив значение параметра,
      params[nameParam].push(valueParam);
    } else {
      //иначе создаем ключ внутри объекта и кладем в него значение параметра
      params[nameParam] = [valueParam];
    }
  }

  const updateInput = (gInputs, typeParam) => {
    for (let input of gInputs) {
      if (!params[typeParam]) continue;
      const param = params[typeParam];
      // console.log(params[typeParam]);
      // console.log(`params: ${params}`, `param: ${param}`);
      for (partParam of [...param]) {
        if (partParam === input.value) input.checked = true;
      }
    }
  };
  // console.log(param);
  updateInput(filterForm.filterTag, `tags`);
  updateInput(filterForm.filterViewsGroup, `views`);
  updateInput(filterForm.filterComments, `commentsCount`);
  updateInput(filterForm.filterHowShowGroup, `limit`);
  updateInput(filterForm.filterSortByGroup, `sort`);

  // updateInput(filterForm.filterName, `name`);
}

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let arrayCheckedInput = [];
  const addCheckedInput = (nameGroupInput, typeParam) => {
    for (let checkbox of nameGroupInput) {
      if (checkbox.checked) {
        arrayCheckedInput.push(`${typeParam}=${checkbox.value}`);
      }
    }
  };

  addCheckedInput(e.target.filterTag, `tags`);
  addCheckedInput(e.target.filterViewsGroup, `views`);
  addCheckedInput(e.target.filterComments, `commentsCount`);
  addCheckedInput(e.target.filterHowShowGroup, `limit`);
  addCheckedInput(e.target.filterSortByGroup, `sort`);
  // addCheckedInput(e.target.filterName, `name`);
  if (filterForm.filterName.value) {
    arrayCheckedInput.push(`${"name"}=${filterForm.filterName.value}`);
  }
  console.log(arrayCheckedInput);
  //собираем строку с нажатыми инпутами
  let stringCheckedInput = "";
  for ([index, activeInput] of arrayCheckedInput.entries()) {
    stringCheckedInput += activeInput;

    if (index != arrayCheckedInput.length - 1) {
      stringCheckedInput += "&";
    }
  }
  const baseUrl = `${location.origin}${location.pathname}`;
  const newUrl = baseUrl + `?${stringCheckedInput}`;
  location = newUrl;
});

//////////////////////////////////////////////////////////////////////////////
///////////////////////////работаем с готовой location history////////////////
//////////////////////////////////////////////////////////////////////////////

if (location.search) {
  let params = {};

  const arrayStringParams = location.search.substring(1).split("&");

  for (let stringParam of arrayStringParams) {
    let param = stringParam.split("=");
    let nameParam = param[0];
    let valueParam = param[1];
    params[nameParam] = [valueParam];
  }

  const updateInput = (gInputs, typeParam) => {
    if (Array.isArray(gInputs)) {
      for (let input of gInputs) {
        if (!params[typeParam]) continue;
        const param = params[typeParam];
        for (partParam of param) {
          if (partParam === input.value) input.checked = true;
        }
      }
    } else {
      const param = params[typeParam];
      if (param) {
        gInputs.value = param;
      } else {
        gInputs.value = "";
      }
    }
  };

  updateInput(filterForm.filterTag, "tags");
  updateInput(filterForm.filterViewsGroup, "views");
  updateInput(filterForm.filterComments, "commentsCount");
  updateInput(filterForm.filterHowShowGroup, "limit");
  updateInput(filterForm.filterSortByGroup, "sort");
  updateInput(filterForm.filterName, "name");
}

const url = new URL(location.partname, location.origin);
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  url.searchParams.delete("tags");
  url.searchParams.delete("views");
  url.searchParams.delete("commentsCount");
  url.searchParams.delete("limit");
  url.searchParams.delete("sort");
  url.searchParams.delete("page"); ////////////////////////////?????????????????????/
  url.searchParams.delete("name");
  const addCheckedInput = (nameGroupInput, typeParam) => {
    for (let checkbox of nameGroupInput) {
      if (checkbox.checked) {
        url.searchParams.append(typeParam, checkbox.value);
      }
    }
  };
  addCheckedInput(e.target.filterTag, `tags`);
  addCheckedInput(e.target.filterViewsGroup, `views`);
  addCheckedInput(e.target.filterComments, `commentsCount`);
  addCheckedInput(e.target.filterHowShowGroup, `limit`);
  addCheckedInput(e.target.filterSortByGroup, `sort`);
  addCheckedInput(e.target.filterName, `name`);
  history.replaceState(null, "", url);
});

//////////////////////////////////////////////////////////////////////////////
///////////////////////////XHR запрос/////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
let newdata;
/////////////////////Функция///////////////
(function () {
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ///Создаем и наполняем  объект с выбранными фильтрами////
    let data = {
      page: 0,
    };
    data.name = filterForm.elements.name.value;

    data.tags = [...filterForm.elements.filterTag]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    data.views = (
      [...filterForm.elements.filterViewsGroup].find(
        (radio) => radio.checked
      ) || { value: null }
    ).value;

    data.commentsCount = [...filterForm.elements.filterComments]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    data.limit = (
      [...filterForm.elements.filterHowShowGroup].find(
        (radio) => radio.checked
      ) || { value: null }
    ).value;

    data.sort = (
      [...filterForm.elements.filterSortByGroup].find(
        (radio) => radio.checked
      ) || { value: null }
    ).value;
    newdata = data;
    console.log(data);
    getData(data);
    setSearchParams(data);
  });

  let xhr = new XMLHttpRequest();
  xhr.open("GET", SERVER_URL + "/api/tags");
  xhr.send();
  showLoader();
  xhr.onload = () => {
    //отрисовка тегов
    // const tags = JSON.parse(xhr.response).data;
    // const tagsBox = document.querySelector(".select-of-box_js");
    // tags.forEach((tag) => {
    //   const tagHTML = createTag(tag);
    //   tagsBox.insertAdjacentHTML("beforeend", tagHTML);
    // });
    const params = getParamsFromLocation();
    // setDataToFilter(params);
    getData(params);
    hideLoader();
  };
})();
/////////////////////Функция получения данных из location.search///////////////
function getParamsFromLocation() {
  let searchParams = new URLSearchParams(location.search);
  return {
    tags: searchParams.getAll("tags"),
    views: searchParams.get("views"), //("filter")
    commentsCount: searchParams.getAll("commentsCount"), //("filter")
    limit: searchParams.get("limit"), //("filter")
    sort: searchParams.get("sort"),
    page: +searchParams.get("page") || 0,
    name: searchParams.get("name"),
  };
}
/////////////////////Функция  позволяет положить новые значения в searchParams///////////////
function setSearchParams(data) {
  let searchParams = new URLSearchParams();
  if (data.name) {
    searchParams.set("name", data.name);
  }
  if (data.tags) {
    data.tags.forEach((tags) => {
      searchParams.append("tags", tags);
    });
  }
  if (data.views) {
    data.views.forEach((views) => {
      searchParams.append("views", views);
    });
  }
  if (data.commentsCount) {
    data.commentsCount.forEach((commentsCount) => {
      searchParams.append("commentsCount", commentsCount);
    });
  }
  if (data.limit) {
    data.limit.forEach((limit) => {
      searchParams.append("limit", limit);
    });
  }
  if (data.sort) {
    searchParams.set("sort", data.sort);
  }
  if (data.page) {
    searchParams.set("page", data.page);
  } else {
    searchParams.set("page", 0);
  }
  history.replaceState(null, document.title, "?" + searchParams.toString());
  console.log("searchParams" + searchParams);
}
/////////////////////Функция выделение элементов верстки которые выбраны///////////////
function setDataToFilter(data) {
  console.log(data);
  filterForm.elements.filterTag.forEach((checkbox) => {
    checkbox.checked = data.tags.includes(checkbox.value);
  });
  filterForm.elements.filterViewsGroup.forEach((radio) => {
    radio.checked = data.views === radio.value;
  });
  filterForm.elements.filterComments.forEach((checkbox) => {
    checkbox.checked = data.commentsCount.includes(checkbox.value);
  });
  filterForm.elements.filterHowShowGroup.forEach((radio) => {
    radio.checked = data.limit === radio.value;
  });
  filterForm.elements.filterSortByGroup.forEach((radio) => {
    radio.checked = data.sort === radio.value;
  });
  filterForm.elements.filterName.value = data.name;
}
////////////////////////////////////////////////////////////
/////////////////////Функция получения постов///////////////
////////////////////////////////////////////////////////////
function getData(params) {
  const result = document.querySelector(".result_js");
  let xhr = new XMLHttpRequest();
  let searchParams = new URLSearchParams();
  searchParams.set("v", "1.0.0");
  //////////////////////////////////////////
  ////////////Реализация фильтров///////////

  //по тегу//
  if (params.tags && Array.isArray(params.tags) && params.tags.length) {
    searchParams.set("tags", JSON.stringify(params.tags));
  }
  ////////по просмотрам и комментариям//////////
  let filter = {};
  //по просмотрам
  if (params.views) {
    filter.views = {
      $between: [+params.views.split("-")[0], +params.views.split("-")[1]],
    };
  }
  //формируем объект чекбоксов с комментариями///
  let maxComments, minComments;
  // console.log(params);
  let commentsArr = params.commentsCount;

  if (commentsArr[0] === "0" && commentsArr.length === 1) {
    minComments = 0;
    maxComments = 0;
  } else if (commentsArr.length === 0) {
    minComments = 0;
    maxComments = 9999;
  } else {
    minComments = commentsArr[0].split("-")[0];
    maxComments = commentsArr[commentsArr.length - 1].split("-")[1];
  }

  filter.commentsCount = {
    $between: [minComments, maxComments],
  };
  //по нимени в строке запроса//
  if (params.name) {
    filter.title = params.name;
  }

  searchParams.set("filter", JSON.stringify(filter));
  //по кол-ву постов//
  let postLimit = (() => {
    if (+params.limit > 0) {
      return +params.limit;
    } else {
      return 20;
    }
  })();
  if (postLimit) {
    searchParams.set("limit", postLimit);
  }
  //по виду сортировки//
  if (params.sort) {
    searchParams.set("sort", JSON.stringify([params.sort, "DESC"]));
  }
  //по пропущенным постам (для пагинации)//
  if (+params.page) {
    searchParams.set("offset", +params.page * postLimit);
  }

  ///////////////////////////////////////////////////////////////////
  ////////////Запрос//////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  xhr.open("GET", SERVER_URL + "/api/posts?" + searchParams.toString());
  xhr.send();
  showLoader();
  result.innerHTML = "";
  paginationLinks.innerHTML = "";
  xhr.onload = () => {
    const response = JSON.parse(xhr.response);
    let dataPosts = "";
    response.data.forEach((post) => {
      dataPosts += cardCreate({
        title: post.title,
        text: post.text,
        src: post.photo.desktopPhotoUrl,
        tags: post.tags,
        date: post.date,
        commentsCount: post.commentsCount,
        views: post.views,
      });
    });
    result.innerHTML = dataPosts;
    const pageCount = Math.ceil(response.count / postLimit);

    for (let i = 0; i < pageCount; i++) {
      const link = linkElementCreate(i);
      paginationLinks.insertAdjacentElement("beforeend", link);
    }
    btnSliding();
    hideLoader();
  };
}

////////////////////////////////////////////////////////////////////////
/////////////////////Функция создания ссылки для пагинации//////////////
function linkElementCreate(page) {
  const link = document.createElement("a");
  link.href = "?page=" + page;
  link.innerText = page + 1;
  link.classList.add("my-blog__link_js");

  let params = getParamsFromLocation();
  if (page === +params.page) {
    link.classList.add("my-blog__pagination-active_js");
  }

  link.addEventListener("click", (e) => {
    e.preventDefault();
    const links = document.querySelectorAll(".my-blog__link_js");
    let searchParams = new URLSearchParams(location.search);
    let params = getParamsFromLocation();
    links[params.page].classList.remove("my-blog__pagination-active_js");
    searchParams.set("page", page);
    links[page].classList.add("my-blog__pagination-active_js");
    history.replaceState(null, document.title, "?" + searchParams.toString());
    getData(getParamsFromLocation());
  });

  // console.log(link);
  return link;
}

/////////////////////////////////////////////////////////////////////
/////////////////////Функция создания верстки карточек///////////////
//////////////////////////////////////////////////////////////////////
function cardCreate({ title, text, src, tags, commentsCount, views, date }) {
  return `
  <div class="my-blog__article">
    <div class="my-blog__card">
      <img src="${SERVER_URL}${src}" class="my-blog__card-img" alt="${title}">
      <div class="my-blog__card-body">
        <ul class="my-blog__card-tag-list">
        ${tags
          .map(
            (tag) =>
              `<li class="my-blog__card-tag" style="background-color: ${tag.color}"></li>`
          )
          .join(" ")}
        </ul>
        <div class="my-blog__card-other">
          <div class="my-blog__card-date">${modifDate(date)}</div>
          <div class="my-blog__card-views">${views} views</div>
          <div class="my-blog__card-comments">${commentsCount} comments</div>
        </div>
        <h5 class="my-blog__card-title">${title}</h5>        
        <p class="my-blog__card-text">${text}</p>
        <a href="#" class="my-blog__card-post-link">Go to this post</a>
       
      </div>
    </div>
    <style>
    
    </style>
  </div> `;
}
/////////////////////////////////////////////////////
///////////////Управление стрелками//////////////////
///////////////////////////////////////////////////////
function btnSliding() {
  const params = getParamsFromLocation();
  console.log(params);
  const links = [...document.querySelectorAll(".my-blog__link_js")];
  console.log(links);
  if (links.length <= 1) {
    myBlogBtnLeft.setAttribute("disabled", "disabled");
    myBlogBtnRight.setAttribute("disabled", "disabled");
  } else {
    if (params.page === 0) {
      myBlogBtnLeft.setAttribute("disabled", "disabled");
      myBlogBtnRight.removeAttribute("disabled", "disabled");
    } else if (params.page === links.length - 1) {
      myBlogBtnRight.setAttribute("disabled", "disabled");
      myBlogBtnLeft.removeAttribute("disabled", "disabled");
    } else {
      myBlogBtnLeft.removeAttribute("disabled", "disabled");
      myBlogBtnRight.removeAttribute("disabled", "disabled");
    }
  }
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  myBlogBtnLeft.addEventListener("click", () => {
    let params = getParamsFromLocation();
    const links = [...document.querySelectorAll(".my-blog__link_js")];
    let searchParams = new URLSearchParams(location.search);

    if (links[params.page]) {
      links[params.page].classList.remove("my-blog__pagination-active_js");
    }
    if (links[params.page]) {
      links[params.page - 1].classList.add("my-blog__pagination-active_js");
    }
    searchParams.set("page", params.page - 1);

    // history.replaceState(null, document.title, "?" + searchParams.toString());
    location.search = searchParams;
  });
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  myBlogBtnRight.addEventListener("click", () => {
    let params = getParamsFromLocation();
    const links = [...document.querySelectorAll(".my-blog__link_js")];
    let searchParams = new URLSearchParams(location.search);

    if (links[params.page]) {
      links[params.page].classList.remove("my-blog__pagination-active_js");
    }
    if (links[params.page]) {
      links[params.page + 1].classList.add("my-blog__pagination-active_js");
    }
    searchParams.set("page", params.page + 1);

    // history.replaceState(null, document.title, "?" + searchParams.toString());
    location.search = searchParams;
  });
}

/////////////////////////////////////////////////////////////////////
/////////////////////Реализация сброса (Reset)////////////////////////
//////////////////////////////////////////////////////////////////////

resetButton.addEventListener("click", resetFilter);

function resetFilter() {
  const resetInput = (gInputs) => {
    console.log(gInputs.length);
    if (gInputs.length) {
      for (let input of gInputs) {
        input.checked = false;
      }
    } else {
      gInputs.value = "";
    }
  };

  resetInput(filterForm.filterTag);
  resetInput(filterForm.filterViewsGroup);
  resetInput(filterForm.filterComments);
  resetInput(filterForm.filterHowShowGroup);
  resetInput(filterForm.filterSortByGroup);
  resetInput(filterForm.filterName);
}
