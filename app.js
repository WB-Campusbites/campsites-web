// CAMPUSBITES - JavaScript for all pages (one file)
//
// 1. Settings and menu data
// 2. Small helper functions (messages, errors, login info)
// 3. Navbar (login buttons + active link)
// 4. Forms: signup, login, contact, checkout
// 5. Home page: menu, carts, bill split, search
// 6. Start everything


/* =====================================================
   1. SETTINGS AND MENU DATA
   ===================================================== */

var DELIVERY_CHARGE = 45;
var GROUP_CODE = "CB-7X2W";

var IMG = {
    burger:       "https://pngtree.com/so/burger" ,
    paneerBurger: "https://searchingforspice.com/vegetarian-paneer-burger-with-hot-honey/",
    coffee:       "https://instacuppastore.com/blogs/recipes/easy-coffee-recipe-at-home?srsltid=AYCX9vL2_qqbjgUfnA4XngPfTiZa-4zSZsimduWcptqaI8kwN_UUxGmZ",
    fries:        "https://detoxinista.com/baked-french-fries/",
    roll:         "https://spicecravings.com/paneer-kathi-roll",
    maggi:        "https://www.shutterstock.com/search/maggie-noodle-bowl",
    healthy:      "https://www.bhg.com/recipes/grains/our-best-whole-grain-recipes/"
};

var CATEGORY_NAMES = {
    all: "All Items",
    burgers: "Burgers",
    wraps: "Wraps & Rolls",
    beverages: "Beverages",
    sides: "Sides",
    meals: "Maggi & Bowls"
};

// Menu of every outlet.
// category is one of: burgers, wraps, beverages, sides, meals
var outletMenus = {
    "Burger Singh": [
        { name: "Classic Burger",         price: 149, category: "burgers",   img: IMG.burger },
        { name: "King Burger",            price: 199, category: "burgers",   img: IMG.burger },
        { name: "Spicy Amritsari Burger", price: 189, category: "burgers",   img: IMG.burger },
        { name: "Paneer Burger",          price: 169, category: "burgers",   img: IMG.paneerBurger },
        { name: "Malabar Fries",          price: 99,  category: "sides",     img: IMG.fries },
        { name: "Saffron Cold Coffee",    price: 120, category: "beverages", img: IMG.coffee }
    ],
    "Kathi Junction": [
        { name: "Paneer Kathi Roll", price: 149, category: "wraps",     img: IMG.roll },
        { name: "Veg Kathi Roll",    price: 119, category: "wraps",     img: IMG.roll },
        { name: "Aloo Tikki Roll",   price: 99,  category: "wraps",     img: IMG.roll },
        { name: "Cold Coffee",       price: 120, category: "beverages", img: IMG.coffee }
    ],
    "Maggi Point": [
        { name: "Classic Maggi",   price: 60, category: "meals", img: IMG.maggi },
        { name: "Cheese Maggi",    price: 90, category: "meals", img: IMG.maggi },
        { name: "Peri Peri Maggi", price: 80, category: "meals", img: IMG.maggi },
        { name: "Masala Maggi",    price: 70, category: "meals", img: IMG.maggi }
    ],
    "Greenox": [
        { name: "Veg Sandwich",  price: 99,  category: "meals",     img: IMG.healthy },
        { name: "Paneer Wrap",   price: 149, category: "wraps",     img: IMG.roll },
        { name: "Healthy Salad", price: 129, category: "meals",     img: IMG.healthy },
        { name: "Fresh Juice",   price: 89,  category: "beverages", img: IMG.coffee }
    ]
};


/* =====================================================
   2. HELPER FUNCTIONS
   ===================================================== */

// Make text safe before putting it inside HTML
function escapeHtml(text) {
    text = String(text);
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/"/g, "&quot;");
    return text;
}

function money(number) {
    return "₹" + number.toFixed(2);
}

// Small popup message (success / error / info)
function showToast(message, type) {
    var box = document.getElementById("toastBox");
    if (box === null) {
        box = document.createElement("div");
        box.id = "toastBox";
        document.body.appendChild(box);
    }

    var toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.textContent = message;
    box.appendChild(toast);

    // hide after 2.8 seconds, then remove
    setTimeout(function () {
        toast.classList.add("hide");
        setTimeout(function () { toast.remove(); }, 300);
    }, 2800);
}

