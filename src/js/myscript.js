const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        body: data,
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json'
          })
    });

    return await res.json();
};

function showUserInfo() {
    const jsonFirst = JSON.stringify({"token" : localStorage.getItem("session")});

    postData("http://192.168.100.13:8008/token", jsonFirst).then(json => {
        const allPersonalForms = document.querySelectorAll(".defForm");

        allPersonalForms[0].value = json["First_Name"]
        allPersonalForms[1].value = json["Last_Name"]
        allPersonalForms[2].value = json["email"]
    })
}

function showUserAddress(class_check) {
    const jsonFirst = JSON.stringify({"token" : localStorage.getItem("session")});

    postData("http://192.168.100.13:8008/token", jsonFirst).then(json => {
        const allPersonalForms = document.querySelectorAll(class_check);

        allPersonalForms[0].value = json["First_Name"]
        allPersonalForms[1].value = json["Last_Name"]
        allPersonalForms[2].value = json["Country"]
        allPersonalForms[3].value = json["Town"]
        allPersonalForms[4].value = json["Address"]
        allPersonalForms[5].value = json["State"]
        allPersonalForms[6].value = json["Zip"]
        allPersonalForms[7].value = json["email"]
    })
}
//CHECK=GOOD=IN=CART====================================================================================================

function checkGoodsInCart(element) {

    const uniqueNames = new Set();

    let nameOfGoods = "";

    element.classList.contains("goods-element") ? nameOfGoods = element.querySelector(".element-info").querySelector(".element-info-name").textContent : nameOfGoods = element.querySelector(".popup-content-title").textContent;

    const nowCart = document.querySelector("#shopCart").querySelectorAll(".body-info-title");

    nowCart.forEach((elem) => {
        uniqueNames.add(elem.textContent.trim())
    })
    //Потом заменить на nameOfGoods и оно будет из
    return uniqueNames.has(nameOfGoods)
}

//SHIPPING=======================================================================================================================

if(document.getElementsByTagName("body")[0].classList.contains("shipping.html")) {

    showUserAddress(".defShipping");

    const radios = document.getElementsByName("choice-pay");

    function check(){
        if(radios[0].checked){
        radios[0].parentElement.style.borderColor = "#46A358";

        radios[1].checked = false
        radios[1].parentElement.style.borderColor = "#EAEAEA"; 
        } else {
            radios[1].parentElement.style.borderColor = "#46A358"; 

            radios[0].checked = false
            radios[0].parentElement.style.borderColor = "#EAEAEA";     }
    }

    radios.forEach((elem) => {
        console.log(elem.parentElement)
        elem.parentElement.addEventListener("click", (e) => {
            e.target.parentElement.getElementsByTagName("input")[0].checked = true
            check();
        })
    })

}

//CART_GOODS====================================================================================================

const cart_goods = document.querySelectorAll(".cart-goods-body");
const subtotalCart = document.querySelectorAll(".info-calcs-subt > span");
const shippingCart = document.querySelectorAll(".info-calcs-ship > span");
const totalCart = document.querySelectorAll(".cart-info-total > span");
let i = 0;

const initialState = () => {
    if (localStorage.getItem('products') !== null) {
        document.querySelectorAll('.cart-goods-body').forEach((elem) => {
            cartIsEmpty();
            elem.innerHTML = localStorage.getItem('products');
            sumTotal();
        })
    }
};

const updateStorage = () => {
    const parent1 = document.querySelector("#shopCart");
    
    let html1 = parent1.innerHTML;

    html1 = html1.trim();

    if (html1.length) {
        localStorage.setItem('products', html1);
    } else {
        localStorage.removeItem('products');
    }
};

function sumTotal() {

    let totalShop = 0

    document.querySelector("#shopCart").querySelectorAll(".goods-body-good").forEach((elem) => {
        totalShop += Number(elem.getElementsByClassName("goods-body-total")[0].textContent.slice(1, -3))
        
        shippingCart.forEach((elem) => {
            elem.textContent = "$15.00"
        })
    })

    subtotalCart.forEach((elem) => {
        elem.textContent = "$" + totalShop.toFixed(2)
    })
    totalCart.forEach((elem) => {
        elem.textContent = "$" + (totalShop + Number(shippingCart[0].textContent.slice(1, -3))).toFixed(2)
    })
}
initialState();

