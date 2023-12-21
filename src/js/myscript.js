const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        body: data,
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With"
          })
    });

    return await res.json();
};

function removeEmptyCarts(html) {

    const temp = document.createElement('div');
  
    temp.innerHTML = html;
  
    const emptyCarts = temp.querySelectorAll('.goods-body-showempty');
    emptyCarts.forEach(cart => cart.remove());
  
    return temp.innerHTML;
  
  }

function showUserInfo() {
    const jsonFirst = JSON.stringify({"token" : localStorage.getItem("session")});

    postData("http://localhost:8008/token", jsonFirst).then(json => {
        const allPersonalForms = document.querySelectorAll(".defForm");

        allPersonalForms[0].value = json["First_Name"]
        allPersonalForms[1].value = json["Last_Name"]
        allPersonalForms[2].value = json["email"]
    })
}
localStorage.setItem("products", removeEmptyCarts(localStorage.getItem("products")))

function showUserAddress(class_check) {
    if(localStorage.getItem("session")) {

        const jsonFirst = JSON.stringify({"token" : localStorage.getItem("session")});


        postData("http://localhost:8008/token", jsonFirst).then(json => {
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
        elem.parentElement.addEventListener("click", (e) => {
            e.target.parentElement.getElementsByTagName("input")[0].checked = true
            check();
        })
    })

    document.querySelector(".button-order").addEventListener("click", (e) => {
        e.preventDefault();

        const formData = new FormData(document.querySelector(".shipping_form_details"));

        const jsonFirst = JSON.stringify(Object.assign({}, {"html" : localStorage.getItem("products"), "user_token": localStorage.getItem("session")}, Object.fromEntries(formData.entries())));
        
        postData("http://localhost:8008/parse_cart", JSON.stringify({"token" : localStorage.getItem("session"), "html" : localStorage.getItem("products")}))
        .then(json => {
        })
        // postData("http://localhost:8008/edituser", jsonFirst)

        window.location.reload();
    })


}

function fd(data, delivery = false) {
    let month = data.getUTCMonth() + 1;
    let day = delivery ? data.getUTCDate() + 7: data.getUTCDate();
    let year = data.getUTCFullYear();

    return `${day}.${month}.${year}`
}

//CART_GOODS====================================================================================================
const cart_goods = document.querySelectorAll(".cart-goods-body");
const subtotalCart = document.querySelectorAll(".info-calcs-subt > span");
const shippingCart = document.querySelectorAll(".info-calcs-ship > span");
const totalCart = document.querySelectorAll(".cart-info-total > span");
let i = 0;

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

function cartIsEmpty() {
    document.querySelector("#emptyCart").style.display = "none";
    console.log(document.querySelector("#shopCart").childElementCount)
    if (document.querySelector("#shopCart").childElementCount == 1) {
        document.getElementById("emptyCart").style.display = "flex"
        shippingCart.forEach((elem) => elem.textContent = "$0.00");
        document.getElementById("order-btn").style.pointerEvents = "none"
        sumTotal();
    } else {
        document.getElementById("emptyCart").style.display = "none";
        document.getElementById("order-btn").style.pointerEvents = "auto"
        sumTotal();
    }
    localStorage.setItem("products", removeEmptyCarts(localStorage.getItem("products")))
}
if(document.getElementsByTagName("body")[0].classList.contains("shipping.html") || document.getElementsByTagName("body")[0].classList.contains("index_html")) {
    document.querySelector("#shopCart").innerHTML += removeEmptyCarts(localStorage.getItem("products"));
    cartIsEmpty();
    sumTotal();
}

class CartItem {
    constructor(srcImg, title, stock, price, quantity, attr, parentSelector, ...classes) {
        this.src = srcImg;
        this.title = title;
        this.stock = stock;
        this.attr = attr;
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
        <div style="display: none" class="goods-body-attr">${this.attr}</div>
        `;

        this.parent.forEach((par) => {
            par.append(element);
        })
    }
}

cart_goods.forEach((elem) => elem.addEventListener("click", (e) => {
    e.preventDefault()

    if (e.target.id == "del") {

        e.target.parentElement.remove();

        cartIsEmpty();
        localStorage.setItem("products", removeEmptyCarts(document.querySelector("#shopCart").innerHTML))
        cartIsEmpty();
        sumTotal();


    } else if (e.target.classList.contains("body-addGoods")) {

        const price = e.target.parentElement.parentElement.getElementsByClassName("goods-body-price")[0]
        const quantity = e.target.parentElement.parentElement.getElementsByClassName("body-countGoods")[0]
        const total = e.target.parentElement.parentElement.getElementsByClassName("goods-body-total")[0]
       
        if (Number(quantity.textContent) != Number(e.target.parentElement.parentElement.getElementsByTagName("SPAN")[0].textContent)) {
            quantity.textContent = Number(quantity.textContent) + 1
            total.textContent = "$" + (Number(price.textContent.slice(1, -3)) * Number(quantity.textContent)).toFixed(2)

            localStorage.setItem("products", removeEmptyCarts(document.querySelector("#shopCart").innerHTML))
            sumTotal();

        }


    } else if (e.target.classList.contains("body-removeGoods")) {

        const price = e.target.parentElement.parentElement.getElementsByClassName("goods-body-price")[0]
        const quantity = e.target.parentElement.parentElement.getElementsByClassName("body-countGoods")[0]
        const total = e.target.parentElement.parentElement.getElementsByClassName("goods-body-total")[0]

        if (Number(quantity.textContent) > 1) {

            quantity.textContent = Number(quantity.textContent) - 1
            total.textContent = "$" + (Number(price.textContent.slice(1, -3)) * Number(quantity.textContent)).toFixed(2)

            localStorage.setItem("products", removeEmptyCarts(document.querySelector("#shopCart").innerHTML))
            sumTotal();

        }

    }
}))
//CARD_GOODS====================================================================================================

class GoodsCard {
    constructor(src, title, price, article, parentSelector, attr, ...classes) {
        this.src = src;
        this.title = title;
        this.price = price.toFixed(2);
        this.classes = classes;
        this.attr = attr;
        this.article = article;
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
        <div style="display: none" class="element-info-article">${this.article}</div>
        `;
        this.parent.append(element);
    }
}
if(document.getElementsByTagName("body")[0].classList.contains("index_html")) {

    localStorage.setItem("category", "")

    postData("http://localhost:8008/admin/getgoods")
    .then(json => json.forEach(elem => {
        if (elem["stock"] > 0) {
            new GoodsCard(elem["photo"], elem["title"], elem["price"], elem["article"], ".goods-elements" , "data-goods", "goods-element").render();
        }
    }))

    const slider = document.querySelector('.goods-elements');
    const next_elem = document.querySelector('.slider-next');
    const prev_elem = document.querySelector('.slider-prev');
    var current = 0;

    function nextSlide() {
        if (current != (slider.childElementCount - 3) && (slider.childElementCount - 3) > 0) {
            slider.style.left = `-${(current + 1) * 331}px`;
            current++;
        }
    }

    function prevSlide() {
        if((current - 1) >= 0) {
            slider.style.left = `-${(current - 1) * 331}px`;  
            current--; 
        }
    }

    // Обработчики событий для кнопок  
    next_elem.addEventListener('click', nextSlide);
    prev_elem.addEventListener('click', prevSlide);

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
            element.id = "bigGood"
            element.classList.add(this.classes);
        } else {
            this.classes.forEach(className => {
                element.classList.add(className)
                element.id = "bigGood"
            });
        }
        element.innerHTML = `
        <button data-close type="button" class="popup__close"><img src="../img/close.svg" alt=""></button>
        <div style="background-image: url('${this.src}')" class="popup-content-img">
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
                <button class="orderpanel-cart btn-activate-text"></button>
            </div>
        </div>
        </div>
        `;
        this.parent.innerHTML = ``;
        this.parent.append(element);
    }
}

