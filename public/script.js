// CAMPUSBITES - main page (index.html) logic
// Carts, ordering modes, bill splitter, outlet menus, search and checkout hand-off.

var DELIVERY_CHARGE = 45;
var GROUP_CODE = "CB-7X2W";

var groupOrders = [];
var personalOrders = [];
var orderMode = "group";

var outletMenus = {
    "Burger Singh": [
        { name: "Classic Burger", price: 149 },
        { name: "King Burger", price: 199 },
        { name: "Crispy Fries", price: 99 },
        { name: "Cold Coffee", price: 120 }
    ],
    "Kathi Junction": [
        { name: "Paneer Kathi Roll", price: 149 },
        { name: "Veg Kathi Roll", price: 119 },
        { name: "Aloo Tikki Roll", price: 99 },
        { name: "Cold Coffee", price: 120 }
    ],
    "Maggi Point": [
        { name: "Classic Maggi", price: 60 },
        { name: "Cheese Maggi", price: 90 },
        { name: "Peri Peri Maggi", price: 80 },
        { name: "Masala Maggi", price: 70 }
    ],
    "Greenox": [
        { name: "Veg Sandwich", price: 99 },
        { name: "Paneer Wrap", price: 149 },
        { name: "Healthy Salad", price: 129 },
        { name: "Fresh Juice", price: 89 }
    ]
};

// PAGE ELEMENTS
var foodList = document.getElementById("foodList");
var groupCartItems = document.getElementById("groupCartItems");
var memberBill = document.getElementById("memberBill");
var groupTotal = document.getElementById("groupTotal");
var sideItems = document.getElementById("personalCartItems");
var sideSummary = document.getElementById("personalCartSummary");
var sideTitle = document.getElementById("personalCartTitle");
var sideButton = document.getElementById("checkoutPersonalButton");
var memberWrap = document.getElementById("memberNameWrap");
var menuMemberInput = document.getElementById("menuMemberName");
var searchBox = document.getElementById("searchBox");


/* ---------- SAVE / LOAD (cart survives page changes) ---------- */

function saveCart() {
    try {
        localStorage.setItem("cb_cart", JSON.stringify({
            group: groupOrders, personal: personalOrders, mode: orderMode
        }));
    } catch (e) { /* storage unavailable - ignore */ }
}

function loadCart() {
    try {
        var saved = JSON.parse(localStorage.getItem("cb_cart"));
        if (saved) {
            groupOrders = saved.group || [];
            personalOrders = saved.personal || [];
            orderMode = saved.mode === "separate" ? "separate" : "group";
        }
    } catch (e) { /* ignore corrupt data */ }
}


/* ---------- HELPERS ---------- */

function sumOrders(list) {
    var total = 0;
    list.forEach(function (o) { total += o.quantity * o.price; });
    return total;
}

function money(n) { return "₹" + n.toFixed(2); }

function qtyControls(cart, index, quantity) {
    return '<span class="qty-controls">' +
        '<button type="button" class="qty-btn" data-cart="' + cart + '" data-action="dec" data-index="' + index + '" aria-label="Decrease quantity">−</button>' +
        '<span class="qty-value">' + quantity + '</span>' +
        '<button type="button" class="qty-btn" data-cart="' + cart + '" data-action="inc" data-index="' + index + '" aria-label="Increase quantity">+</button>' +
        '<button type="button" class="outline-button remove-btn" data-cart="' + cart + '" data-action="remove" data-index="' + index + '">Remove</button>' +
        '</span>';
}


/* ---------- RENDERING ---------- */

function renderGroupPage() {
    var html = "";
    var memberNames = [];
    var memberTotals = [];

    if (groupOrders.length === 0) {
        html = '<div class="empty-cart">Your group cart is empty.</div>';
    }

    groupOrders.forEach(function (order, i) {
        var line = order.quantity * order.price;
        html += '<div class="order-row"><b>' + CB.escapeHtml(order.member) + '</b> — ' +
            CB.escapeHtml(order.item) + " — " + money(line) +
            qtyControls("group", i, order.quantity) + "</div>";

        var idx = memberNames.indexOf(order.member);
        if (idx === -1) { memberNames.push(order.member); memberTotals.push(line); }
        else { memberTotals[idx] += line; }
    });

    groupCartItems.innerHTML = html;

    var subtotal = sumOrders(groupOrders);
    var delivery = groupOrders.length > 0 ? DELIVERY_CHARGE : 0;
    var total = subtotal + delivery;
    groupTotal.textContent = money(total);

    var bill = "<h3>Bill Split</h3>" +
        "<p>Subtotal: " + money(subtotal) + "</p>" +
        "<p>Delivery charge: " + money(delivery) + "</p>" +
        "<p><b>Group total: " + money(total) + "</b></p>";

    if (memberNames.length === 0) {
        bill += "<p>Add an order to calculate each member's share.</p>";
    } else {
        var deliveryShare = delivery / memberNames.length;
        memberNames.forEach(function (name, j) {
            bill += "<p>" + CB.escapeHtml(name) + " pays: <b>" +
                money(memberTotals[j] + deliveryShare) + "</b></p>";
        });
    }
    memberBill.innerHTML = bill;
}