// Show red error text under fields.
// errors looks like { email: "Enter a valid email." }
function showErrors(form, errors) {
    clearErrors(form);
    var firstField = null;

    for (var id in errors) {
        var errorBox = form.querySelector('[data-error-for="' + id + '"]');
        var field = form.querySelector("#" + id);
        if (errorBox) errorBox.textContent = errors[id];
        if (field) {
            field.classList.add("invalid");
            if (firstField === null) firstField = field;
        }
    }
    if (firstField !== null) firstField.focus();
}

function clearErrors(form) {
    var errorBoxes = form.querySelectorAll("[data-error-for]");
    for (var i = 0; i < errorBoxes.length; i++) {
        errorBoxes[i].textContent = "";
    }
    var badFields = form.querySelectorAll(".invalid");
    for (var j = 0; j < badFields.length; j++) {
        badFields[j].classList.remove("invalid");
    }
}

// When the user types in a field, remove its error
function liveClear(form) {
    form.addEventListener("input", function (event) {
        var field = event.target;
        if (!field.id) return;
        field.classList.remove("invalid");
        var errorBox = form.querySelector('[data-error-for="' + field.id + '"]');
        if (errorBox) errorBox.textContent = "";
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}

// Read a text field from a form (spaces at start/end removed)
function readField(form, id) {
    return form.querySelector("#" + id).value.trim();
}

// Send data to the server as JSON.
// onSuccess(body) runs if the server says OK.
function sendToServer(form, url, data, onSuccess) {
    var button = form.querySelector('button[type="submit"]');
    var oldText = button.textContent;
    button.disabled = true;
    button.textContent = "Please wait...";

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            return response.json().then(function (body) {
                return { ok: response.ok, body: body };
            });
        })
        .then(function (result) {
            if (result.ok) {
                onSuccess(result.body);
            } else {
                var errors = result.body.errors || {};
                showErrors(form, errors);
                showToast(errors.items || "Could not submit. Check the form.", "error");
            }
        })
        .catch(function () {
            showToast("Cannot reach the server. Is it running (npm start)?", "error");
        })
        .then(function () {
            button.disabled = false;
            button.textContent = oldText;
        });
}

// Logged-in user is saved in the browser (localStorage)
function getUser() {
    var saved = localStorage.getItem("cb_user");
    if (saved === null) return null;
    try {
        return JSON.parse(saved);
    } catch (error) {
        return null;
    }
}

function saveUser(user) {
    localStorage.setItem("cb_user", JSON.stringify(user));
}


/* =====================================================
   3. NAVBAR
   ===================================================== */

function showAuthNav() {
    var slot = document.getElementById("authNav");
    if (slot === null) return;

    var user = getUser();
    if (user) {
        var firstName = user.name.split(" ")[0];
        slot.innerHTML =
            '<span class="user-chip">Hi, ' + escapeHtml(firstName) + '</span>' +
            '<button type="button" class="outline-button" id="logoutButton">Logout</button>';
        document.getElementById("logoutButton").addEventListener("click", logout);
    } else {
        slot.innerHTML =
            '<a href="login.html" class="outline-button">Login</a>' +
            '<a href="signup.html" class="outline-button">Sign Up</a>';
    }
}

function logout() {
    localStorage.removeItem("cb_user");
    showToast("Logged out", "info");
    showAuthNav();
}

// Highlight the navbar link of the page / section we are on
function highlightNavLink() {
    var page = location.pathname.split("/").pop();
    if (page === "") page = "index.html";

    var hash = location.hash;
    if (hash === "") hash = "#home";

    var links = document.querySelectorAll(".nav-link");
    var found = null;

    for (var i = 0; i < links.length; i++) {
        var parts = links[i].getAttribute("href").split("#");
        var linkPage = parts[0];
        if (linkPage === "") linkPage = "index.html";
        var linkHash = "";
        if (parts.length > 1) linkHash = "#" + parts[1];

        if (linkPage !== page) continue;
        if (page !== "index.html" || linkHash === hash) found = links[i];
    }

    // on the home page, keep the old highlight for other anchors
    if (found === null && page === "index.html") return;

    for (var j = 0; j < links.length; j++) {
        links[j].classList.toggle("active", links[j] === found);
    }
}


/* =====================================================
   4. FORMS
   ===================================================== */

/* ---------- SIGN UP ---------- */