function cartIsEmpty() {
    if (document.querySelectorAll("#shopCart > .goods-body-good").length == 0) {
        document.querySelectorAll(".goods-body-showempty").forEach((elem) => elem.innerHTML = `
        <div id="emptyCart" style="font-size: 18px; display: flex; flex-direction: column; flex: 0 1 100%; justify-content: center; height: 185px; align-items:center; text-align: center">Cart is empty!</div>
        `)
        shippingCart.forEach((elem) => elem.textContent = "$0.00");
        sumTotal();
    } else {
        document.querySelectorAll(".goods-body-showempty").forEach((elem) => elem.innerHTML = "")
    }
}

cartIsEmpty();

class CartItem {
    constructor(srcImg, title, stock, price, quantity, parentSelector, ...classes) {
        this.src = srcImg;
        this.title = title;
        this.stock = stock
        this.price = price.toFixed(2);
        this.classes = classes;
        this.quantity = quantity
        this.parent = document.querySelectorAll(parentSelector);
        this.calcTotal();
    }

    calcTotal() {
        this.total = (Number(this.price) * Number(this.quantity)).toFixed(2); 
    }
    render() {
        const element = document.createElement('div');

        if (this.classes.length === 0) {
            element.classList.add("goods-body-good");
            element.setAttribute("data-item", Date.now());
        } else {
            this.classes.forEach(className => {
                element.classList.add(className)
            });
        }

        element.innerHTML = `
        <div style="display: flex; flex-wrap: nowrap;" class="goods-elem">						
        <div style="background-image: url(${this.src})" class="goods-body-img"></div>
        <div class="goods-body-info">
            <div class="body-info-title">${this.title}</div>
            <div class="body-info-stock">Stock:<span>${this.stock}</span></div>
        </div></div>
        <div class="goods-body-price">$${this.price}</div>
        <div class="goods-body-count">
            <button style="background-image: url(../img/small-minus.svg)" class="body-removeGoods"></button>
            <div class="body-countGoods">${this.quantity}</div>
            <button style="background-image: url(../img/small-plus.svg)" id="addGoodsCart" class="body-addGoods"></button>
        </div>
        <div class="goods-body-total">$${this.total}</div>
        <button id="del" class="goods-body-delelem"></button>
        `;

        this.parent.forEach((par) => {
            par.append(element);
        })
    }
}


// setTimeout(function addCartFromDB() {
//     if (i != 10) {
//         new CartItem('img/goods1.png', "Robot Transformer", 13, 200.00, 2, ".cart-goods-body").render() // можно попробовать вставлять 
//         cartIsEmpty();
//         sumTotal();
//         updateStorage();
//         i++;
//     }
//         setTimeout(addCartFromDB, 2)
//     }, 2);

cart_goods.forEach((elem) => elem.addEventListener("click", (e) => {
    e.preventDefault()

    if (e.target.id == "del") {

        e.target.parentElement.remove();

        updateStorage();
        initialState();
        cartIsEmpty();
        sumTotal();


    } else if (e.target.classList.contains("body-addGoods")) {

        const price = e.target.parentElement.parentElement.getElementsByClassName("goods-body-price")[0]
        const quantity = e.target.parentElement.parentElement.getElementsByClassName("body-countGoods")[0]
        const total = e.target.parentElement.parentElement.getElementsByClassName("goods-body-total")[0]
       
        if (Number(quantity.textContent) != Number(e.target.parentElement.parentElement.getElementsByTagName("SPAN")[0].textContent)) {
            quantity.textContent = Number(quantity.textContent) + 1
            total.textContent = "$" + (Number(price.textContent.slice(1, -3)) * Number(quantity.textContent)).toFixed(2)

            updateStorage();
            initialState();
            sumTotal();

        }


    } else if (e.target.classList.contains("body-removeGoods")) {

        const price = e.target.parentElement.parentElement.getElementsByClassName("goods-body-price")[0]
        const quantity = e.target.parentElement.parentElement.getElementsByClassName("body-countGoods")[0]
        const total = e.target.parentElement.parentElement.getElementsByClassName("goods-body-total")[0]

        if (Number(quantity.textContent) > 1) {

            quantity.textContent = Number(quantity.textContent) - 1
            total.textContent = "$" + (Number(price.textContent.slice(1, -3)) * Number(quantity.textContent)).toFixed(2)

            updateStorage();
            initialState();
            sumTotal();

        }

    }
}))
//CARD_GOODS====================================================================================================