// The cart in the Menu page sidebar follows the current mode
function renderSidebar() {
    var isGroup = orderMode === "group";
    var list = isGroup ? groupOrders : personalOrders;
    var cartName = isGroup ? "group" : "personal";
    var html = "";

    sideTitle.textContent = isGroup ? "Group Cart" : "Personal Cart";
    sideButton.textContent = isGroup ? "Checkout Group Order" : "Place Separate Order";

    if (list.length === 0) {
        html = '<div class="empty-cart">Your ' + (isGroup ? "group" : "personal") + " cart is empty.</div>";
    }
    list.forEach(function (o, i) {
        html += '<div class="order-row">' +
            (isGroup ? CB.escapeHtml(o.member) + " — " : "") +
            CB.escapeHtml(o.item) + " — " + money(o.quantity * o.price) +
            qtyControls(cartName, i, o.quantity) + "</div>";
    });
    sideItems.innerHTML = html;

    var subtotal = sumOrders(list);
    var delivery = isGroup && list.length > 0 ? DELIVERY_CHARGE : 0;
    sideSummary.innerHTML =
        "<div><span>Subtotal</span><span>" + money(subtotal) + "</span></div>" +
        (isGroup ? "<div><span>Delivery</span><span>" + money(delivery) + "</span></div>" : "") +
        '<div class="total"><span>Total</span><span>' + money(subtotal + delivery) + "</span></div>";
}

function renderAll() {
    renderGroupPage();
    renderSidebar();
    saveCart();
}


/* ---------- ORDERING MODE ---------- */

function changeMode(mode) {
    orderMode = mode;
    var isGroup = mode === "group";

    document.getElementById("modeMessage").textContent = isGroup
        ? "Current mode: Group Order. Enter your name and add items."
        : "Current mode: Order Separately. Items go into your personal cart.";
    document.getElementById("groupModeButton").className = isGroup ? "button" : "outline-button";
    document.getElementById("separateModeButton").className = isGroup ? "outline-button" : "button";
    memberWrap.hidden = !isGroup;
    renderAll();
}

document.getElementById("groupModeButton").addEventListener("click", function () { changeMode("group"); });
document.getElementById("separateModeButton").addEventListener("click", function () { changeMode("separate"); });
document.getElementById("startSeparateOrder").addEventListener("click", function () { changeMode("separate"); });


/* ---------- ADD ITEMS FROM THE MENU ---------- */

function addItem(list, entry) {
    // Same member + same item? Just increase the quantity.
    for (var i = 0; i < list.length; i++) {
        if (list[i].item === entry.item && list[i].member === entry.member && list[i].price === entry.price) {
            list[i].quantity += entry.quantity;
            return;
        }
    }
    list.push(entry);
}

foodList.addEventListener("click", function (event) {
    var button = event.target.closest(".add-button");
    if (!button) return;

    var name = button.getAttribute("data-name");
    var price = Number(button.getAttribute("data-price"));

    if (orderMode === "group") {
        var member = menuMemberInput.value.trim();
        if (member.length < 2) {
            CB.showErrors(memberWrap, { menuMemberName: "Enter the member's name (at least 2 letters) first." });
            return;
        }
        CB.clearErrors(memberWrap);
        addItem(groupOrders, { member: member, item: name, quantity: 1, price: price });
    } else {
        addItem(personalOrders, { item: name, quantity: 1, price: price });
    }
    renderAll();
    CB.toast(name + " added", "success");
});

CB.liveClear(memberWrap);


/* ---------- CART BUTTONS (+ / − / Remove) ---------- */