function setupSignupForm() {
    var form = document.getElementById("signupForm");
    if (form === null) return;
    liveClear(form);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = readField(form, "name");
        var email = readField(form, "email");
        var phone = readField(form, "phone");
        var password = form.querySelector("#password").value;
        var confirmPassword = form.querySelector("#confirmPassword").value;
        var errors = {};

        if (name.length < 2) errors.name = "Name must be at least 2 characters.";
        if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
        if (!isValidPhone(phone)) errors.phone = "Enter a valid 10-digit mobile number.";
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            errors.password = "Use 8+ characters with a letter and a number.";
        }
        if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";

        if (Object.keys(errors).length > 0) {
            showErrors(form, errors);
            showToast("Please fix the highlighted fields.", "error");
            return;
        }
        clearErrors(form);

        var data = { name: name, email: email, phone: phone, password: password };
        sendToServer(form, "/api/signup", data, function (body) {
            saveUser(body.user);
            showToast("Account created! Redirecting...", "success");
            setTimeout(function () { location.href = "index.html"; }, 1200);
        });
    });
}

/* ---------- LOGIN ---------- */

function setupLoginForm() {
    var form = document.getElementById("loginForm");
    if (form === null) return;
    liveClear(form);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var email = readField(form, "email");
        var password = form.querySelector("#password").value;
        var errors = {};

        if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
        if (password === "") errors.password = "Enter your password.";

        if (Object.keys(errors).length > 0) {
            showErrors(form, errors);
            showToast("Please fix the highlighted fields.", "error");
            return;
        }
        clearErrors(form);

        sendToServer(form, "/api/login", { email: email, password: password }, function (body) {
            saveUser(body.user);
            showToast("Welcome back, " + body.user.name + "!", "success");
            setTimeout(function () { location.href = "index.html"; }, 1000);
        });
    });
}

/* ---------- CONTACT ---------- */

function setupContactForm() {
    var form = document.getElementById("contactForm");
    if (form === null) return;
    liveClear(form);

    // show how many characters were typed
    var messageBox = document.getElementById("message");
    var counter = document.getElementById("charCount");
    if (messageBox && counter) {
        messageBox.addEventListener("input", function () {
            counter.textContent = messageBox.value.length + " / 500";
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = readField(form, "name");
        var email = readField(form, "email");
        var subject = readField(form, "subject");
        var message = readField(form, "message");
        var errors = {};

        if (name.length < 2) errors.name = "Name must be at least 2 characters.";
        if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
        if (subject === "") errors.subject = "Please choose a subject.";
        if (message.length < 10 || message.length > 500) {
            errors.message = "Message must be 10-500 characters.";
        }

        if (Object.keys(errors).length > 0) {
            showErrors(form, errors);
            showToast("Please fix the highlighted fields.", "error");
            return;
        }
        clearErrors(form);

        var data = { name: name, email: email, subject: subject, message: message };
        sendToServer(form, "/api/contact", data, function (body) {
            showToast(body.message, "success");
            form.reset();
            if (counter) counter.textContent = "0 / 500";
        });
    });
}

/* ---------- CHECKOUT ---------- */

// Show the items of the order on the checkout page
function showCheckoutSummary(order) {
    var rows = "";
    var subtotal = 0;

    for (var i = 0; i < order.items.length; i++) {
        var item = order.items[i];
        var line = item.quantity * item.price;
        subtotal += line;

        rows += '<div class="confirmation-item"><span>';
        if (item.member) rows += "<b>" + escapeHtml(item.member) + "</b> · ";
        rows += escapeHtml(item.item) + " × " + item.quantity + "</span>";
        rows += "<span>" + money(line) + "</span></div>";
    }

    var delivery = 0;
    if (order.mode === "group") delivery = DELIVERY_CHARGE;

    rows += '<div class="confirmation-item"><span>Delivery</span><span>' + money(delivery) + "</span></div>";
    rows += '<div class="confirmation-total"><span>Total</span><span>' + money(subtotal + delivery) + "</span></div>";

    document.getElementById("summaryRows").innerHTML = rows;

    var title = "Order Summary";
    if (order.mode === "group") title = "Group Order Summary";
    document.getElementById("summaryTitle").textContent = title;
}

function setupCheckoutPage() {
    var form = document.getElementById("checkoutForm");
    if (form === null) return;

    var emptyBox = document.getElementById("checkoutEmpty");
    var layout = document.getElementById("checkoutLayout");

    // the cart was saved by the home page before coming here
    var order = null;
    try {
        order = JSON.parse(localStorage.getItem("cb_checkout"));
    } catch (error) {
        order = null;
    }

    if (order === null || !order.items || order.items.length === 0) {
        layout.hidden = true;
        emptyBox.hidden = false;
        return;
    }

    showCheckoutSummary(order);

    // fill the name if the user is logged in
    var user = getUser();
    if (user) form.querySelector("#customerName").value = user.name;

    liveClear(form);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var customerName = readField(form, "customerName");
        var phone = readField(form, "phone");
        var hostel = readField(form, "hostel");
        var paymentMode = readField(form, "paymentMode");
        var notes = readField(form, "notes");
        var errors = {};

        if (customerName.length < 2) errors.customerName = "Enter your name.";
        if (!isValidPhone(phone)) errors.phone = "Enter a valid 10-digit mobile number.";
        if (hostel.length < 2) errors.hostel = "Enter your hostel / room or delivery spot.";
        if (paymentMode === "") errors.paymentMode = "Choose a payment mode.";
        if (notes.length > 200) errors.notes = "Notes can be at most 200 characters.";

        if (Object.keys(errors).length > 0) {
            showErrors(form, errors);
            showToast("Please fix the highlighted fields.", "error");
            return;
        }
        clearErrors(form);

        var data = {
            customerName: customerName,
            phone: phone,
            hostel: hostel,
            paymentMode: paymentMode,
            notes: notes,
            mode: order.mode,
            groupCode: order.groupCode,
            items: order.items
        };

        sendToServer(form, "/api/orders", data, function (body) {
            localStorage.removeItem("cb_checkout");
            localStorage.removeItem("cb_cart");
            layout.hidden = true;
            document.getElementById("confirmId").textContent = body.orderId;
            document.getElementById("confirmTotal").textContent = money(body.total);
            document.getElementById("checkoutDone").hidden = false;
            showToast("Order placed!", "success");
        });
    });
}


