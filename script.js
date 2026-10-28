// CAMPUSBITES JAVASCRIPT

// Store orders in arrays
var groupOrders = [];
var personalOrders = [];

// The default ordering mode
var orderMode = "group";

// Delivery charge for the group order demonstration
var deliveryCharge = 45;


// GET HTML ELEMENTS

var menuButtons = document.querySelectorAll(".add-button");

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

for (var i = 0; i < menuButtons.length; i++) {

    menuButtons[i].addEventListener("click", function () {

        // Read the food name and price from HTML attributes
        var itemName = this.getAttribute("data-name");

        var itemPrice = Number(this.getAttribute("data-price"));


        // CHECK THE SELECTED ORDERING MODE

        if (orderMode === "separate") {

            // Ask the customer for the quantity
            var quantityText = prompt(
                "How many " + itemName + " would you like?"
            );

            if (quantityText === null) {
                return;
            }

            var quantity = Number(quantityText);


            // Validate the quantity
            if (
                quantityText.trim() === "" ||
                quantity < 1 ||
                quantity % 1 !== 0
            ) {

                alert("Please enter a whole number of at least 1.");

                return;
            }


            // Create a personal order object
            var personalOrder = {

                item: itemName,

                quantity: quantity,

                price: itemPrice

            };


            // Add the object to the personal orders array
            personalOrders.push(personalOrder);


            // Update the personal cart
            showPersonalCart();

            alert(itemName + " added to your personal cart.");

        } else {

            // Ask which member is ordering the item
            var member = prompt("Enter the group member's name:");

            if (member === null) {
                return;
            }

            if (member.trim() === "") {

                alert("Please enter a member name.");

                return;
            }


            // Create a group order object
            var groupOrder = {

                member: member.trim(),

                item: itemName,

                quantity: 1,

                price: itemPrice

            };


            // Add the object to the group orders array
            groupOrders.push(groupOrder);


            // Update the group cart and bill
            showGroupCart();

            alert(itemName + " added to the group cart.");
        }

    });

}


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

    if (event.target.className.indexOf("remove-personal") !== -1) {

        var itemIndex = Number(
            event.target.getAttribute("data-index")
        );


        // Remove selected item
        personalOrders.splice(itemIndex, 1);


        // Update the personal cart
        showPersonalCart();

    }

});


// PLACE SEPARATE ORDER

document.getElementById("checkoutPersonalButton").addEventListener("click", function () {

    if (personalOrders.length === 0) {

        alert("Your personal cart is empty. Add an item first.");

    } else {

        var total = getPersonalTotal();

        alert(
            "Your separate order is confirmed in this demo.\n" +
            "Total: ₹" + total.toFixed(2) +
            "\nNo real order or payment has been made."
        );


        // Empty the personal cart after confirmation
        personalOrders = [];

        showPersonalCart();

    }

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

    // Open the modal
    confirmationModal.style.display = "flex";
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