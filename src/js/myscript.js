//====================================================================================================
const btnFilterAge = document.querySelectorAll(".filter-item");
const btnCategories = document.querySelectorAll(".goods-category-item");
const pagination = document.querySelectorAll(".row-pagination-elements > *");
const pages = document.querySelectorAll(".pagination-element");

let pageOfGoods = 0

// Обновляет цифры в пагинации
function updatePage(elem){
    pages.forEach((btn) => {
        btn.classList.remove("pagination-active")
    })
    if (typeof elem == "number") {
        pages.item(elem).classList.add("pagination-active")
    } else {
        elem.classList.add("pagination-active")
    }

}

// Я добавляю класс active элементам
function show(element, classelem) {
    element.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            element.forEach((btn) => {
                btn.classList.remove(classelem)
            })
            e.target.classList.add(classelem)
        })
    })
}

pagination.forEach((btn) => {
    if (btn.id == "next-list") {
        btn.addEventListener("click", () => {
            if (pageOfGoods !== 3) {
                ++pageOfGoods;
            } else if (pages.item(0).textContent != "999"){ // УКАЖИ ПОТОМ МАКСИМУМ ИЗ БД, КОТОРЫЙ МОЖЕТ ПРИЛЕТЕТЬ
                pageOfGoods = 0
                pages.forEach((btn) => {
                    btn.textContent = parseInt(btn.textContent.match(/\d+/)) + 4
                })
            }
            updatePage(pageOfGoods)
        })
    } else if (btn.id == "prev-list") {
        btn.addEventListener("click", () => {
            if (pageOfGoods !== 0) {
                --pageOfGoods;
            } else if (pages.item(0).textContent != "1") {
                pageOfGoods = 3
                pages.forEach((btn) => {
                    btn.textContent = parseInt(btn.textContent.match(/\d+/)) - 4
                })
            }
            updatePage(pageOfGoods)
        })
    } else {
        btn.addEventListener("click", (e) => {
            updatePage(e.target)
            pageOfGoods = parseInt(e.target.id.match(/\d+/)) - 1
        })
    }
})

show(btnFilterAge, "active");
show(btnCategories, "category-active");
//====================================================================================================

const popup = document.querySelectorAll('[data-goods]');
const addGoods = document.querySelector(".orderpanel-addGoods");
const removeGoods = document.querySelector(".orderpanel-removeGoods");
const countGoods = document.querySelector(".orderpanel-countGoods");
const stockGoods = document.querySelector(".popup-content-stock");

addGoods.addEventListener("click", () => {
    if (parseInt(countGoods.textContent.match(/\d+/)) != parseInt(stockGoods.textContent.match(/\d+/))) {
        countGoods.textContent = parseInt(countGoods.textContent.match(/\d+/)) + 1
    }
})

removeGoods.addEventListener("click", () => {
    if (parseInt(countGoods.textContent.match(/\d+/)) != 1) {
        countGoods.textContent = parseInt(countGoods.textContent.match(/\d+/)) - 1
    }
})

popup.forEach((elem) => {
    elem.setAttribute("data-popup", "#popup")
    elem.classList.add("link")
})
console.log(addGoods)