/* =====================================================
   5. HOME PAGE (index.html): menu, carts, bill, search
   ===================================================== */

// Items in the carts
var groupOrders = [];
var personalOrders = [];
var orderMode = "group";          // "group" or "separate"

// Menu filters
var selectedOutlet = null;        // null means all outlets
var selectedCategory = "all";

// Page elements (these are null on the other pages)
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
var menuTitle = document.getElementById("selectedOutletName");
var clearOutletButton = document.getElementById("clearOutlet");


/* ---------- SAVE AND LOAD THE CART ---------- */
// (so the cart is still there after changing page)

function saveCart() {
    var data = { group: groupOrders, personal: personalOrders, mode: orderMode };
    localStorage.setItem("cb_cart", JSON.stringify(data));
}

function loadCart() {
    try {
        var saved = JSON.parse(localStorage.getItem("cb_cart"));
        if (saved) {
            groupOrders = saved.group || [];
            personalOrders = saved.personal || [];
            if (saved.mode === "separate") orderMode = "separate";
        }
    } catch (error) {
        // saved data was broken, start with empty carts
    }
}


/* ---------- CART HELPERS ---------- */

function sumOrders(list) {
    var total = 0;
    for (var i = 0; i < list.length; i++) {
        total += list[i].quantity * list[i].price;
    }
    return total;
}

// The  -  1  +  Remove  buttons of one cart row
function quantityButtons(cartName, index, quantity) {
    var start = '<button type="button" class="qty-btn" data-cart="' + cartName + '" data-index="' + index + '" ';
    return '<span class="qty-controls">' +
        start + 'data-action="dec">−</button>' +
        '<span class="qty-value">' + quantity + '</span>' +
        start + 'data-action="inc">+</button>' +
        '<button type="button" class="outline-button remove-btn" data-cart="' + cartName +
        '" data-index="' + index + '" data-action="remove">Remove</button>' +
        '</span>';
}

// Add an item. If the same member already has it, only increase quantity.
function addToList(list, newItem) {
    for (var i = 0; i < list.length; i++) {
        var old = list[i];
        if (old.item === newItem.item && old.member === newItem.member && old.price === newItem.price) {
            old.quantity += newItem.quantity;
            return;
        }
    }
    list.push(newItem);
}


/* ---------- SHOW THE CARTS ---------- */