//GOODS====================================================================================================

if(document.getElementsByTagName("body")[0].classList.contains("index_html")) {
    const btnFilterAge = document.querySelector(".filter-age");
    const btnCategories = document.querySelector(".goods-category-items");
    
    postData("http://localhost:8008/getcatsgoods")
    .then(json => Object.keys(json).forEach((elem) => {
        btnCategories.innerHTML += 
        `
        <button class="goods-category-item">${elem.charAt(0).toUpperCase() + elem.slice(1)}<span>(${json[`${elem}`]})</span></button>
        `
    }))
    
    btnCategories.addEventListener("click", (e) => {
        if (e.target.classList.contains("goods-category-item")) {
            btnCategories.querySelectorAll(".goods-category-item").forEach(elem => elem.classList.remove("category-active"))
            e.target.classList.add("category-active")

            document.querySelector('.goods-elements').style.left = "0px"
            current = 0
            
            localStorage.setItem("category", e.target.textContent.replace(/\s*\(.*?\)\s*/g, ''))
            const jsonFirst = JSON.stringify({"category" : e.target.textContent.replace(/\s*\(.*?\)\s*/g, ''), "age" : ""});
    
            postData("http://localhost:8008/getgoodbycatss", jsonFirst)
            .then(json => {
                document.querySelector(".goods-elements").innerHTML = "";
                json.forEach((elem) => {
                    if (elem["stock"] > 0) {
                        new GoodsCard(elem["photo"], elem["title"], elem["price"], elem["article"], ".goods-elements" , "data-goods", "goods-element").render();
                    }
                }
            )})
        }
    })
    btnFilterAge.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-age")) {
            btnCategories.querySelectorAll(".filter-age").forEach(elem => elem.classList.remove("active"))
            e.target.classList.add("active")

            document.querySelector('.goods-elements').style.left = "0px"
            current = 0
            
            localStorage.setItem("age", e.target.textContent.replace(/[^a-zA-Z]+/g, '').toLowerCase())
            const jsonFirst = JSON.stringify({"category" : localStorage.getItem("category"), "age" : ""});
    
            postData("http://localhost:8008/getgoodbycatss", jsonFirst)
            .then(json => {
                document.querySelector(".goods-elements").innerHTML = "";
                json.forEach((elem) => {
                    if (elem["stock"] > 0) {
                        new GoodsCard("../img/goods3.png", elem["title"], elem["price"], elem["article"], ".goods-elements" , "data-goods", "goods-element").render();
                    }
                }
            )})
        }
    })
}


