// Shared helpers used on every page: toast messages, form errors,
// API calls, login state in the navbar and the active nav link.

window.CB = (function () {

    function escapeHtml(text) {
        var span = document.createElement("span");
        span.textContent = text;
        return span.innerHTML;
    }

    /* ----- Toast messages (replace alert) ----- */
    function toast(message, type) {
        var box = document.getElementById("toastBox");
        if (!box) {
            box = document.createElement("div");
            box.id = "toastBox";
            box.setAttribute("aria-live", "polite");
            document.body.appendChild(box);
        }
        var t = document.createElement("div");
        t.className = "toast " + (type || "info");
        t.textContent = message;
        box.appendChild(t);
        setTimeout(function () {
            t.classList.add("hide");
            setTimeout(function () { t.remove(); }, 300);
        }, 2800);
    }

    /* ----- Inline field errors ----- */
    // Error text goes into <small class="error" data-error-for="fieldId">
    function showErrors(scope, errors) {
        clearErrors(scope);
        var firstInvalid = null;
        Object.keys(errors).forEach(function (field) {
            var holder = scope.querySelector('[data-error-for="' + field + '"]');
            var input = scope.querySelector("#" + field);
            if (holder) holder.textContent = errors[field];
            if (input) {
                input.classList.add("invalid");
                input.setAttribute("aria-invalid", "true");
                if (!firstInvalid) firstInvalid = input;
            }
        });
        if (firstInvalid) firstInvalid.focus();
    }

    function clearErrors(scope) {
        scope.querySelectorAll("[data-error-for]").forEach(function (el) { el.textContent = ""; });
        scope.querySelectorAll(".invalid").forEach(function (el) {
            el.classList.remove("invalid");
            el.removeAttribute("aria-invalid");
        });
    }

    // Remove an error as soon as the user edits that field
    function liveClear(scope) {
        scope.addEventListener("input", function (e) {
            var el = e.target;
            if (!el.id) return;
            el.classList.remove("invalid");
            var holder = scope.querySelector('[data-error-for="' + el.id + '"]');
            if (holder) holder.textContent = "";
        });
    }

    /* ----- Client-side validators (same rules as the server) ----- */
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_RE = /^[6-9]\d{9}$/;

    /* ----- API ----- */
    function postJSON(url, data) {
        return fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(function (res) {
            return res.json().then(function (body) {
                return { ok: res.ok, status: res.status, body: body };
            });
        });
    }

    /* ----- Logged-in user (stored in the browser) ----- */
    function getUser() {
        try { return JSON.parse(localStorage.getItem("cb_user")); } catch (e) { return null; }
    }
    function setUser(user) { localStorage.setItem("cb_user", JSON.stringify(user)); }
    function logout() {
        localStorage.removeItem("cb_user");
        toast("Logged out", "info");
        renderAuthNav();
    }

    function renderAuthNav() {
        var slot = document.getElementById("authNav");
        if (!slot) return;
        var user = getUser();
        if (user) {
            slot.innerHTML = '<span class="user-chip">Hi, ' + escapeHtml(user.name.split(" ")[0]) +
                '</span><button type="button" class="outline-button" id="logoutButton">Logout</button>';
            document.getElementById("logoutButton").addEventListener("click", logout);
        } else {
            slot.innerHTML = '<a href="login.html" class="outline-button">Login</a>' +
                '<a href="signup.html" class="outline-button">Sign Up</a>';
        }
    }

    /* ----- Highlight the active nav link ----- */
    function markActiveLink() {
        var file = location.pathname.split("/").pop() || "index.html";
        var hash = location.hash || "#home";
        var links = document.querySelectorAll(".nav-link");
        var match = null;

        links.forEach(function (a) {
            var parts = a.getAttribute("href").split("#");
            var linkFile = parts[0] || "index.html";
            var linkHash = parts[1] ? "#" + parts[1] : "";
            if (linkFile !== file) return;
            if (file === "index.html" ? linkHash === hash : true) match = a;
        });

        // On the home page, keep the last highlight for in-page anchors (#food-burgers)
        if (!match && file === "index.html") return;
        links.forEach(function (a) { a.classList.toggle("active", a === match); });
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderAuthNav();
        markActiveLink();
    });
    window.addEventListener("hashchange", markActiveLink);

    return {
        escapeHtml: escapeHtml, toast: toast, showErrors: showErrors,
        clearErrors: clearErrors, liveClear: liveClear, postJSON: postJSON,
        getUser: getUser, setUser: setUser, EMAIL_RE: EMAIL_RE, PHONE_RE: PHONE_RE
    };
})();