// Group Order page: list of orders + bill split
function showGroupPage() {
    var html = "";
    var names = [];       // member names
    var totals = [];      // total of each member (same order as names)

    if (groupOrders.length === 0) {
        html = '<div class="empty-cart">Your group cart is empty.</div>';
    }

    for (var i = 0; i < groupOrders.length; i++) {
        var order = groupOrders[i];
        var lineTotal = order.quantity * order.price;

        html += '<div class="order-row"><b>' + escapeHtml(order.member) + "</b> — " +
            escapeHtml(order.item) + " — " + money(lineTotal) +
            quantityButtons("group", i, order.quantity) + "</div>";

        var position = names.indexOf(order.member);
        if (position === -1) {
            names.push(order.member);
            totals.push(lineTotal);
        } else {
            totals[position] += lineTotal;
        }
    }
    groupCartItems.innerHTML = html;

    var subtotal = sumOrders(groupOrders);
    var delivery = 0;
    if (groupOrders.length > 0) delivery = DELIVERY_CHARGE;
    var total = subtotal + delivery;
    groupTotal.textContent = money(total);

    var bill = "<h3>Bill Split</h3>" +
        "<p>Subtotal: " + money(subtotal) + "</p>" +
        "<p>Delivery charge: " + money(delivery) + "</p>" +
        "<p><b>Group total: " + money(total) + "</b></p>";

    if (names.length === 0) {
        bill += "<p>Add an order to calculate each member's share.</p>";
    } else {
        // delivery charge is shared equally
        var deliveryShare = delivery / names.length;
        for (var j = 0; j < names.length; j++) {
            bill += "<p>" + escapeHtml(names[j]) + " pays: <b>" +
                money(totals[j] + deliveryShare) + "</b></p>";
        }
    }
    memberBill.innerHTML = bill;
}

// Cart on the right side of the Menu page (depends on the mode)
function showSideCart() {
    var isGroup = (orderMode === "group");
    var list = personalOrders;
    var cartName = "personal";
    if (isGroup) {
        list = groupOrders;
        cartName = "group";
    }

    sideTitle.textContent = isGroup ? "Group Cart" : "Personal Cart";
    sideButton.textContent = isGroup ? "Checkout Group Order" : "Place Separate Order";

    var html = "";
    if (list.length === 0) {
        html = '<div class="empty-cart">Your ' + cartName + " cart is empty.</div>";
    }
    for (var i = 0; i < list.length; i++) {
        var order = list[i];
        html += '<div class="order-row">';
        if (isGroup) html += escapeHtml(order.member) + " — ";
        html += escapeHtml(order.item) + " — " + money(order.quantity * order.price) +
            quantityButtons(cartName, i, order.quantity) + "</div>";
    }
    sideItems.innerHTML = html;

    var subtotal = sumOrders(list);
    var delivery = 0;
    if (isGroup && list.length > 0) delivery = DELIVERY_CHARGE;

    var summary = "<div><span>Subtotal</span><span>" + money(subtotal) + "</span></div>";
    if (isGroup) {
        summary += "<div><span>Delivery</span><span>" + money(delivery) + "</span></div>";
    }
    summary += '<div class="total"><span>Total</span><span>' + money(subtotal + delivery) + "</span></div>";
    sideSummary.innerHTML = summary;
}

function showAllCarts() {
    showGroupPage();
    showSideCart();
    saveCart();
}


/* ---------- ORDER MODE (group / separate) ---------- */

function changeMode(mode) {
    orderMode = mode;
    var isGroup = (mode === "group");

    var message = document.getElementById("modeMessage");
    if (isGroup) {
        message.textContent = "Current mode: Group Order. Enter your name and add items.";
    } else {
        message.textContent = "Current mode: Order Separately. Items go into your personal cart.";
    }

    document.getElementById("groupModeButton").className = isGroup ? "button" : "outline-button";
    document.getElementById("separateModeButton").className = isGroup ? "outline-button" : "button";
    memberWrap.hidden = !isGroup;

    showAllCarts();
}


/* ---------- MENU GRID ---------- */