//POPUP====================================================================================================

const popup = document.querySelector('.goods-elements');

const cartGood = document.querySelectorAll(".cart-header");
const userAuth = document.querySelectorAll(".user-header");


function addPopup(elemPop, data, id) {
    elemPop.forEach((elem) => {
        elem.setAttribute(data, id)
        cartIsEmpty();
        elem.classList.add("link")
    })
}

if(document.getElementsByTagName("body")[0].classList.contains("index_html")) {


    popup.addEventListener("click", (e) => {
        const parent = e.target.parentElement;



        if(parent.classList.contains("goods-element")) {

            cartIsEmpty();

            const jsonFirst = JSON.stringify({"article" : Number(parent.querySelector(".element-info-article").textContent)});

            postData("http://localhost:8008/getgood", jsonFirst)
            .then(json => {
                new BigGoodsCard(
                    json["photo"],
                    json["title"],
                    json["price"],
                    json["article"],
                    json["stock"],
                    json["description"],
                    "#bigGoods"
                    ).render();
                })
            .then(
                () => {
                    if (checkGoodsInCart(parent)) {
                        document.querySelector(".orderpanel-cart").textContent = "In cart"
                        addPopup(document.querySelectorAll(".orderpanel-cart"), "data-popup", "#popup-cart");
                    } else {
                        document.querySelector(".orderpanel-cart").textContent = "Add to Cart"
                        document.querySelector(".orderpanel-cart").removeAttribute("data-popup")
                    }
    
                    document.querySelector(".orderpanel-addGoods").addEventListener("click", () => {
                        const countGoods = document.querySelector(".orderpanel-countGoods");
                        const stockGoods = document.querySelector(".popup-content-stock");
    
                        if (parseInt(countGoods.textContent.match(/\d+/)) != parseInt(stockGoods.textContent.match(/\d+/))) {
                            countGoods.textContent = parseInt(countGoods.textContent.match(/\d+/)) + 1
                        }
                    })
                    
                    document.querySelector(".orderpanel-removeGoods").addEventListener("click", () => {
                        const countGoods = document.querySelector(".orderpanel-countGoods");
    
                        if (parseInt(countGoods.textContent.match(/\d+/)) != 1) {
                            countGoods.textContent = parseInt(countGoods.textContent.match(/\d+/)) - 1
                        }
                    })
                    
                    document.querySelector(".orderpanel-goOrder").addEventListener("click", (e) => {
                        const parent = e.target.parentElement.parentElement.parentElement
    //BUY NOW
                        if (parent.querySelector(".popup-content-info").querySelector(".popup-content-orderpanel").querySelector(".orderpanel-cart").textContent.toLowerCase().trim() == "add to cart") {
                            new CartItem(
                                ".." + parent.querySelector(".popup-content-img").style.backgroundImage.slice(7, -2), 
                                parent.getElementsByClassName("popup-content-title")[0].textContent,
                                Number(parent.getElementsByClassName("popup-content-stock")[0].getElementsByTagName("SPAN")[0].textContent),
                                Number(parent.getElementsByClassName("popup-content-price")[0].textContent.slice(1, -3)),
                                Number(parent.getElementsByClassName("orderpanel-countGoods")[0].textContent),
                                Number(parent.getElementsByClassName("popup-content-article")[0].textContent.replace(/\D/g, '')),
                                ".cart-goods-body")
                                .render()
                        
                                localStorage.setItem("products", removeEmptyCarts(document.querySelector("#shopCart").innerHTML))
                                sumTotal();
                        }
                    
                        window.location.href = "../shipping.html";
                    
                    })
    // CART
                    document.querySelector(".orderpanel-cart").addEventListener("click", (e) => {
                        const parent = e.target.parentElement.parentElement.parentElement
    
                        if (parent.querySelector(".popup-content-info").querySelector(".popup-content-orderpanel").querySelector(".orderpanel-cart").textContent.toLowerCase().trim() == "add to cart") {
                            new CartItem(
                                ".." + parent.querySelector(".popup-content-img").style.backgroundImage.slice(7, -2), 
                                parent.getElementsByClassName("popup-content-title")[0].textContent,
                                Number(parent.getElementsByClassName("popup-content-stock")[0].getElementsByTagName("SPAN")[0].textContent),
                                Number(parent.getElementsByClassName("popup-content-price")[0].textContent.slice(1, -3)),
                                Number(parent.getElementsByClassName("orderpanel-countGoods")[0].textContent),
                                Number(parent.getElementsByClassName("popup-content-article")[0].textContent.replace(/\D/g, '')),
                                ".cart-goods-body")
                                .render()
                        
                                localStorage.setItem("products", removeEmptyCarts(document.querySelector("#shopCart").innerHTML))
                                sumTotal();
    
                            if (checkGoodsInCart(parent)) {
                                document.querySelector(".orderpanel-cart").textContent = "In cart"
                                addPopup(document.querySelectorAll(".orderpanel-cart"), "data-popup", "#popup-cart");
                            } else {
                                document.querySelector(".orderpanel-cart").textContent = "Add to Cart"
                                document.querySelector(".orderpanel-cart").removeAttribute("data-popup")
                            }
                        }
                    })
                }
            )

                
            parent.setAttribute("data-popup", "#popup-goods");
            parent.setAttribute("data-close", "");    
        }
    })
}

