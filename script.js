// CAMPUSBITES JAVASCRIPT
console.log("CampusBites JavaScript loaded successfully!");
// Store orders in arrays
var groupOrders = [];
var personalOrders = [];

// The default ordering mode
var orderMode = "group";

// Delivery charge for the group order demonstration
var deliveryCharge = 45;


// GET HTML ELEMENTS

var menuButtons = document.querySelectorAll(".add-button");

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


function showOutletMenu(outletName) {

    var foodList = document.getElementById("foodList");
    var heading = document.getElementById("selectedOutletName");
    var items = outletMenus[outletName];

    if (!items) {
        return;
    }

    heading.textContent = outletName + " Menu";
    foodList.innerHTML = "";

    for (var i = 0; i < items.length; i++) {

        var item = items[i];
        var card = document.createElement("article");

        card.className = "food-card";

        card.innerHTML =
            '<div class="food-info">' +
            '<h3>' + safeText(item.name) + '</h3>' +
            '<p>₹' + item.price + '</p>' +
            '<button type="button" class="add-button" ' +
            'data-name="' + safeText(item.name) + '" ' +
            'data-price="' + item.price + '">' +
            'Add to Cart</button>' +
            '</div>';

        foodList.appendChild(card);
    }

    window.location.hash = "menu";
}


document.querySelectorAll(".outlet-card[data-outlet]").forEach(function(card) {
    card.addEventListener("click", function() {
        var outletName = card.getAttribute("data-outlet");
        showOutletMenu(outletName);
    });
});

var memberNameInput = document.getElementById("memberName");
var foodItemInput = document.getElementById("foodItem");
var quantityInput = document.getElementById("quantity");
var priceInput = document.getElementById("price");

var groupCartItems = document.getElementById("groupCartItems");
var memberBill = document.getElementById("memberBill");
var groupTotal = document.getElementById("groupTotal");

var searchBox = document.getElementById("searchBox");


// CHANGE ORDERING MODE

function changeMode(mode) {

    orderMode = mode;

    var modeMessage = document.getElementById("modeMessage");

    if (mode === "group") {

        modeMessage.textContent =
            "Current mode: Group Order. Add items for different members.";

        document.getElementById("groupModeButton").className = "button";

        document.getElementById("separateModeButton").className =
            "outline-button";

    } else {

        modeMessage.textContent =
            "Current mode: Order Separately. Items go into your personal cart.";

        document.getElementById("groupModeButton").className =
            "outline-button";

        document.getElementById("separateModeButton").className = "button";
    }
    if (mode === "group") {
    showMenuGroupCart();
} else {
    showPersonalCart();
}
}


// GROUP ORDER BUTTON

document.getElementById("groupModeButton").addEventListener("click", function () {

    changeMode("group");

});


// ORDER SEPARATELY BUTTON

document.getElementById("separateModeButton").addEventListener("click", function () {

    changeMode("separate");

});


// HOME PAGE ORDER SEPARATELY BUTTON

document.getElementById("startSeparateOrder").addEventListener("click", function () {

    changeMode("separate");

});


 // ADD FOOD ITEMS FROM THE MENU


document.getElementById("foodList").addEventListener("click", function (event) {

    if (event.target.className !== "add-button") {
        return;
    }

    var itemName = event.target.getAttribute("data-name");
    var itemPrice = Number(event.target.getAttribute("data-price"));

    // DEBUG: Check which food was selected
console.log("Food selected:", itemName);
console.log("Food price:", itemPrice);
console.log("Current order mode:", orderMode);


    if (orderMode === "separate") {

        var quantityText = prompt("Enter quantity for " + itemName);

        if (quantityText === null) {
            return;
        }

        var quantity = Number(quantityText);

        if (quantityText.trim() === "" ||
            quantity < 1 || quantity % 1 !== 0) {
            alert("Enter a valid whole-number quantity.");
            return;
        }

        personalOrders.push({
            item: itemName,
            quantity: quantity,
            price: itemPrice
        });

        showPersonalCart();

    } else {

        var member = prompt("Enter group member name:");

        if (member === null || member.trim() === "") {
            alert("Please enter a member name.");
            return;
        }

        groupOrders.push({
            member: member.trim(),
            item: itemName,
            quantity: 1,
            price: itemPrice
        });

        showGroupCart();
        showMenuGroupCart();
    }

});