function showMenu() {
    var html = "";
    var count = 0;

    for (var outletName in outletMenus) {
        if (selectedOutlet !== null && outletName !== selectedOutlet) continue;

        var items = outletMenus[outletName];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (selectedCategory !== "all" && item.category !== selectedCategory) continue;

            count++;
            html += '<article class="food-card">' +
                '<img src="' + item.img + '" alt="' + escapeHtml(item.name) + '">' +
                '<div class="food-info">' +
                '<h3>' + escapeHtml(item.name) + '</h3>' +
                '<p class="food-outlet">' + escapeHtml(outletName) + '</p>' +
                '<div class="food-bottom">' +
                '<b>₹' + item.price + '</b>' +
                '<button type="button" class="add-button" data-name="' + escapeHtml(item.name) +
                '" data-price="' + item.price + '">+ Add</button>' +
                '</div></div></article>';
        }
    }

    if (count === 0) {
        html = '<p class="muted menu-empty">No items found in this category.</p>';
    }
    foodList.innerHTML = html;

    // heading text
    var title = "All Menu Items";
    if (selectedOutlet !== null) title = selectedOutlet + " Menu";
    if (selectedCategory !== "all") title += " · " + CATEGORY_NAMES[selectedCategory];
    menuTitle.textContent = title;

    // "Show all outlets" button only when one outlet is open
    clearOutletButton.hidden = (selectedOutlet === null);

    // highlight the selected category button
    var categoryButtons = document.querySelectorAll("#categoryBar .side-item");
    for (var j = 0; j < categoryButtons.length; j++) {
        var name = categoryButtons[j].getAttribute("data-category");
        categoryButtons[j].classList.toggle("active", name === selectedCategory);
    }

    // if a picture cannot load, hide it
    var pictures = foodList.querySelectorAll("img");
    for (var k = 0; k < pictures.length; k++) {
        hideBrokenPicture(pictures[k]);
    }
}

function hideBrokenPicture(picture) {
    picture.addEventListener("error", function () {
        picture.classList.add("img-failed");
    });
}

// Go to the Menu page and show one outlet (or all if outletName is null)
function openMenu(outletName, category) {
    selectedOutlet = outletName;
    selectedCategory = category;
    showMenu();

    if (location.hash !== "#menu") {
        location.hash = "menu";
    } else {
        window.scrollTo(0, 0);
    }
}

function resetMenu() {
    selectedOutlet = null;
    selectedCategory = "all";
    showMenu();
}


/* ---------- CLICK HANDLERS (connected one by one) ---------- */

// Outlet card: open the menu of that outlet
function connectOutletCard(card) {
    var outletName = card.getAttribute("data-outlet");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", function () {
        openMenu(outletName, "all");
    });
    card.addEventListener("keydown", function (event) {
        if (event.key === "Enter") openMenu(outletName, "all");
    });
}

// Category button inside the Menu page
function connectCategoryButton(button) {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        selectedCategory = button.getAttribute("data-category");
        showMenu();
    });
}

// Category tile on the Home page (Burgers, Wraps ...)
function connectCategoryTile(tile) {
    tile.addEventListener("click", function (event) {
        event.preventDefault();
        openMenu(null, tile.getAttribute("data-category"));
    });
}

// Normal links to #menu show every item
function connectMenuLink(link) {
    link.addEventListener("click", resetMenu);
}

function connectMenuClicks() {
    var cards = document.querySelectorAll(".outlet-card[data-outlet]");
    for (var i = 0; i < cards.length; i++) connectOutletCard(cards[i]);

    var buttons = document.querySelectorAll("#categoryBar .side-item");
    for (var j = 0; j < buttons.length; j++) connectCategoryButton(buttons[j]);

    var tiles = document.querySelectorAll(".category[data-category]");
    for (var k = 0; k < tiles.length; k++) connectCategoryTile(tiles[k]);

    var links = document.querySelectorAll('a[href="#menu"]:not([data-category])');
    for (var m = 0; m < links.length; m++) connectMenuLink(links[m]);

    clearOutletButton.addEventListener("click", resetMenu);
}


/* ---------- ADD ITEM FROM THE MENU ---------- */

function handleMenuClick(event) {
    var button = event.target;
    if (!button.classList.contains("add-button")) return;

    var name = button.getAttribute("data-name");
    var price = Number(button.getAttribute("data-price"));

    if (orderMode === "group") {
        var member = menuMemberInput.value.trim();
        if (member.length < 2) {
            showErrors(memberWrap, { menuMemberName: "Enter the member's name (at least 2 letters) first." });
            return;
        }
        clearErrors(memberWrap);
        addToList(groupOrders, { member: member, item: name, quantity: 1, price: price });
    } else {
        addToList(personalOrders, { item: name, quantity: 1, price: price });
    }

    showAllCarts();
    showToast(name + " added", "success");
}