addPopup(cartGood, "data-popup", "#popup-cart")

if(!localStorage.getItem("session")) {
    addPopup(userAuth, "data-popup", "#popup-auth")
} else {
    const jsonFirst = JSON.stringify({"token" : localStorage.getItem("session")});

    postData("http://localhost:8008/token", jsonFirst)
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
            <div style="${this.src};" class="body-good-img"></div>
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

const addEventButton = () => {
    document.querySelector(".btn-submit").addEventListener("click", (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target.parentElement.parentElement.parentElement.querySelector(".user-auth-forms").querySelector(".user_form_details"));
    
        const jsonFirst = JSON.stringify(Object.assign({}, {"token": localStorage.getItem("session"), "blocked": false, "superuser": false}, Object.fromEntries(formData.entries())));
        
        postData("http://localhost:8008/setpassworduser", jsonFirst).then(
            json => {localStorage.setItem("session", json);
            window.location.reload();
        })
    })
}

showUserInfo();
addEventButton();

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
    
        document.querySelector(".btn-submit").addEventListener("click", (e) => {
            e.preventDefault();

            const formData = new FormData(e.target.parentElement.parentElement.parentElement.querySelector(".user-auth-forms").querySelector(".user_form_details"));

            const jsonFirst = JSON.stringify(Object.assign({}, {"html" : localStorage.getItem("products"), "user_token": localStorage.getItem("session")}, Object.fromEntries(formData.entries())));
            
            postData("http://localhost:8008/edituser", jsonFirst).then(json => window.location.reload())
        })

    } 
    else if (e.target.classList.contains("user-pages-details")) {
        check("../img/user-acc-active.svg")
        user_forms.innerHTML = `
        <div class="auth-forms-title">Personal Information</div>
        <form action="" method="post" class="user_form_details">
            <div class="inputbox_user"><input type="text" name="firstname" class="defForm" disabled><label for="firstname" class="textinputbox">First Name</label></div>
            <div class="inputbox_user"><input type="text" name="lastname" class="defForm" disabled><label for="lastname" class="textinputbox">Last Name</label></div>
            <div class="inputbox_user"><input type="text" name="email" class="defForm" disabled><label for="email" class="textinputbox">Email address</label></div>
            <div class="change-password-user">
                <div class="password-user-title">Password change</div>
                <div class="inputbox_user"><input type="password" name="currpassword" class="defForm" required><label for="currpassword" class="textinputbox">Current password <span>*</span></label>
                    <button class="password-checker hide-checker"></button>
                </div>
                <div class="inputbox_user"><input type="password" name="newpassword" class="defForm" required><label for="newpassword" class="textinputbox">New password <span>*</span></label>
                    <button class="password-checker hide-checker"></button>
                </div>
            </div>
            <button type="submit" class="btn-submit">Save Change</button>
        </form>
        `
        showUserInfo();
        addEventButton();
    } 
    else if (e.target.classList.contains("user-pages-orders")) {
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
        <div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 24px;" class="order-is-empty">Orders is empty</div>
        </div>
            `;
        if(document.getElementsByTagName("body")[0].classList.contains("user-acc")) {
            postData("http://localhost:8008/getorder", JSON.stringify({"token" : localStorage.getItem("session")}))
            .then(mass => {
                if (mass && mass["message"] != "Orders does not exist") {
                    document.querySelector(".order-is-empty").style.display = "none";
                    mass.forEach((elem) => elem.forEach(elem1 => {
                        new Order (
                            elem1["image"],
                            elem1["title"],
                            elem1["article"],
                            elem1["status"],
                            elem1["date"],
                            `${fd(new Date(Date.now()), true)}`,
                            elem1["count"],
                            elem1["price"],
                            ".auth-forms-body",
                        ).render();
                    }))
                } else {
                    document.querySelector(".order-is-empty").style.display = "flex";
                }
            })
        }
    }  else if (e.target.classList.contains("user-pages-logout")) {
        e.preventDefault();

        const jsonFirst = JSON.stringify({"token" : localStorage.getItem("session"), "html" : localStorage.getItem("products")});

        postData("http://localhost:8008/logout", jsonFirst).then( () => {
            localStorage.removeItem("session");
            localStorage.setItem("products", "");
    
            window.location.href = "../index.html";
        }
        )
    }
})
}

//ADMIN_ACC====================================================================================================


if(document.getElementsByTagName("body")[0].classList.contains("admin-acc")) {

    class UserAccount {
        constructor(id, email, status, token, parentSelector, ...classes) {
           this.id = id;
           this.token = token;
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
            <div style="display: none" class="userinfo-token">${this.token}</div>
                `;
    
            this.parent.forEach((par) => {
                element.querySelector(".body-userinfo-status").classList.add(this.color);
                par.append(element);
            })
        }
    }

    postData("http://localhost:8008/admin/getuser", JSON.stringify({"token": "b2QnK6imJqtrGCwlVtVxKo7I7epzy_Vhxq2qQM0YY2NZfxNI7FM6SGgmwHSmcbfyXN9txo6IQiSO6S2jT_LGEBsSE--pUgvQs5N5vTaqBDrKIanqClZM-rqmK7tcLBxAEDYShS6_cfuHg7_p2yH3Eiw5VB5--VTB", "level": 2}))
    .then(json => {
        for(i = 0; i < json.length; i++) {
            new UserAccount((i + 1), json[i]["token"] == localStorage.getItem("session") ? "You" : json[i]["email"], json[i]["blocked"] ? "Blocked" : "Unblocked", json[i]["token"], ".admin-auth-block").render();
        }
    }
    )

    class UsersGoods {
        constructor(src, title, article, stock, categ, age, price, parentSelector, ...classes) {
           this.src = src;
           this.title = title;
           this.article = article;
           this.stock = stock;
           this.categ = categ;
           this.age = age;
           this.price = price.toFixed(2);
           this.classes = classes;
           this.parent = document.querySelector(parentSelector).querySelectorAll(".admin-goods-body");
        }
    
        render() {
            const element = document.createElement('div');
    
            if (this.classes.length === 0) {
                element.classList.add("goods-body-item");
            } else {
                this.classes.forEach(className => {
                    element.classList.add(className)
                });
            }
    
            element.innerHTML = `
            <div class="goods-body-info">
                <div style="background-image: url('${this.src}');" class="body-goods-img"></div>
                <div class="body-goods-block">
                    <div class="body-goods-title">${this.title}</div>
                    <div class="body-goods-article">Article: <span>${this.article}</span></div>
                </div>
            </div>
            <div class="body-goods-stock">${this.stock}</div>
            <div class="body-goods-category">${this.categ}</div>
            <div class="body-goods-age">${this.age}</div>
            <div class="body-goods-price">$${this.price}</div>
            <div class="goods-body-btns">
                <button class="userinfo-goods-changer"></button>
                <button class="userinfo-opportunity-delete"></button>
            </div>
                `;
    
            this.parent.forEach((par) => {
                par.append(element);
            })
        }
    }

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
            <div class="admin-forms-title">Goods</div>
            <div class="admin-users-header">
                <div class="admin-goods-item1 admin-header-item">Product</div>
                <div class="admin-goods-item2 admin-header-item">Stock</div>
                <div class="admin-goods-item3 admin-header-item">Category</div>
                <div class="admin-goods-item4 admin-header-item">Age</div>
                <div class="admin-goods-item5 admin-header-item">Price</div>
                <button class="admin-goods-item6 admin-header-item">Add a product
                </button>
            </div>
            <div class="admin-goods-body">
            </div>
            `
            postData("http://localhost:8008/admin/getgoods", "")
            .then(json => {
                json.forEach((elem) => {
                new UsersGoods(elem["photo"], elem["title"], elem["article"], elem["stock"], elem["category"], elem["age"], elem["price"], ".admin-auth-block").render();
            })})

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
            postData("http://localhost:8008/admin/getuser", JSON.stringify({"token": "b2QnK6imJqtrGCwlVtVxKo7I7epzy_Vhxq2qQM0YY2NZfxNI7FM6SGgmwHSmcbfyXN9txo6IQiSO6S2jT_LGEBsSE--pUgvQs5N5vTaqBDrKIanqClZM-rqmK7tcLBxAEDYShS6_cfuHg7_p2yH3Eiw5VB5--VTB", "level": 2}))
            .then(json => {
                for(i = 0; i < json.length; i++) {
                    new UserAccount((i + 1), json[i]["token"] == localStorage.getItem("session") ? "You" : json[i]["email"], json[i]["blocked"] ? "Blocked" : "Unblocked", json[i]["token"], ".admin-auth-block").render();
                }
            })
            

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
// Users
        if (e.target.parentElement.parentElement.classList.contains("forms-body-userinfo")) {
            const now_user_token = e.target.parentElement.parentElement.querySelector(".userinfo-token").textContent;

        if (e.target.classList.contains("userinfo-opportunity-delete")) {
            
            postData("http://localhost:8008/admin/deleteuser", JSON.stringify({"super_user_token" : localStorage.getItem("session"), "token" : now_user_token}))
            .then(json => {
                window.location.reload();
            })
        } else if (e.target.classList.contains("userinfo-opportunity-changer")) {

            if (now_user_token != localStorage.getItem("session")) {
                e.target.parentElement.parentElement.querySelector(".userinfo-opportunity-changer").setAttribute("data-popup", "#popup-username");

            const jsonFirst = JSON.stringify({"token" : e.target.parentElement.parentElement.querySelector(".userinfo-token").textContent});

            postData("http://localhost:8008/token", jsonFirst).then(json => {
                const allPersonalForms = document.querySelectorAll(".adminForm");
        
                allPersonalForms[0].value = json["First_Name"]
                allPersonalForms[1].value = json["Last_Name"]
                allPersonalForms[2].value = json["Country"]
                allPersonalForms[3].value = json["Town"]
                allPersonalForms[4].value = json["Address"]
                allPersonalForms[5].value = json["State"]
                allPersonalForms[6].value = json["Zip"]
                json["blocked"] ? document.querySelector(".item-1").classList.add("item-1-checked") : document.querySelector(".item-2").classList.add("item-2-checked");
        })
            
            } else {
                e.target.parentElement.parentElement.querySelector(".userinfo-opportunity-changer").disabled = true;
                e.target.parentElement.parentElement.querySelector(".userinfo-opportunity-delete").disabled = true;
            }

            const blocked = document.querySelector(".item-1");
            const unblocked = document.querySelector(".item-2");

            unblocked.classList.remove("item-2-checked");
            blocked.classList.remove("item-1-checked");

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
        }

        document.querySelector(".changed-userInfo").addEventListener("click", () => {
            e.preventDefault();

            const form = document.querySelector(".admin-change-userInfo");

            const formData = new FormData(form);

            const blocked = form.querySelector(".item-1").classList.contains("item-1-checked") ? {"html" : " ", "user_token" : now_user_token, "blocked" : true, "superuser" : false} : {"html" : " ", "user_token" : now_user_token, "blocked" : false, "superuser" : false};
            const jsonFirst = JSON.stringify(Object.assign({}, blocked, Object.fromEntries(formData.entries())));

            postData("http://localhost:8008/edituser", jsonFirst)
            .then(json => {
            })
        })
        // Goods
        } else if (e.target.parentElement.parentElement.classList.contains("goods-body-item")) {

            const now_good_article = Number(e.target.parentElement.parentElement.querySelector(".body-goods-article").getElementsByTagName("span")[0].textContent);

            if (e.target.classList.contains("userinfo-opportunity-delete")) {
            
                postData("http://localhost:8008/admin/deletegoods", JSON.stringify({"token" : localStorage.getItem("session"), "article" : now_good_article}))
                .then(json => {
                    window.location.reload();
                })
            } else if (e.target.classList.contains("userinfo-goods-changer")) {

                postData("http://localhost:8008/getgood", JSON.stringify({"article" : now_good_article}))
                .then(json => {
                    const allGoodsForms = document.querySelectorAll(".goodsForm");
                    const textarea = document.querySelector(".description-admin-goods");

                    allGoodsForms[0].value = json["title"];
                    allGoodsForms[1].value = json["category"];
                    allGoodsForms[2].value = json["article"];
                    allGoodsForms[3].value = json["photo"];
                    allGoodsForms[4].value = json["price"];
                    allGoodsForms[5].value = json["stock"];

                    textarea.value = json["description"];
                })
                e.target.parentElement.parentElement.querySelector(".userinfo-goods-changer").setAttribute("data-popup", "#popup-admin-goods");

            }
            document.querySelector(".admin-goods-submit").addEventListener("click", () => {
                e.preventDefault();
    
                const form = document.querySelector(".admin-edit-goods");
    
                const formData = new FormData(form);
    
                const jsonFirst = JSON.stringify(Object.assign({}, blocked, Object.fromEntries(formData.entries())));
    
                postData("http://localhost:8008/edituser", jsonFirst)
                .then(json => {
                })
            })
        }        

    })


}

//BACKEND-REGISTER==================================================================================================

const btns_sumbit = document.querySelectorAll(".form_auth_button");

btns_sumbit.forEach((elem) => {
    elem.addEventListener("click", (e) => {
        e.preventDefault();

        if(elem.parentElement.id == "form_user_reg") {
            

            const formData = new FormData(elem.parentElement);

            const jsonFirst = JSON.stringify(Object.assign({}, {"html" : localStorage.getItem("products")}, Object.fromEntries(formData.entries())));
        
        
            postData("http://localhost:8008/reg", jsonFirst)
              .then(json => {
                    localStorage.setItem("session", json);
                    localStorage.setItem("products", "")
                }
              )
        
            elem.parentElement.reset();

        } else if (elem.parentElement.id == "form_user_log") {
            const formData = new FormData(elem.parentElement);
        
            const jsonFirst = JSON.stringify(Object.fromEntries(formData.entries()));
        
        
            postData("http://localhost:8008/login", jsonFirst)
              .then(json => {
                    if (typeof(json[0]) == "string") {
                        localStorage.setItem("session", json[0]);
                        if (document.querySelector("#shopCart").childElementCount == 1) {
                            localStorage.setItem("products", removeEmptyCarts(json[1]));
                            cartIsEmpty();
                        } else {
                            localStorage.setItem("products", removeEmptyCarts(json[1] + localStorage.getItem("products")));
                            cartIsEmpty();
                        }
                        window.location.reload();
                    }
                }
              )
        
            elem.parentElement.reset();
        }
    })
})


// Test


