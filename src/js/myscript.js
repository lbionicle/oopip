//CARD_GOODS====================================================================================================

class GoodsCard {
    constructor(src, title, price, parentSelector, attr, ...classes) {
        this.src = src;
        this.title = title;
        this.price = price;
        this.classes = classes;
        this.attr = attr;
        this.parent = document.querySelector(parentSelector);
    }


    render() {
        const element = document.createElement('button');

        if (this.classes.length === 0) {
            this.classes = "goods-element";
            element.classList.add(this.classes);
            element.setAttribute(this.attr, "")
        } else {
            this.classes.forEach(className => {
                element.classList.add(className)
                element.setAttribute(this.attr, "")
            });
        }

        element.innerHTML = `
        <div class="element-img">
            <img src="${this.src}" alt="">
        </div>
        <div class="element-info">
            <div class="element-info-name">${this.title}</div>
            <div class="element-info-price">$${this.price}</div>
        </div>
        `;
        this.parent.append(element);
    }
}

new GoodsCard("../img/goods1.png", "Stacking pyramid", "10.00", ".goods-elements" , "data-goods", "goods-element").render();
new GoodsCard("../img/goods3.png", "Mini basketball", "9.00", ".goods-elements" , "data-goods", "goods-element").render();
new GoodsCard("../img/goods4.png", "Robot Transformer", "29.00", ".goods-elements" , "data-goods", "goods-element").render();

//POPUP_GOODS====================================================================================================

// class BigGoodsCard {
//     constructor(src, title, price, article, stock, descr, parentSelector, ...classes) {
//         this.src = src;
//         this.title = title;
//         this.article = article;
//         this.stock = stock;
//         this.descr = descr;
//         this.price = price;
//         this.classes = classes;
//         this.attr = attr;
//         this.parent = document.querySelector(parentSelector);
//     }


//     render() {
//         const element = document.createElement('div');

//         if (this.classes.length === 0) {
//             this.classes = "popup__content";
//             element.classList.add(this.classes);
//             element.setAttribute(this.attr, "")
//         } else {
//             this.classes.forEach(className => {
//                 element.classList.add(className)
//                 element.setAttribute(this.attr, "")
//             });
//         }
//         element.innerHTML = `
//         <button data-close type="button" class="popup__close"><img src="../img/close.svg" alt=""></button>
//         <div class="popup-content-img">
//             <img class="popup-content-img" src="${this.src}" alt="">
//         </div>
//         <div class="popup-content-info">
//             <div class="popup-content-title">${this.title}</div>
//             <div class="popup-content-article">Article: <span>${this.article}</span></div>
//             <div class="popup-content-stock">Stock: <span>${this.stock}</span></div>
//             <div class="popup-content-price">$${this.price}</div>
//             <div class="popup-divider"></div>
//             <div class="popup-content-titledescr">Short Description:</div>
//             <div class="popup-content-subdescrp">${this.descr}</div>
//             <div class="popup-content-orderpanel">
//                 <div class="orderpanel-count">
//                     <button class="orderpanel-removeGoods"><img src="../img/minus.svg" alt=""></button>
//                     <div class="orderpanel-countGoods">1</div>
//                     <button class="orderpanel-addGoods"><img src="../img/plus.svg" alt=""></button>
//                 </div>
//                 <button class="orderpanel-goOrder">Buy now</button>
//                 <button class="orderpanel-cart">Add to cart</button>
//             </div>
//         </div>
//         </div>
//         `;
//         this.parent.innerHTML = ``;
//         this.parent.append(element);
//     }
// }

function renderPopup(src, title, price, article, stock, descr) {
    document.querySelector("img.popup-content-img").src = src;
    document.querySelector(".popup-content-title").textContent = title;
    document.querySelector(".popup-content-price").textContent = "$" + price;
    document.querySelector(".popup-content-article > span").textContent = article;
    document.querySelector(".popup-content-stock > span").textContent = stock;
    document.querySelector(".popup-content-subdescrp").textContent = descr;
    document.querySelector(".orderpanel-countGoods").textContent = 1;
}
//GOODS====================================================================================================

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

//POPUP====================================================================================================


const popup = document.querySelectorAll('[data-goods]');
const addGoods = document.querySelector(".orderpanel-addGoods");
const removeGoods = document.querySelector(".orderpanel-removeGoods");
const countGoods = document.querySelector(".orderpanel-countGoods");
const stockGoods = document.querySelector(".popup-content-stock");
const cartGood = document.querySelectorAll(".cart-header")

const userAuth = document.querySelectorAll(".user-header");

function addPopup(elemPop, data, id) {
    elemPop.forEach((elem) => {
        elem.setAttribute(data, id)
        elem.classList.add("link")
        elem.addEventListener("click", () => {
            renderPopup("../img/biggoods1.png", "LEGO bricks set", "20.00", "1995751877966", "13", "This 234-piece set includes bright and colorful LEGO-style bricks in a variety of shapes and sizes. Build anything from simple structures to elaborate townscapes to boost creativity. These chunky plastic bricks snap satisfyingly together and pull easily apart for frustration-free construction play. Big enough for little hands but still compatible with major brands, this budget-friendly builder set makes the perfect STEM learning toy.");
        })
    })
}

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

addPopup(cartGood, "data-popup", "#popup-cart")
addPopup(popup, "data-popup", "#popup-goods")
addPopup(userAuth, "data-popup", "#popup-auth")
console.log(userAuth)
//REGISTER====================================================================================================

const enter_password = document.querySelectorAll(".auth-enter-password");
const login_popup = document.getElementById("login-auth-user");
const reg_popup = document.getElementById("reg-auth-user");
const auth_login_btns = document.querySelectorAll(".login-auth")  
const auth_reg_btns = document.querySelectorAll(".register-auth")  

const btn_log = document.querySelector("#btn-hide-log");
const btn_reg = document.querySelector("#btn-hide-reg");


auth_login_btns.forEach((elem) => {
    elem.addEventListener("click", () => {
        login_popup.style.display = "flex";
        reg_popup.style.display = "none";
    })
})

auth_reg_btns.forEach((elem) => {
    elem.addEventListener("click", () => {
        login_popup.style.display = "none";
        reg_popup.style.display = "flex";
    })
})

enter_password.forEach((elem) => {
    elem.addEventListener("click", (e) => {
        if (e.target.id == "btn-hide-log") {
            e.preventDefault();
            const log_1 = document.querySelector("#log-1");

            log_1.type == "password" ? log_1.type = "text" : log_1.type = "password";
            log_1.type == "password" ? btn_log.classList.remove("show-auth") : btn_log.classList.add("show-auth");
        } else if (e.target.id == "btn-hide-reg") {
            e.preventDefault();
            const reg_1 = document.querySelector("#reg-1")

            reg_1.type == "password" ? reg_1.type = "text" : reg_1.type = "password";        
            reg_1.type == "password" ? btn_reg.classList.remove("show-auth") : btn_reg.classList.add("show-auth");
        }
    }) 
})
//====================================================================================================
