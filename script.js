// =====================================
// CampusBites - JavaScript
// =====================================

// Delivery charge
var delivery = 45;

// Selected outlet
var currentOutlet = "Burger Singh";

// Ordering mode: individual or group
var orderMode = "individual";

// Individual cart starts EMPTY
var individualCart = [];

// Group starts EMPTY
var groupMembers = {};
var groupCreated = false;
var groupName = "";
var hostName = "";

// Group code
var groupCode = "";


// =====================================
// FOOD OUTLETS AND THEIR MENUS
// =====================================

var outlets = [
    {
        name: "Burger Singh",
        rating: 4.4,
        tags: "American, Fast Food",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
        menu: [
            {
                id: "bs1",
                name: "Spicy Amritsari Burger",
                price: 189,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "bs2",
                name: "Paneer Burger",
                price: 169,
                image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "bs3",
                name: "Malabar Fries",
                price: 99,
                image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "bs4",
                name: "Saffron Cold Coffee",
                price: 120,
                image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },

    {
        name: "Kathi Junction",
        rating: 4.2,
        tags: "North Indian, Rolls",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80",
        menu: [
            {
                id: "kj1",
                name: "Paneer Kathi Roll",
                price: 140,
                image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "kj2",
                name: "Aloo Tikki Roll",
                price: 100,
                image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "kj3",
                name: "Veg Cheese Roll",
                price: 130,
                image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },

    {
        name: "Maggi Point",
        rating: 4.0,
        tags: "Maggi, Fast Food",
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80",
        menu: [
            {
                id: "mp1",
                name: "Classic Masala Maggi",
                price: 60,
                image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "mp2",
                name: "Cheese Maggi",
                price: 90,
                image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "mp3",
                name: "Veggie Maggi",
                price: 80,
                image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },

    {
        name: "Greenox",
        rating: 4.1,
        tags: "Healthy, Bowls, Smoothies",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
        menu: [
            {
                id: "gx1",
                name: "Fresh Green Salad",
                price: 130,
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "gx2",
                name: "Fruit Bowl",
                price: 110,
                image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=300&q=80"
            },
            {
                id: "gx3",
                name: "Healthy Veg Bowl",
                price: 160,
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80"
            }
        ]
    }
];


// =====================================
// INITIAL SETUP
// =====================================

window.onload = function () {
    showOutlets();
    showMenu();
    updateCart();
    showGroup();
};


// Get the menu of the selected outlet
function getCurrentMenu() {
    for (var i = 0; i < outlets.length; i++) {
        if (outlets[i].name === currentOutlet) {
            return outlets[i].menu;
        }
    }

    return [];
}


// =====================================
// SHOW OUTLETS
// =====================================

function showOutlets() {
    var text = "";

    for (var i = 0; i < outlets.length; i++) {
        text +=
            '<div class="outlet-card" onclick="selectOutlet(' + i + ')">' +
                '<img src="' + outlets[i].image + '" alt="' + outlets[i].name + '">' +
                '<div class="outlet-info">' +
                    '<div class="outlet-name">' +
                        '<b>' + outlets[i].name + '</b>' +
                        '<span>⭐ ' + outlets[i].rating + '</span>' +
                    '</div>' +
                    '<p>' + outlets[i].tags + '</p>' +
                '</div>' +
            '</div>';
    }

    document.getElementById("homeOutlets").innerHTML = text;
    document.getElementById("allOutlets").innerHTML = text;
}


// Select an outlet and display its menu
function selectOutlet(index) {
    currentOutlet = outlets[index].name;

    document.getElementById("menuTitle").innerHTML = currentOutlet;

    var description = document.querySelector(".menu-heading .muted");

    if (description) {
        description.innerHTML = "Menu from " + currentOutlet;
    }

    showMenu();
    updateCart();
    switchPage("menu");
}


// =====================================
// INDIVIDUAL ORDERING
// =====================================

// Call this when the user chooses to order separately
function startIndividualOrder() {
    orderMode = "individual";

    currentOutlet = "Burger Singh";

    document.getElementById("menuTitle").innerHTML = currentOutlet;

    showMenu();
    updateCart();
    switchPage("outlets");
}


// Get the cart currently being used
function getCurrentCart() {
    if (orderMode === "group" && groupCreated) {
        if (!groupMembers[hostName]) {
            groupMembers[hostName] = [];
        }

        return groupMembers[hostName];
    }

    return individualCart;
}


// =====================================
// SHOW MENU ITEMS
// =====================================

function showMenu() {
    var text = "";
    var menuItems = getCurrentMenu();
    var cart = getCurrentCart();

    for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];
        var quantity = 0;

        // Check whether this item is already in the cart
        for (var j = 0; j < cart.length; j++) {
            if (cart[j].id === item.id) {
                quantity = cart[j].qty;
                break;
            }
        }

        text +=
            '<div class="food-card">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +

                '<div class="food-info">' +
                    '<h3>' + item.name + '</h3>' +

                    '<div class="food-bottom">' +
                        '<b>₹' + item.price + '</b>' +

                        (quantity === 0
                            ? '<button class="add-button" onclick="addFood(\'' + item.id + '\')">+ Add</button>'
                            : '<div class="quantity-control">' +
                                '<button onclick="changeQuantity(\'' + item.id + '\', -1)">−</button>' +
                                '<span>' + quantity + '</span>' +
                                '<button onclick="changeQuantity(\'' + item.id + '\', 1)">+</button>' +
                              '</div>'
                        ) +

                    '</div>' +
                '</div>' +
            '</div>';
    }

    document.getElementById("foodList").innerHTML = text;
}


// =====================================
// ADD FOOD TO CART
// =====================================

function addFood(id) {
    var menuItems = getCurrentMenu();
    var selectedItem = null;

    // Find the selected food item
    for (var i = 0; i < menuItems.length; i++) {
        if (menuItems[i].id === id) {
            selectedItem = menuItems[i];
            break;
        }
    }

    if (!selectedItem) {
        return;
    }

    var cart = getCurrentCart();
    var found = false;

    // Increase quantity if the item is already in the cart
    for (var j = 0; j < cart.length; j++) {
        if (cart[j].id === id) {
            cart[j].qty++;
            found = true;
            break;
        }
    }

    // Otherwise add it as a new cart item
    if (!found) {
        cart.push({
            id: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price,
            image: selectedItem.image,
            outlet: currentOutlet,
            qty: 1
        });
    }

    refreshEverything();
}


// =====================================
// INCREASE OR DECREASE QUANTITY
// =====================================

function changeQuantity(id, change) {
    var cart = getCurrentCart();

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].qty += change;

            // Remove the item when quantity reaches zero
            if (cart[i].qty <= 0) {
                cart.splice(i, 1);
            }

            break;
        }
    }

    refreshEverything();
}


// Update menu, cart, group, and totals
function refreshEverything() {
    showMenu();
    updateCart();
    showGroup();
}


// =====================================
// UPDATE BASKET PREVIEW
// =====================================

function updateCart() {
    var text = "";
    var subtotal = 0;
    var cart = getCurrentCart();

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var amount = item.price * item.qty;

        subtotal += amount;

        text +=
            '<div class="cart-item">' +
                '<div>' +
                    '<b>' + item.name + '</b>' +
                    '<p>' + item.outlet + '</p>' +

                    '<div class="quantity-control">' +
                        '<button onclick="changeQuantity(\'' + item.id + '\', -1)">−</button>' +
                        '<span>' + item.qty + '</span>' +
                        '<button onclick="changeQuantity(\'' + item.id + '\', 1)">+</button>' +
                    '</div>' +
                '</div>' +

                '<b>₹' + amount + '</b>' +
            '</div>';
    }

    if (cart.length === 0) {
        text = '<p class="muted">Your cart is empty. Add some food to get started!</p>';
    }

    document.getElementById("cartItems").innerHTML = text;
    document.getElementById("subtotal").innerHTML = "₹" + subtotal;

    var total = subtotal > 0 ? subtotal + delivery : 0;
    document.getElementById("total").innerHTML = "₹" + total;
}


