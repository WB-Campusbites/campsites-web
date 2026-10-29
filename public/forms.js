// Form handling for signup.html, login.html, contact.html and checkout.html.
// Flow for each form: validate in the browser -> POST to the server -> show result.

(function () {

    // Generic submit handler used by every form
    function setupForm(formId, validate, endpoint, buildPayload, onSuccess) {
        var form = document.getElementById(formId);
        if (!form) return;
        var button = form.querySelector('button[type="submit"]');
        CB.liveClear(form);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var errors = validate(form);
            if (Object.keys(errors).length) {
                CB.showErrors(form, errors);
                CB.toast("Please fix the highlighted fields.", "error");
                return;
            }
            CB.clearErrors(form);

            var originalText = button.textContent;
            button.disabled = true;
            button.textContent = "Please wait...";

            CB.postJSON(endpoint, buildPayload(form))
                .then(function (result) {
                    if (result.ok) {
                        onSuccess(result.body, form);
                    } else {
                        CB.showErrors(form, result.body.errors || {});
                        CB.toast((result.body.errors && result.body.errors.items) ||
                                 "Could not submit. Check the form.", "error");
                    }
                })
                .catch(function () {
                    CB.toast("Cannot reach the server. Is it running (npm start)?", "error");
                })
                .then(function () {
                    button.disabled = false;
                    button.textContent = originalText;
                });
        });
    }

    function val(form, id) { return form.querySelector("#" + id).value.trim(); }

    /* ---------- SIGN UP ---------- */
    setupForm("signupForm",
        function (f) {
            var e = {};
            if (val(f, "name").length < 2) e.name = "Name must be at least 2 characters.";
            if (!CB.EMAIL_RE.test(val(f, "email"))) e.email = "Enter a valid email address.";
            if (!CB.PHONE_RE.test(val(f, "phone"))) e.phone = "Enter a valid 10-digit mobile number.";
            var pw = f.querySelector("#password").value;
            if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) {
                e.password = "Use 8+ characters with a letter and a number.";
            }
            if (f.querySelector("#confirmPassword").value !== pw) {
                e.confirmPassword = "Passwords do not match.";
            }
            return e;
        },
        "/api/signup",
        function (f) {
            return { name: val(f, "name"), email: val(f, "email"), phone: val(f, "phone"),
                     password: f.querySelector("#password").value };
        },
        function (body) {
            CB.setUser(body.user);
            CB.toast("Account created! Redirecting...", "success");
            setTimeout(function () { location.href = "index.html"; }, 1200);
        });

    /* ---------- LOGIN ---------- */
    setupForm("loginForm",
        function (f) {
            var e = {};
            if (!CB.EMAIL_RE.test(val(f, "email"))) e.email = "Enter a valid email address.";
            if (!f.querySelector("#password").value) e.password = "Enter your password.";
            return e;
        },
        "/api/login",
        function (f) {
            return { email: val(f, "email"), password: f.querySelector("#password").value };
        },
        function (body) {
            CB.setUser(body.user);
            CB.toast("Welcome back, " + body.user.name + "!", "success");
            setTimeout(function () { location.href = "index.html"; }, 1000);
        });

    /* ---------- CONTACT ---------- */
    var message = document.getElementById("message");
    var counter = document.getElementById("charCount");
    if (message && counter) {
        message.addEventListener("input", function () {
            counter.textContent = message.value.length + " / 500";
        });
    }

    setupForm("contactForm",
        function (f) {
            var e = {};
            if (val(f, "name").length < 2) e.name = "Name must be at least 2 characters.";
            if (!CB.EMAIL_RE.test(val(f, "email"))) e.email = "Enter a valid email address.";
            if (!val(f, "subject")) e.subject = "Please choose a subject.";
            var m = val(f, "message").length;
            if (m < 10 || m > 500) e.message = "Message must be 10-500 characters.";
            return e;
        },
        "/api/contact",
        function (f) {
            return { name: val(f, "name"), email: val(f, "email"),
                     subject: val(f, "subject"), message: val(f, "message") };
        },
        function (body, form) {
            CB.toast(body.message, "success");
            form.reset();
            if (counter) counter.textContent = "0 / 500";
        });

    /* ---------- CHECKOUT ---------- */
    var checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        var pending = null;
        try { pending = JSON.parse(localStorage.getItem("cb_checkout")); } catch (e) { pending = null; }

        var emptyBox = document.getElementById("checkoutEmpty");
        var layout = document.getElementById("checkoutLayout");

        if (!pending || !pending.items || pending.items.length === 0) {
            layout.hidden = true;
            emptyBox.hidden = false;
        } else {
            renderSummary(pending);
            var user = CB.getUser();
            if (user) {
                checkoutForm.querySelector("#customerName").value = user.name;
            }
            setupForm("checkoutForm",
                function (f) {
                    var e = {};
                    if (val(f, "customerName").length < 2) e.customerName = "Enter your name.";
                    if (!CB.PHONE_RE.test(val(f, "phone"))) e.phone = "Enter a valid 10-digit mobile number.";
                    if (val(f, "hostel").length < 2) e.hostel = "Enter your hostel / room or delivery spot.";
                    if (!val(f, "paymentMode")) e.paymentMode = "Choose a payment mode.";
                    if (val(f, "notes").length > 200) e.notes = "Notes can be at most 200 characters.";
                    return e;
                },
                "/api/orders",
                function (f) {
                    return {
                        customerName: val(f, "customerName"), phone: val(f, "phone"),
                        hostel: val(f, "hostel"), paymentMode: val(f, "paymentMode"),
                        notes: val(f, "notes"), mode: pending.mode,
                        groupCode: pending.groupCode, items: pending.items
                    };
                },
                function (body) {
                    localStorage.removeItem("cb_checkout");
                    localStorage.removeItem("cb_cart");
                    layout.hidden = true;
                    document.getElementById("confirmId").textContent = body.orderId;
                    document.getElementById("confirmTotal").textContent = "₹" + body.total.toFixed(2);
                    document.getElementById("checkoutDone").hidden = false;
                    CB.toast("Order placed!", "success");
                });
        }
    }

    function renderSummary(order) {
        var rows = "";
        var subtotal = 0;
        order.items.forEach(function (i) {
            var line = i.quantity * i.price;
            subtotal += line;
            rows += '<div class="confirmation-item"><span>' +
                (i.member ? "<b>" + CB.escapeHtml(i.member) + "</b> · " : "") +
                CB.escapeHtml(i.item) + " × " + i.quantity +
                "</span><span>₹" + line.toFixed(2) + "</span></div>";
        });
        var delivery = order.mode === "group" ? 45 : 0;
        rows += '<div class="confirmation-item"><span>Delivery</span><span>₹' +
            delivery.toFixed(2) + "</span></div>";
        rows += '<div class="confirmation-total"><span>Total</span><span>₹' +
            (subtotal + delivery).toFixed(2) + "</span></div>";
        document.getElementById("summaryRows").innerHTML = rows;
        document.getElementById("summaryTitle").textContent =
            order.mode === "group" ? "Group Order Summary" : "Order Summary";
    }
})();