function handleCartClick(event) {
    var btn = event.target.closest("[data-action]");
    if (!btn) return;

    var list = btn.getAttribute("data-cart") === "group" ? groupOrders : personalOrders;
    var index = Number(btn.getAttribute("data-index"));
    var action = btn.getAttribute("data-action");
    if (!list[index]) return;

    if (action === "inc") {
        if (list[index].quantity < 50) list[index].quantity++;
    } else if (action === "dec") {
        list[index].quantity--;
        if (list[index].quantity < 1) list.splice(index, 1);
    } else if (action === "remove") {
        list.splice(index, 1);
    }
    renderAll();
}

groupCartItems.addEventListener("click", handleCartClick);
sideItems.addEventListener("click", handleCartClick);


/* ---------- MANUAL ORDER FORM (Group Order page) ---------- */

var manualBox = document.querySelector(".input-box");
CB.liveClear(manualBox);

document.getElementById("addOrderButton").addEventListener("click", function () {
    var member = document.getElementById("memberName").value.trim();
    var item = document.getElementById("foodItem").value.trim();
    var qtyText = document.getElementById("quantity").value;
    var priceText = document.getElementById("price").value;
    var quantity = Number(qtyText);
    var price = Number(priceText);
    var errors = {};

    if (member.length < 2) errors.memberName = "Enter the member's name (min 2 letters).";
    if (item.length < 2) errors.foodItem = "Enter a food item.";
    if (qtyText === "" || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        errors.quantity = "Whole number from 1 to 50.";
    }
    if (priceText === "" || isNaN(price) || price <= 0 || price > 10000) {
        errors.price = "Enter a price between 1 and 10000.";
    }

    if (Object.keys(errors).length) {
        CB.showErrors(manualBox, errors);
        return;
    }
    CB.clearErrors(manualBox);

    addItem(groupOrders, { member: member, item: item, quantity: quantity, price: price });
    renderAll();
    CB.toast("Order added for " + member, "success");

    ["memberName", "foodItem", "quantity", "price"].forEach(function (id) {
        document.getElementById(id).value = "";
    });
});


/* ---------- CHECKOUT (hand the cart to checkout.html) ---------- */

function goToCheckout(mode) {
    var list = mode === "group" ? groupOrders : personalOrders;
    if (list.length === 0) {
        CB.toast("Your cart is empty. Add an item first.", "error");
        return;
    }
    localStorage.setItem("cb_checkout", JSON.stringify({
        mode: mode,
        groupCode: mode === "group" ? GROUP_CODE : null,
        items: list
    }));
    location.href = "checkout.html";
}

sideButton.addEventListener("click", function () { goToCheckout(orderMode); });
document.getElementById("confirmGroupButton").addEventListener("click", function () { goToCheckout("group"); });


/* ---------- OUTLET MENUS ---------- */

function showOutletMenu(outletName) {
    var items = outletMenus[outletName];
    if (!items) return;

    document.getElementById("selectedOutletName").textContent = outletName + " Menu";
    foodList.innerHTML = "";

    items.forEach(function (item) {
        var card = document.createElement("article");
        card.className = "food-card";
        card.innerHTML =
            '<div class="food-info"><h3>' + CB.escapeHtml(item.name) + "</h3>" +
            '<div class="food-bottom"><b>₹' + item.price + "</b>" +
            '<button type="button" class="add-button" data-name="' + CB.escapeHtml(item.name) +
            '" data-price="' + item.price + '">+ Add</button></div></div>';
        foodList.appendChild(card);
    });
    window.location.hash = "menu";
}

document.querySelectorAll(".outlet-card[data-outlet]").forEach(function (card) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("click", function () { showOutletMenu(card.getAttribute("data-outlet")); });
    card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            showOutletMenu(card.getAttribute("data-outlet"));
        }
    });
});


/* ---------- SEARCH OUTLETS ---------- */

searchBox.addEventListener("input", function () {
    var text = searchBox.value.trim().toLowerCase();
    var cards = document.querySelectorAll("#outlets .outlet-card");
    var shown = 0;

    cards.forEach(function (card) {
        var match = card.textContent.toLowerCase().indexOf(text) !== -1;
        card.style.display = match ? "" : "none";
        if (match) shown++;
    });
    document.getElementById("noResults").hidden = shown !== 0;
    if (text !== "" && location.hash !== "#outlets") location.hash = "outlets";
});


/* ---------- START ---------- */

loadCart();
changeMode(orderMode);