// =====================================
// CREATE A GROUP ORDER
// =====================================

function createGroupOrder() {
    if (groupCreated) {
        orderMode = "group";
        showMenu();
        updateCart();
        showGroup();
        switchPage("live-group");
        return;
    }

    var enteredGroupName = prompt("Enter a name for your group:");

    if (!enteredGroupName || enteredGroupName.trim() === "") {
        return;
    }

    var enteredHostName = prompt("Enter your name:");

    if (!enteredHostName || enteredHostName.trim() === "") {
        return;
    }

    groupName = enteredGroupName.trim();
    hostName = enteredHostName.trim();

    groupCode = "CB-" + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Start the group with one member and an EMPTY cart
    groupMembers = {};
    groupMembers[hostName] = [];

    groupCreated = true;
    orderMode = "group";

    updateGroupHeading();
    showGroup();
    showMenu();
    updateCart();

    switchPage("live-group");
}


// Update the group heading and code
function updateGroupHeading() {
    var heading = document.querySelector(".group-heading h2");
    var code = document.querySelector(".group-heading .code");

    if (heading) {
        heading.innerHTML = groupName;
    }

    if (code) {
        code.innerHTML = "Code: <b>" + groupCode + "</b>";
    }
}


// =====================================
// INVITE A FRIEND
// =====================================

function addFriend() {
    if (!groupCreated) {
        alert("Please create a group first.");
        return;
    }

    var name = prompt("Enter your friend's name:");

    if (!name || name.trim() === "") {
        return;
    }

    name = name.trim();

    if (groupMembers[name]) {
        alert("This member has already joined the group.");
        return;
    }

    // The new member starts with an EMPTY cart
    groupMembers[name] = [];

    showGroup();
}


// =====================================
// SHOW GROUP MEMBERS AND THEIR ITEMS
// =====================================