// ADD A MANUAL ORDER TO THE GROUP CART

document.getElementById("addOrderButton").addEventListener("click", function () {

    var member = memberNameInput.value.trim();

    var item = foodItemInput.value.trim();

    var quantity = Number(quantityInput.value);

    var price = Number(priceInput.value);


    // CHECK THAT ALL FIELDS ARE FILLED

    if (
        member === "" ||
        item === "" ||
        quantityInput.value === "" ||
        priceInput.value === ""
    ) {

        alert("Please fill in all four fields.");

        return;
    }


    // CHECK QUANTITY AND PRICE

    if (
        quantity < 1 ||
        quantity % 1 !== 0 ||
        price < 0
    ) {

        alert("Quantity must be a whole number of at least 1.");

        return;
    }


    // CREATE AN ORDER OBJECT

    var order = {

        member: member,

        item: item,

        quantity: quantity,

        price: price

    };


    // ADD ORDER TO ARRAY

    groupOrders.push(order);


    // UPDATE GROUP CART

    showGroupCart();


    // CLEAR THE FORM

    memberNameInput.value = "";

    foodItemInput.value = "";

    quantityInput.value = "";

    priceInput.value = "";

});


// DISPLAY GROUP CART AND CALCULATE BILL

function showGroupCart() {

    var output = "";

    var subtotal = 0;


    // Arrays to store member names and their totals
    var memberNames = [];

    var memberTotals = [];


    // CHECK WHETHER THE GROUP CART IS EMPTY

    if (groupOrders.length === 0) {

        output = '<div class="empty-cart">Your group cart is empty.</div>';

    } else {

        // LOOP THROUGH ALL GROUP ORDERS
        for (var i = 0; i < groupOrders.length; i++) {

            var order = groupOrders[i];

            var itemTotal = order.quantity * order.price;

            subtotal = subtotal + itemTotal;


            // DISPLAY THE ORDER
            output += '<div class="order-row">';

            output += "<b>" + safeText(order.member) + "</b> — ";

            output += safeText(order.item) + " × " + order.quantity;

            output += " — ₹" + itemTotal.toFixed(2);

            output +=
                ' <button type="button" class="outline-button remove-group" data-index="' +
                i + '">Remove</button>';

            output += "</div>";


            // CHECK WHETHER THIS MEMBER ALREADY EXISTS
            var memberIndex = memberNames.indexOf(order.member);


            if (memberIndex === -1) {

                // Add a new member
                memberNames.push(order.member);

                memberTotals.push(itemTotal);

            } else {

                // Add the amount to the existing member's total
                memberTotals[memberIndex] =
                    memberTotals[memberIndex] + itemTotal;
            }

        }

    }


    // DISPLAY ALL GROUP ORDERS

    groupCartItems.innerHTML = output;


    // CALCULATE GROUP TOTAL

    var delivery = 0;

    if (groupOrders.length > 0) {

        delivery = deliveryCharge;

    }

    var total = subtotal + delivery;

    groupTotal.textContent = "₹" + total.toFixed(2);


    // DISPLAY BILL BREAKDOWN

    var billOutput = "<h3>Bill Split</h3>";

    billOutput +=
        "<p>Subtotal: ₹" + subtotal.toFixed(2) + "</p>";

    billOutput +=
        "<p>Delivery charge: ₹" + delivery.toFixed(2) + "</p>";

    billOutput +=
        "<p><b>Group total: ₹" + total.toFixed(2) + "</b></p>";


    // CALCULATE EACH MEMBER'S SHARE

    if (memberNames.length === 0) {

        billOutput +=
            "<p>Add an order to calculate each member's share.</p>";

    } else {

        for (var j = 0; j < memberNames.length; j++) {

            var deliveryShare = delivery / memberNames.length;

            var memberShare = memberTotals[j] + deliveryShare;

            billOutput +=
                "<p>" +
                safeText(memberNames[j]) +
                " pays: <b>₹" +
                memberShare.toFixed(2) +
                "</b></p>";

        }

    }


    // DISPLAY THE BILL

    memberBill.innerHTML = billOutput;

}