/* ---------- CART BUTTONS ( - + Remove ) ---------- */

function handleCartClick(event) {
    var button = event.target;
    var action = button.getAttribute("data-action");
    if (action === null) return;

    var list = personalOrders;
    if (button.getAttribute("data-cart") === "group") list = groupOrders;

    var index = Number(button.getAttribute("data-index"));
    if (list[index] === undefined) return;

    if (action === "inc") {
        if (list[index].quantity < 50) list[index].quantity++;
    } else if (action === "dec") {
        list[index].quantity--;
        if (list[index].quantity < 1) list.splice(index, 1);
    } else if (action === "remove") {
        list.splice(index, 1);
    }
    showAllCarts();
}


/* ---------- MANUAL ORDER FORM (Group Order page) ---------- */

function handleAddOrderClick() {
    var box = document.querySelector(".input-box");
    var member = document.getElementById("memberName").value.trim();
    var item = document.getElementById("foodItem").value.trim();
    var quantityText = document.getElementById("quantity").value;
    var priceText = document.getElementById("price").value;
    var quantity = Number(quantityText);
    var price = Number(priceText);
    var errors = {};

    if (member.length < 2) errors.memberName = "Enter the member's name (min 2 letters).";
    if (item.length < 2) errors.foodItem = "Enter a food item.";
    if (quantityText === "" || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        errors.quantity = "Whole number from 1 to 50.";
    }
    if (priceText === "" || isNaN(price) || price <= 0 || price > 10000) {
        errors.price = "Enter a price between 1 and 10000.";
    }

    if (Object.keys(errors).length > 0) {
        showErrors(box, errors);
        return;
    }
    clearErrors(box);

    addToList(groupOrders, { member: member, item: item, quantity: quantity, price: price });
    showAllCarts();
    showToast("Order added for " + member, "success");

    document.getElementById("memberName").value = "";
    document.getElementById("foodItem").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";
}


/* ---------- CHECKOUT BUTTONS ---------- */

// Save the cart and open checkout.html
function goToCheckout(mode) {
    var list = personalOrders;
    if (mode === "group") list = groupOrders;

    if (list.length === 0) {
        showToast("Your cart is empty. Add an item first.", "error");
        return;
    }

    var order = { mode: mode, groupCode: null, items: list };
    if (mode === "group") order.groupCode = GROUP_CODE;

    localStorage.setItem("cb_checkout", JSON.stringify(order));
    location.href = "checkout.html";
}


/* ---------- SEARCH OUTLETS ---------- */

function handleSearch() {
    var text = searchBox.value.trim().toLowerCase();
    var cards = document.querySelectorAll("#outlets .outlet-card");
    var shown = 0;

    for (var i = 0; i < cards.length; i++) {
        var matches = cards[i].textContent.toLowerCase().indexOf(text) !== -1;
        cards[i].style.display = matches ? "" : "none";
        if (matches) shown++;
    }

    document.getElementById("noResults").hidden = (shown !== 0);

    // go to the outlets section when the user searches
    if (text !== "" && location.hash !== "#outlets") location.hash = "outlets";
}


/* ---------- START THE HOME PAGE ---------- */

function startHomePage() {
    document.getElementById("groupModeButton").addEventListener("click", function () { changeMode("group"); });
    document.getElementById("separateModeButton").addEventListener("click", function () { changeMode("separate"); });
    document.getElementById("startSeparateOrder").addEventListener("click", function () { changeMode("separate"); });

    foodList.addEventListener("click", handleMenuClick);
    groupCartItems.addEventListener("click", handleCartClick);
    sideItems.addEventListener("click", handleCartClick);

    document.getElementById("addOrderButton").addEventListener("click", handleAddOrderClick);
    liveClear(memberWrap);
    liveClear(document.querySelector(".input-box"));

    sideButton.addEventListener("click", function () { goToCheckout(orderMode); });
    document.getElementById("confirmGroupButton").addEventListener("click", function () { goToCheckout("group"); });

    searchBox.addEventListener("input", handleSearch);

    connectMenuClicks();
    showMenu();
    loadCart();
    changeMode(orderMode);
}


/* =====================================================
   6. START EVERYTHING
   ===================================================== */

showAuthNav();
highlightNavLink();
window.addEventListener("hashchange", highlightNavLink);

setupSignupForm();
setupLoginForm();
setupContactForm();
setupCheckoutPage();

if (foodList !== null) startHomePage();