if(document.getElementsByTagName("body")[0].classList.contains("index_html")) {
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
                element.setAttribute(this.attr, "");
            } else {
                this.classes.forEach(className => {
                    element.classList.add(className)
                    element.setAttribute(this.attr, "")
                });
            }
    
            element.innerHTML = `
            <div style="background-image: url(${this.src})" class="element-img"></div>
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
}

//POPUP_GOODS====================================================================================================

class BigGoodsCard {
    constructor(src, title, price, article, stock, descr, parentSelector, ...classes) {
        this.src = src;
        this.title = title;
        this.article = article;
        this.stock = stock;
        this.descr = descr;
        this.price = price.toFixed(2);
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
    }


    render() {
        const element = document.createElement('div');

        if (this.classes.length === 0) {
            this.classes = "popup__content";
            element.classList.add(this.classes);
        } else {
            this.classes.forEach(className => {
                element.classList.add(className)
            });
        }
        element.innerHTML = `
        <button data-close type="button" class="popup__close"><img src="../img/close.svg" alt=""></button>
        <div class="popup-content-img">
            <img class="popup-content-img" src="${this.src}" alt="">
        </div>
        <div class="popup-content-info">
            <div class="popup-content-title">${this.title}</div>
            <div class="popup-content-article">Article: <span>${this.article}</span></div>
            <div class="popup-content-stock">Stock: <span>${this.stock}</span></div>
            <div class="popup-content-price">$${this.price}</div>
            <div class="popup-divider"></div>
            <div class="popup-content-titledescr">Short Description:</div>
            <div class="popup-content-subdescrp">${this.descr}</div>
            <div class="popup-content-orderpanel">
                <div class="orderpanel-count">
                    <button class="orderpanel-removeGoods"><img src="../img/minus.svg" alt=""></button>
                    <div class="orderpanel-countGoods">1</div>
                    <button class="orderpanel-addGoods"><img src="../img/plus.svg" alt=""></button>
                </div>
                <button class="orderpanel-goOrder btn-activate">Buy now</button>
                <button class="orderpanel-cart btn-activate-text">Add to cart</button>
            </div>
        </div>
        </div>
        `;
        this.parent.innerHTML = ``;
        this.parent.append(element);
    }
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

const popup = document.querySelector('.goods-elements');

const cartGood = document.querySelectorAll(".cart-header");
const userAuth = document.querySelectorAll(".user-header");


function addPopup(elemPop, data, id) {
    elemPop.forEach((elem) => {
        elem.setAttribute(data, id)
        elem.classList.add("link")
    })
}

if(document.getElementsByTagName("body")[0].classList.contains("index_html")) {
    popup.addEventListener("click", (e) => {
        const parent = e.target.parentElement;


        if(parent.classList.contains("goods-element")) {
            
            new BigGoodsCard(
                "../img/biggoods1.png",
                parent.querySelector(".element-info-name").textContent.trim(),
                100.00,
                125125123,
                22,
                "loresdgsdgsdf",
                "#bigGoods"
                ).render();


            parent.setAttribute("data-popup", "#popup-goods");
            parent.setAttribute("data-close", "");


            const addGoods = document.querySelector(".orderpanel-addGoods");
            const removeGoods = document.querySelector(".orderpanel-removeGoods");
            const countGoods = document.querySelector(".orderpanel-countGoods");
            const stockGoods = document.querySelector(".popup-content-stock");
            const addToCart = document.querySelectorAll(".orderpanel-cart");
            const goOrder = document.querySelector(".orderpanel-goOrder");

            if (checkGoodsInCart(parent)) {
                addToCart[0].textContent = "In cart"
                addPopup(addToCart, "data-popup", "#popup-cart");
            } else {
                addToCart[0].removeAttribute("data-popup")
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
            
            goOrder.addEventListener("click", (e) => {
                const parent = e.target.parentElement.parentElement.parentElement
                console.log(parent)

                if (parent.querySelector(".popup-content-info").querySelector(".popup-content-orderpanel").querySelector(".orderpanel-cart").textContent.toLowerCase().trim() == "add to cart") {
                    new CartItem(
                        parent.getElementsByClassName("popup-content-img")[0].getElementsByTagName("IMG")[0].src, 
                        parent.getElementsByClassName("popup-content-title")[0].textContent,
                        Number(parent.getElementsByClassName("popup-content-stock")[0].getElementsByTagName("SPAN")[0].textContent),
                        Number(parent.getElementsByClassName("popup-content-price")[0].textContent.slice(1, -3)),
                        Number(parent.getElementsByClassName("orderpanel-countGoods")[0].textContent),
                        ".cart-goods-body")
                        .render()
                
                    updateStorage();
                    initialState();
                    cartIsEmpty();
                    sumTotal();
                }
            
                window.location.href = "../shipping.html";
            
            })
            
            addToCart[0].addEventListener("click", (e) => {
                const parent = e.target.parentElement.parentElement.parentElement

                console.log(parent)

                if (parent.querySelector(".popup-content-info").querySelector(".popup-content-orderpanel").querySelector(".orderpanel-cart").textContent.toLowerCase().trim() == "add to cart") {
                    new CartItem(
                        parent.getElementsByClassName("popup-content-img")[0].getElementsByTagName("IMG")[0].src, 
                        parent.getElementsByClassName("popup-content-title")[0].textContent,
                        Number(parent.getElementsByClassName("popup-content-stock")[0].getElementsByTagName("SPAN")[0].textContent),
                        Number(parent.getElementsByClassName("popup-content-price")[0].textContent.slice(1, -3)),
                        Number(parent.getElementsByClassName("orderpanel-countGoods")[0].textContent),
                        ".cart-goods-body")
                        .render()
                
                    updateStorage();
                    initialState();
                    cartIsEmpty();
                    sumTotal();

                    if (checkGoodsInCart(parent)) {
                        addToCart[0].textContent = "In cart";
                        addPopup(addToCart, "data-popup", "#popup-cart");
                    } else {
                        addToCart[0].removeAttribute("data-popup")
                    }
                }
            })
        }
    })
}

addPopup(cartGood, "data-popup", "#popup-cart")

if(localStorage.getItem("session") == null) {
    addPopup(userAuth, "data-popup", "#popup-auth")
} else {
    const jsonFirst = JSON.stringify({"token" : localStorage.getItem("session")});

    postData("http://192.168.100.13:8008/token", jsonFirst)
    .then(json => {
        if (json["SuperUser"]) {
            document.querySelector("#user-account-btn").href = "../admin.html"
        } else {
            document.querySelector("#user-account-btn").href = "../user.html"
        }
    })
}
//REGISTER====================================================================================================

const enter_password = document.querySelectorAll(".auth-enter-password");
const login_popup = document.getElementById("login-auth-user");
const reg_popup = document.getElementById("reg-auth-user");
const auth_login_btns = document.querySelectorAll(".login-auth")  
const auth_reg_btns = document.querySelectorAll(".register-auth")  

const btn_log = document.querySelector("#btn-hide-log");
const btn_reg = document.querySelector("#btn-hide-reg");

if(document.getElementsByTagName("body")[0].classList.contains("user-acc")) {
    const user_pass = document.querySelector(".user-auth-forms");

    user_pass.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.classList.contains("password-checker")) {
            const parent = e.target.parentElement.querySelector(".defForm")

            parent.type == "password" ? parent.type = "text" : parent.type = "password";        
            parent.type == "password" ? e.target.style.backgroundImage = `url("../img/Hide.svg")` : e.target.style.backgroundImage = `url("../img/show.svg")`;
        }
    })
}


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
//ORDERS====================================================================================================
const user_pages = document.querySelector(".user-auth-pages");
const user_forms = document.querySelector(".user-auth-forms");

class Order {
    constructor(srcImg, title, article, status, dateDelivery, dateSale, amount, total, parentSelector, ...classes) {
        this.src = srcImg;
        this.title = title;
        this.article = article;
        this.total = total.toFixed(2);
        this.classes = classes;
        this.amount = amount;
        this.status = status;
        this.dateDelivery = dateDelivery;
        this.dateSale = dateSale;
        this.parent = document.querySelectorAll(parentSelector);
        this.fullDate();
    }

    fullDate() {

        function fd(data, delivery = false) {
            let month = data.getUTCMonth() + 1;
            let day = delivery ? data.getUTCDate() + 7: data.getUTCDate();
            let year = data.getUTCFullYear();

            return `${day}.${month}.${year}`
        }

        this.dateDelivery = fd(new Date(this.dateDelivery), true);
        this.dateSale = fd(new Date(this.dateSale));
    }

    render() {
        const element = document.createElement('div');

        if (this.classes.length === 0) {
            element.classList.add("forms-body-good");
        } else {
            this.classes.forEach(className => {
                element.classList.add(className)
            });
        }

        if(this.status.toLowerCase() == "delivered") {
            this.color = "greenStatus";
        } else if (this.status.toLowerCase() == "canceled") {
            this.color = "redStatus";
        } else {
            this.color = "defaultStatus";
        }

        element.innerHTML = `
        <div class="body-good-info">
            <div style="background-image = url('${this.src}')" class="body-good-img"></div>
            <div class="body-good-blocktext">
                <div class="good-info-titleorder">${this.title}</div>
                <div class="good-info-article">Article: <span>${this.article}</span></div>
            </div>
        </div>
        <div class="body-good-status">${this.status}</div>
        <div class="body-good-datadelivery">${this.dateDelivery}</div>
        <div class="body-good-datasale">${this.dateSale}</div>
        <div class="body-good-amount">(x <span>${this.amount}</span>)</div>
        <div class="body-good-subtotal">$${this.total}</div>
            `;

        this.parent.forEach((par) => {
            element.querySelector(".body-good-status").classList.add(this.color);
            par.append(element);
        })
    }
}


//USER_ACC====================================================================================================

if(document.getElementsByTagName("body")[0].classList.contains("user-acc")) {

showUserInfo();

function clear_active_pages() {
    user_pages.querySelectorAll(".user-pages").forEach((elem) => {
    if (elem.classList.contains("user-pages-address")) {
        elem.classList.remove("active-page")
        elem.children[0].style.backgroundImage = `url("../img/location.svg")`
    } else if (elem.classList.contains("user-pages-details")) {
        elem.classList.remove("active-page")
        elem.children[0].style.backgroundImage = `url("../img/user-acc.svg")`
    } else if (elem.classList.contains("user-pages-orders")) {
        elem.classList.remove("active-page")
        elem.children[0].style.backgroundImage = `url("../img/shopcart.svg")`
    }
})
}

user_pages.addEventListener("click", (e) => {

    function check(url) {
        e.preventDefault();
        clear_active_pages();
        e.target.classList.add("active-page")
        e.target.children[0].style.backgroundImage = `url(${url})` 
    }

    if (e.target.classList.contains("user-pages-address")) {
        check("../img/location-active.svg")
        user_forms.innerHTML = `
        <div class="auth-forms-title">Billing Address</div>
        <form action="" method="post" class="user_form_details">
            <div class="inputbox_user"><input type="text" name="first_name" class="defForm" required><label for="first_name" class="textinputbox">First Name <span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="last_name" class="defForm" required><label for="last_name" class="textinputbox">Last Name <span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="country" class="defForm" required><label for="country" class="textinputbox">Country / Region <span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="town" class="defForm" required><label for="town" class="textinputbox">Town / City <span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="address" class="defForm" required><label for="address" class="textinputbox">Street Address<span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="state" class="defForm" required><label for="state" class="textinputbox">State <span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="zip" class="defForm" required><label for="zip" class="textinputbox">Zip <span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="email" class="defForm" disabled><label for="email" class="textinputbox">Email address</label></div>
            <button type="submit" class="btn-submit">Save Change</button>
        </form>
        `
        showUserAddress(".defForm");
    
        const parent = e.target.parentElement.parentElement.parentElement.querySelector(".user-auth-forms").querySelector(".user_form_details")

        document.querySelector(".btn-submit").addEventListener("click", (e) => {
            e.preventDefault();

            const formData = new FormData(e.target.parentElement.parentElement.parentElement.querySelector(".user-auth-forms").querySelector(".user_form_details"));

            const jsonFirst = JSON.stringify(Object.assign({}, {"user_token": localStorage.getItem("session"), "blocked": false, "superuser": false}, Object.fromEntries(formData.entries())));
            
            postData("http://192.168.100.13:8008/edituser", jsonFirst).then(json => window.location.reload())
        })

    } else if (e.target.classList.contains("user-pages-details")) {
        check("../img/user-acc-active.svg")
        user_forms.innerHTML = `
        <div class="auth-forms-title">Personal Information</div>
        <form action="" method="post" class="user_form_details">
            <div class="inputbox_user"><input type="text" name="firstname" class="defForm" required><label for="firstname" class="textinputbox">First Name <span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="lastname" class="defForm" required><label for="lastname" class="textinputbox">Last Name <span>*</span></label></div>
            <div class="inputbox_user"><input type="text" name="email" class="defForm" disabled><label for="email" class="textinputbox">Email address</label></div>
            <div class="change-password-user">
                <div class="password-user-title">Password change</div>
                <div class="inputbox_user"><input type="password" name="currpassword" class="defForm"><label for="currpassword" class="textinputbox">Current password</label>
                    <button class="password-checker hide-checker"></button>
                </div>
                <div class="inputbox_user"><input type="password" name="newpassword" class="defForm"><label for="newpassword" class="textinputbox">New password</label>
                    <button class="password-checker hide-checker"></button>
                </div>
                <div class="inputbox_user"><input type="password" name="confirmpassword" class="defForm"><label for="confirmpassword" class="textinputbox">Confirm new password</label>
                    <button class="password-checker hide-checker"></button>
                </div>
            </div>
            <button type="submit" class="btn-submit">Save Change</button>
        </form>
        `
        showUserInfo();

        const parent = e.target.parentElement.parentElement.parentElement.querySelector(".user-auth-forms").querySelector(".user_form_details")

        document.querySelector(".btn-submit").addEventListener("click", (e) => {
            e.preventDefault();

            const formData = new FormData(e.target.parentElement.parentElement.parentElement.querySelector(".user-auth-forms").querySelector(".user_form_details"));

            const jsonFirst = JSON.stringify(Object.assign({}, {"user_token": localStorage.getItem("session"), "blocked": false, "superuser": false}, Object.fromEntries(formData.entries())));
            
            postData("http://192.168.100.13:8008/edituser", jsonFirst).then(json => window.location.reload())
        })

    } else if (e.target.classList.contains("user-pages-orders")) {
        check("../img/shopcart-active.svg")
        user_forms.innerHTML = `
        <div class="auth-forms-title">Purchases</div>
        <div class="auth-goods-header">
            <div class="auth-header-item1 auth-header-item">Products</div>
            <div class="auth-header-item2 auth-header-item">Status</div>
            <div class="auth-header-item3 auth-header-item">Date of delivery</div>
            <div class="auth-header-item4 auth-header-item">Date of sale</div>
            <div class="auth-header-item5 auth-header-item">Amount</div>
            <div class="auth-header-item6 auth-header-item">Subtotal</div>

        </div>
        <div class="auth-forms-body">
        </div>
            `;
        if(document.getElementsByTagName("body")[0].classList.contains("user-acc")) {
            new Order(
                "../img/goods1.png", 
                "Stacking pyramid", 
                1995751877966, 
                "In delivery", 
                Date.now(),
                Date.now(),
                2,
                10.00, 
                ".auth-forms-body",
                ).render();
        }
    }  else if (e.target.classList.contains("user-pages-logout")) {
        e.preventDefault();
        localStorage.removeItem("session");
        window.location.href = "../index.html"
    }
})
}

//ADMIN_ACC====================================================================================================


if(document.getElementsByTagName("body")[0].classList.contains("admin-acc")) {

    class UserAccount {
        constructor(id, email, status, parentSelector, ...classes) {
           this.id = id;
           this.email = email;
           this.status = status;
           this.classes = classes;
           this.parent = document.querySelector(parentSelector).querySelectorAll(".admin-forms-body");
        }
    
        render() {
            const element = document.createElement('div');
    
            if (this.classes.length === 0) {
                element.classList.add("forms-body-userinfo");
            } else {
                this.classes.forEach(className => {
                    element.classList.add(className)
                });
            }
    
            if(this.status.toLowerCase() == "unblocked") {
                this.color = "unblocked";
            } else if (this.status.toLowerCase() == "blocked") {
                this.color = "blocked";
            }
    
            element.innerHTML = `
            <div class="body-userinfo-id">${this.id}</div>
            <div class="body-userinfo-email">${this.email}</div>
            <div class="body-userinfo-status">${this.status}</div>
            <div class="body-userinfo-opportunity">
                <button class="userinfo-opportunity-changer"></button>
                <button class="userinfo-opportunity-delete"></button>
            </div>
                `;
    
            this.parent.forEach((par) => {
                element.querySelector(".body-userinfo-status").classList.add(this.color);
                par.append(element);
            })
        }
    }
    new UserAccount(1, "user1@gmail.com", "Unblocked", ".admin-auth-block").render();
    new UserAccount(2, "user2@gmail.com", "Blocked", ".admin-auth-block").render();

    //Боковая панелька
    const user_pages = document.querySelector(".admin-auth-pages");
    const user_forms = document.querySelector(".admin-auth-block");

    function clear_active_pages_adm() {
        user_pages.querySelectorAll(".admin-pages").forEach((elem) => {
        if (elem.classList.contains("admin-pages-goods")) {
            elem.classList.remove("admin-active-page")
            elem.children[0].style.backgroundImage = `url("../img/box.svg")`
        } else if (elem.classList.contains("admin-pages-details")) {
            elem.classList.remove("admin-active-page")
            elem.children[0].style.backgroundImage = `url("../img/user-acc.svg")`
        } else if (elem.classList.contains("admin-pages-orders")) {
            elem.classList.remove("admin-active-page")
            elem.children[0].style.backgroundImage = `url("../img/shopcart.svg")`
        }
    })
    }
    
    user_pages.addEventListener("click", (e) => {
    
        function check(url) {
            e.preventDefault();
            clear_active_pages_adm();
            e.target.classList.add("admin-active-page")
            e.target.children[0].style.backgroundImage = `url(${url})` 
        }
    
        if (e.target.classList.contains("admin-pages-goods")) {
            check("../img/box-active.svg")
            user_forms.innerHTML = `
            `
        } else if (e.target.classList.contains("admin-pages-details")) {
            check("../img/user-acc-active.svg")
            user_forms.innerHTML = `
            <div class="admin-forms-title">Users</div>
            <div class="admin-users-header">
                <div class="admin-header-item1 admin-header-item">Id</div>
                <div class="admin-header-item3 admin-header-item">Email</div>
                <div class="admin-header-item4 admin-header-item">Status</div>
            </div>
            <div class="admin-forms-body">
            </div>
            `
            new UserAccount(1, "lastnamefirstname@gmail.com", "Unblocked", ".admin-auth-block").render();
            new UserAccount(2, "user2@gmail.com", "Blocked", ".admin-auth-block").render();
        } else if (e.target.classList.contains("admin-pages-orders")) {
            check("../img/shopcart-active.svg")
            user_forms.innerHTML = `
                `;
        } else if (e.target.classList.contains("admin-pages-logout")) {
            e.preventDefault();
            localStorage.removeItem("session");
            window.location.href = "../index.html"
        }
    })

    // Товарка

    user_forms.addEventListener("click", (e) => {
        
        if (e.target.classList.contains("userinfo-opportunity-delete")) {
            e.target.parentElement.parentElement.remove();
        } else {e.target.classList.contains("userinfo-opportunity-changer")} {
            e.target.parentElement.parentElement.querySelector(".userinfo-opportunity-changer").setAttribute("data-popup", "#popup-username");
        }

        const blocked = document.querySelector(".item-1");
        const unblocked = document.querySelector(".item-2");

        unblocked.addEventListener("click", (e) => {
            unblocked.classList.add("item-2-checked");
            blocked.classList.remove("item-1-checked");
            unblocked.getElementsByTagName("input").checked = true;
        })

        blocked.addEventListener("click", (e) => {
            blocked.classList.add("item-1-checked");
            unblocked.classList.remove("item-2-checked");
            blocked.getElementsByTagName("input").checked = true;
        })

    })


}

//BACKEND-REGISTER==================================================================================================

const btns_sumbit = document.querySelectorAll(".form_auth_button");

function sendRequest(parent, url) {
    const formData = new FormData(parent);

    const jsonFirst = JSON.stringify(Object.fromEntries(formData.entries()));

    postData(url, jsonFirst)
      .then(json => {
        if (url == "http://192.168.100.13:8008/login" && typeof(json) == "string") {
            localStorage.setItem("session", json);
            window.location.reload();
        }
      })

    parent.reset();
}

btns_sumbit.forEach((elem) => {
    elem.addEventListener("click", (e) => {
        e.preventDefault();

        if(elem.parentElement.id == "form_user_reg") {
            sendRequest(elem.parentElement, "http://192.168.100.13:8008/reg")
        } else if (elem.parentElement.id == "form_user_log") {
            sendRequest(elem.parentElement, "http://192.168.100.13:8008/login")
        }
    })
})