function showMenuGroupCart() {

    var itemsArea = document.getElementById("personalCartItems");
    var summaryArea = document.getElementById("personalCartSummary");
    var output = "";
    var subtotal = 0;

    for (var i = 0; i < groupOrders.length; i++) {

        var order = groupOrders[i];
        var itemTotal = order.quantity * order.price;

        subtotal = subtotal + itemTotal;

        output += '<div class="order-row">';
        output += safeText(order.member) + " — ";
        output += safeText(order.item) + " × " + order.quantity;
        output += " — ₹" + itemTotal.toFixed(2);

        output += ' <button type="button" ' +
            'class="outline-button remove-menu-group" ' +
            'data-index="' + i + '">Remove</button>';

        output += '</div>';
    }

    if (groupOrders.length === 0) {
        output = '<p class="muted">Your group cart is empty.</p>';
    }

    itemsArea.innerHTML = output;

    var delivery = groupOrders.length > 0 ? deliveryCharge : 0;
    var total = subtotal + delivery;

    summaryArea.innerHTML =
        '<div><span>Subtotal</span><span>₹' +
        subtotal.toFixed(2) + '</span></div>' +

        '<div><span>Delivery</span><span>₹' +
        delivery.toFixed(2) + '</span></div>' +

        '<div class="total"><span>Grand Total</span><span>₹' +
        total.toFixed(2) + '</span></div>';
}




// REMOVE ITEMS FROM GROUP CART

groupCartItems.addEventListener("click", function (event) {

    // Check whether the clicked element is a Remove button
    if (event.target.className.indexOf("remove-group") !== -1) {

        var itemIndex = Number(
            event.target.getAttribute("data-index")
        );


        // Remove the selected item from the array
        groupOrders.splice(itemIndex, 1);


        // Refresh the cart and bill
        showGroupCart();

    }

});


// CALCULATE PERSONAL CART TOTAL

function getPersonalTotal() {

    var total = 0;


    // Add the total price of every personal order
    for (var i = 0; i < personalOrders.length; i++) {

        total = total +
            personalOrders[i].quantity * personalOrders[i].price;

    }

    return total;

}


// DISPLAY PERSONAL CART

function showPersonalCart() {

    var itemsArea = document.getElementById("personalCartItems");

    var summaryArea = document.getElementById("personalCartSummary");

    var output = "";

    var subtotal = getPersonalTotal();


    // CHECK WHETHER THE CART IS EMPTY

    if (personalOrders.length === 0) {

        output = '<div class="empty-cart">Your personal cart is empty.</div>';

    } else {

        // DISPLAY EACH PERSONAL ORDER
        for (var i = 0; i < personalOrders.length; i++) {

            var order = personalOrders[i];

            var itemTotal = order.quantity * order.price;

            output += '<div class="order-row">';

            output += safeText(order.item) + " × " + order.quantity;

            output += " — ₹" + itemTotal.toFixed(2);

            output +=
                ' <button type="button" class="outline-button remove-personal" data-index="' +
                i + '">Remove</button>';

            output += "</div>";

        }

    }


    // UPDATE CART ITEMS

    itemsArea.innerHTML = output;


    // UPDATE PRICE SUMMARY

    summaryArea.innerHTML =
        "<div><span>Subtotal</span><span>₹" +
        subtotal.toFixed(2) +
        "</span></div>" +

        '<div class="total"><span>Total</span><span>₹' +
        subtotal.toFixed(2) +
        "</span></div>";

}


// REMOVE ITEMS FROM PERSONAL CART


document.getElementById("personalCartItems").addEventListener("click", function (event) {

    var button = event.target;

    if (button.classList.contains("remove-personal")) {

        var index = Number(button.getAttribute("data-index"));

        personalOrders.splice(index, 1);

        showPersonalCart();

    } else if (button.classList.contains("remove-menu-group")) {

        var index = Number(button.getAttribute("data-index"));

        groupOrders.splice(index, 1);

        showGroupCart();
        showMenuGroupCart();
    }

});