function showGroup() {
    var squad = document.getElementById("squad");
    var grandTotalElement = document.getElementById("grandTotal");

    if (!squad || !grandTotalElement) {
        return;
    }

    if (!groupCreated) {
        squad.innerHTML =
            '<p class="muted">No group created yet. Start a group order to invite friends.</p>';

        grandTotalElement.innerHTML = "₹0";
        return;
    }

    var text = "";
    var grandTotal = 0;

    for (var name in groupMembers) {
        var memberCart = groupMembers[name];
        var memberTotal = 0;
        var itemsText = "";

        for (var i = 0; i < memberCart.length; i++) {
            var item = memberCart[i];
            var amount = item.price * item.qty;

            memberTotal += amount;

            itemsText +=
                '<div class="squad-item">' +
                    '<span>' + item.name + ' × ' + item.qty + '</span>' +
                    '<b>₹' + amount + '</b>' +
                '</div>';
        }

        if (memberCart.length === 0) {
            itemsText = '<p class="muted">No items added yet.</p>';
        }

        grandTotal += memberTotal;

        text +=
            '<div class="squad-card">' +
                '<div class="user">' +
                    '<span class="avatar">' + name.charAt(0).toUpperCase() + '</span>' +
                    '<b>' + name + '</b>' +
                '</div>' +

                itemsText +

                '<div class="user-total">' +
                    '<span>Subtotal</span>' +
                    '<b>₹' + memberTotal + '</b>' +
                '</div>' +
            '</div>';
    }

    squad.innerHTML = text;

    if (grandTotal > 0) {
        grandTotal += delivery;
    }

    grandTotalElement.innerHTML = "₹" + grandTotal;
}


// =====================================
// SHOW BILL SPLIT
// =====================================

function showBill() {
    var billText = "";
    var progressText = "";
    var legendText = "";
    var groupSubtotal = 0;
    var totals = {};

    var people = orderMode === "group" && groupCreated
        ? groupMembers
        : {"You": individualCart};

    // Calculate each member's subtotal
    for (var person in people) {
        var memberTotal = 0;

        for (var i = 0; i < people[person].length; i++) {
            memberTotal += people[person][i].price * people[person][i].qty;
        }

        totals[person] = memberTotal;
        groupSubtotal += memberTotal;
    }

    var grandTotal = groupSubtotal > 0 ? groupSubtotal + delivery : 0;

    document.getElementById("splitTotal").innerHTML = "₹" + grandTotal;

    var colors = [
        "#E53935",
        "#FB8C00",
        "#00ACC1",
        "#8E24AA",
        "#43A047",
        "#3949AB"
    ];

    var personIndex = 0;

    for (var person in people) {
        var amount = totals[person];

        var percent = groupSubtotal > 0
            ? Math.round((amount / groupSubtotal) * 100)
            : 0;

        var color = colors[personIndex % colors.length];
        personIndex++;

        progressText +=
            '<div style="width:' + percent + '%; background:' + color + '"></div>';

        legendText +=
            '<span>● ' + person + ': ' + percent + '% </span>';

        var items = "";

        for (var j = 0; j < people[person].length; j++) {
            items += people[person][j].name + " × " + people[person][j].qty;

            if (j < people[person].length - 1) {
                items += ", ";
            }
        }

        if (items === "") {
            items = "No items";
        }

        billText +=
            '<div class="bill-row">' +
                '<b>' + person + '</b>' +
                '<span>' + items + '</span>' +
                '<span>' + percent + '%</span>' +
                '<b>₹' + amount + '</b>' +
            '</div>';
    }

    document.getElementById("progress").innerHTML = progressText;
    document.getElementById("legend").innerHTML = legendText;

    document.getElementById("billTable").innerHTML =
        '<div class="bill-head">' +
            '<b>Member</b>' +
            '<b>Items</b>' +
            '<b>Share</b>' +
            '<b>Amount</b>' +
        '</div>' + billText;
}


// =====================================
// CHANGE PAGES
// =====================================

function switchPage(pageName, navButton) {
    // Create a group if the user opens the group page for the first time
    if (pageName === "live-group" && !groupCreated) {
        createGroupOrder();
        return;
    }

    var pages = document.getElementsByClassName("page");

    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }

    var selectedPage = document.getElementById("page-" + pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    if (navButton) {
        var links = document.getElementsByClassName("nav-link");

        for (var j = 0; j < links.length; j++) {
            links[j].classList.remove("active");
        }

        navButton.classList.add("active");
    }

    window.scrollTo(0, 0);

    if (pageName === "live-group") {
        showGroup();
    }

    if (pageName === "bill-split") {
        showBill();
    }
}


// =====================================
// DARK AND LIGHT MODE
// =====================================

function toggleTheme() {
    if (document.body.className === "light") {
        document.body.className = "dark";
        document.getElementById("themeButton").innerHTML = "🌙 Dark";
    } else {
        document.body.className = "light";
        document.getElementById("themeButton").innerHTML = "☀️ Light";
    }
}