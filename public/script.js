<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CampusBites</title>
    <link rel="stylesheet" href="style.css">
    <script src="common.js" defer></script>
    <script src="script.js" defer></script>
</head>

<body>

    <!-- NAVBAR -->
    <nav class="navbar">
        <a href="#home" class="logo">🍔 CampusBites</a>

        <div class="nav-links">
            <a href="#home" class="nav-link">Home</a>
            <a href="#outlets" class="nav-link">Outlets</a>
            <a href="#menu" class="nav-link">Menu</a>
            <a href="#group-order" class="nav-link">Group Order</a>
            <a href="contact.html" class="nav-link">Contact</a>
        </div>

        <div class="nav-buttons">
            <input class="search" id="searchBox"
                   type="text" placeholder="Search outlets...">
            <a href="#group-order" class="button">Group Cart</a>
            <span id="authNav" class="auth-nav"></span>
        </div>
    </nav>

    <main>

        <!-- HOME PAGE -->
        <section id="home" class="page">
            <div class="container">

                <div class="hero">
                    <span class="badge">Group Ordering Made Easy</span>

                    <h1>One Group. One Cart.<br>Everyone Orders.</h1>

                    <p>
                        Create a group order, add food for your friends,
                        and calculate everyone's share in one place.
                    </p>

                    <div class="buttons">
                        <a href="#group-order" class="button">
                            Start Group Order
                        </a>

                        <a href="#menu" class="outline-button"
                           id="startSeparateOrder">
                            Order Separately
                        </a>
                    </div>
                </div>

                <h2>What's on your mind?</h2>

                <div class="categories">
                    <a href="#menu" class="category" data-category="burgers">🍔<br>Burgers</a>
                    <a href="#menu" class="category" data-category="wraps">🌯<br>Wraps</a>
                    <a href="#menu" class="category" data-category="beverages">🥤<br>Beverages</a>
                    <a href="#menu" class="category" data-category="sides">🍟<br>Sides</a>
                </div>

                <div class="title-row">
                    <h2>Popular Campus Outlets</h2>
                    <a href="#outlets">View All →</a>
                </div>

                <div class="outlets">

                    <article class="outlet-card" data-outlet="Burger Singh">
                        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
                             alt="Burger">
                        <div class="outlet-info">
                            <div class="outlet-name">
                                <b>Burger Singh</b>
                                <span>⭐ 4.4</span>
                            </div>
                            <p>American, Fast Food</p>
                        </div>
                    </article>

                    <article class="outlet-card" data-outlet="Kathi Junction">
                        <img src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
                             alt="Rolls">
                        <div class="outlet-info">
                            <div class="outlet-name">
                                <b>Kathi Junction</b>
                                <span>⭐ 4.2</span>
                            </div>
                            <p>North Indian, Rolls</p>
                        </div>
                    </article>

                    <article class="outlet-card" data-outlet="Maggi Point">
                        <img src="https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80"
                             alt="Maggi">
                        <div class="outlet-info">
                            <div class="outlet-name">
                                <b>Maggi Point</b>
                                <span>⭐ 4.0</span>
                            </div>
                            <p>Maggi, Fast Food</p>
                        </div>
                    </article>

                    <article class="outlet-card" data-outlet="Greenox">
                        <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
                             alt="Healthy food">
                        <div class="outlet-info">
                            <div class="outlet-name">
                                <b>Greenox</b>
                                <span>⭐ 4.1</span>
                            </div>
                            <p>Healthy, Bowls, Smoothies</p>
                        </div>
                    </article>

                </div>
            </div>
        </section>


        <!-- OUTLETS PAGE -->
        <section id="outlets" class="page">
            <div class="container">

                <h2>Campus Outlets</h2>

                <p class="muted">
                    Explore food outlets available on campus.
                    Use the search box to filter them.
                </p>

                <p id="noResults" class="muted" hidden>No outlets match your search.</p>

                <div class="outlets">

                    <article class="outlet-card" data-outlet="Burger Singh">
                        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
                             alt="Burger">
                        <div class="outlet-info">
                            <div class="outlet-name">
                                <b>Burger Singh</b>
                                <span>⭐ 4.4</span>
                            </div>
                            <p>American, Fast Food</p>
                        </div>
                    </article>

                    <article class="outlet-card" data-outlet="Kathi Junction">
                        <img src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80"
                             alt="Rolls">
                        <div class="outlet-info">
                            <div class="outlet-name">
                                <b>Kathi Junction</b>
                                <span>⭐ 4.2</span>
                            </div>
                            <p>North Indian, Rolls</p>
                        </div>
                    </article>

                    <article class="outlet-card" data-outlet="Maggi Point">
                        <img src="https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80"
                             alt="Maggi">
                        <div class="outlet-info">
                            <div class="outlet-name">
                                <b>Maggi Point</b>
                                <span>⭐ 4.0</span>
                            </div>
                            <p>Maggi, Fast Food</p>
                        </div>
                    </article>

                    <article class="outlet-card" data-outlet="Greenox">
                        <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
                             alt="Healthy food">
                        <div class="outlet-info">
                            <div class="outlet-name">
                                <b>Greenox</b>
                                <span>⭐ 4.1</span>
                            </div>
                            <p>Healthy, Bowls, Smoothies</p>
                        </div>
                    </article>

                </div>
            </div>
        </section>


        <!-- MENU PAGE -->
        <section id="menu" class="page">
            <div class="container">

                <div class="menu-heading">
                    <h2>CampusBites Menu</h2>

                    <p class="muted">
                        Choose an ordering mode and add items to your cart.
                    </p>

                    <div class="order-mode-buttons">
                        <button type="button" id="groupModeButton"
                                class="button">
                            Group Order
                        </button>

                        <button type="button" id="separateModeButton"
                                class="outline-button">
                            Order Separately
                        </button>
                    </div>

                    <p id="modeMessage" class="muted">
                        Current mode: Group Order
                    </p>

                    <div id="memberNameWrap" class="field member-wrap">
                        <label for="menuMemberName">Ordering as (group member)</label>
                        <input id="menuMemberName" type="text" maxlength="50"
                               placeholder="e.g. Aman">
                        <small class="error" data-error-for="menuMemberName"></small>
                    </div>
                </div>


                <div class="menu-layout">

                    <!-- MENU CATEGORIES -->
                    <aside class="menu-side">
                        <h3>Categories</h3>

                        <a href="#menu" class="side-item active" data-category="all">All Items</a>
                        <a href="#menu" class="side-item" data-category="burgers">Burgers</a>
                        <a href="#menu" class="side-item" data-category="wraps">Wraps &amp; Rolls</a>
                        <a href="#menu" class="side-item" data-category="beverages">Beverages</a>
                        <a href="#menu" class="side-item" data-category="sides">Sides</a>
                        <a href="#menu" class="side-item" data-category="meals">Maggi &amp; Bowls</a>
                    </aside>

                    <!-- FOOD ITEMS - MAIN MIDDLE SECTION -->
                    <div class="menu-main">

                        <h3 id="selectedOutletName">All Menu Items</h3>

                        <button type="button" id="clearOutlet" class="outline-button clear-outlet" hidden>
                            ← Show all outlets
                        </button>

                        <div class="food-list" id="foodList"></div>

                    </div> <!-- End menu-main -->


                    <!-- CART -->
                    <aside class="cart">

                        <h3 id="personalCartTitle">
                            Personal Cart
                        </h3>

                        <p class="muted">
                            Items you add appear here. Use + / − to change quantity.
                        </p>

                        <div id="personalCartItems"></div>

                        <div class="summary" id="personalCartSummary"></div>

                        <button type="button"
                                class="button"
                                id="checkoutPersonalButton">
                            Place Separate Order
                        </button>

                    </aside>

                </div>
            </div>
        </section>


        <!-- GROUP ORDER PAGE -->
        <section id="group-order" class="page">
            <div class="container">

                <div class="group-heading">
                    <div>
                        <h2>Group Order</h2>

                        <p class="muted">
                            Add everyone's items to one cart and
                            calculate each member's share.
                        </p>
                    </div>

                    <span class="code">
                        Demo Group Code: <b>CB-7X2W</b>
                    </span>
                </div>


                <!-- MANUAL ORDER FORM -->
                <div class="input-box">

                    <h3>Add an Order Manually</h3>

                    <div class="form-grid">

                        <div>
                            <label for="memberName">Member Name</label>
                            <input id="memberName"
                                   type="text"
                                   placeholder="Enter member name" maxlength="50">
                            <small class="error" data-error-for="memberName"></small>
                        </div>

                        <div>
                            <label for="foodItem">Food Item</label>
                            <input id="foodItem"
                                   type="text"
                                   placeholder="Enter food item">
                            <small class="error" data-error-for="foodItem"></small>
                        </div>

                        <div>
                            <label for="quantity">Quantity</label>
                            <input id="quantity"
                                   type="number"
                                   min="1"
                                   step="1"
                                   placeholder="Quantity">
                            <small class="error" data-error-for="quantity"></small>
                        </div>

                        <div>
                            <label for="price">Price per item (₹)</label>
                            <input id="price"
                                   type="number"
                                   min="0"
                                   step="0.01"
                                   placeholder="Price">
                            <small class="error" data-error-for="price"></small>
                        </div>

                    </div>

                    <button type="button"
                            class="button"
                            id="addOrderButton">
                        Add Order
                    </button>

                </div>


                <!-- GROUP CART AND BILL SPLIT -->
                <div class="group-cart">

                    <h3>Group Cart</h3>

                    <p class="muted">
                        Orders added by group members appear below.
                    </p>

                    <div id="groupCartItems">
                        <div class="empty-cart">
                            Your group cart is empty.
                        </div>
                    </div>

                    <div class="member-bill" id="memberBill">
                        <h3>Bill Split</h3>
                        <p>
                            Add an order to calculate the total
                            and each member's share.
                        </p>
                    </div>

                </div>


                <!-- GROUP TOTAL -->
                <div class="grand-total">

                    <div>
                        <p>Group Total</p>
                        <h2 id="groupTotal">₹0.00</h2>
                    </div>

                    <button type="button"
                            class="button"
                            id="confirmGroupButton">
                        Confirm Group Order
                    </button>

                </div>

            </div>
        </section>

    </main>


    <!-- FOOTER -->
    <footer class="footer">

        <div>
            <h2>🍔 CampusBites</h2>
            <p>
                Making campus food ordering easier,
                one group at a time.
            </p>
        </div>

        <div>
            <h3>Explore</h3>
            <a href="#home">Home</a>
            <a href="#outlets">Outlets</a>
            <a href="#menu">Menu</a>
            <a href="contact.html">Contact</a>
        </div>

        <div>
            <h3>Ordering</h3>
            <a href="#menu">Order Separately</a>
            <a href="#group-order">Group Order</a>
        </div>

        <div>
            <h3>Account</h3>
            <a href="login.html">Login</a>
            <a href="signup.html">Sign Up</a>
        </div>

    </footer>
</body>
</html>