// PLACE SEPARATE ORDER


document.getElementById("checkoutPersonalButton").addEventListener("click", function () {

    if (orderMode !== "separate") {
        alert("Please select Order Separately before placing your personal order.");
        return;
    }

    if (personalOrders.length === 0) {
        alert("Your personal cart is empty. Add an item first.");
        return;
    }

    var total = getPersonalTotal();
    var output = "Order Summary\n\n";

    for (var i = 0; i < personalOrders.length; i++) {

        var order = personalOrders[i];
        var itemTotal = order.quantity * order.price;

        output += order.item + " x " + order.quantity +
            " = ₹" + itemTotal.toFixed(2) + "\n";
    }

    output += "\nTotal Amount: ₹" + total.toFixed(2);
    output += "\n\nYour order has been placed!";

    alert(output);

    // Clear the cart after placing the order
    personalOrders = [];

    showPersonalCart();

});




 // CONFIRM GROUP ORDER AND SHOW MODAL

var confirmationModal =
    document.getElementById("confirmationModal");

var confirmationDetails =
    document.getElementById("confirmationDetails");

var closeConfirmation =
    document.getElementById("closeConfirmation");


document.getElementById("confirmGroupButton").addEventListener("click", function () {

    // Check whether the group cart is empty
    if (groupOrders.length === 0) {
        alert("Please add at least one item before confirming.");
        return;
    }

    var subtotal = 0;
    var output = "";

    // Display all ordered items
    for (var i = 0; i < groupOrders.length; i++) {

        var order = groupOrders[i];
        var itemTotal = order.quantity * order.price;

        subtotal = subtotal + itemTotal;

        output += '<div class="confirmation-item">';
        output += '<span>' +
            safeText(order.item) +
            ' × ' + order.quantity +
            '</span>';

        output += '<span>₹' +
            itemTotal.toFixed(2) +
            '</span>';

        output += '</div>';
    }

    // Calculate final total
    var delivery = deliveryCharge;
    var total = subtotal + delivery;

    // Show bill summary
    confirmationDetails.innerHTML =
        '<div class="confirmation-details">' +
            '<h3>Order Summary</h3>' +
            output +
            '<div class="confirmation-item">' +
                '<span>Delivery Charge</span>' +
                '<span>₹' + delivery.toFixed(2) + '</span>' +
            '</div>' +
            '<div class="confirmation-total">' +
                '<span>Total Amount</span>' +
                '<span>₹' + total.toFixed(2) + '</span>' +
            '</div>' +
        '</div>';

    // Open the confirmation modal
confirmationModal.style.display = "flex";

// Clear the group cart after preparing the receipt
groupOrders = [];

showGroupCart();
showMenuGroupCart();
    
});


// CLOSE THE MODAL

closeConfirmation.addEventListener("click", function () {
    confirmationModal.style.display = "none";
});


// Close when clicking outside the popup

confirmationModal.addEventListener("click", function (event) {

    if (event.target === confirmationModal) {
        confirmationModal.style.display = "none";
    }

});



// SEARCH OUTLETS

searchBox.addEventListener("input", function () {

    var searchText = searchBox.value.toLowerCase();

    var outletCards = document.querySelectorAll(".outlet-card");


    // CHECK EVERY OUTLET CARD
    for (var i = 0; i < outletCards.length; i++) {

        var cardText = outletCards[i].textContent.toLowerCase();


        // SHOW MATCHING OUTLETS
        if (cardText.indexOf(searchText) !== -1) {

            outletCards[i].style.display = "";

        } else {

            outletCards[i].style.display = "none";

        }

    }

});


// KEEP USER INPUT AS TEXT

function safeText(text) {

    var element = document.createElement("span");

    element.textContent = text;

    return element.innerHTML;

}


// DISPLAY EMPTY CARTS WHEN THE WEBSITE OPENS

showGroupCart();

showPersonalCart();