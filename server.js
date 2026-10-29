// CampusBites server - serves the frontend and saves form data to local JSON files.
// Uses only Node's built-in modules, so there is nothing to install.

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const DELIVERY_CHARGE = 45; // applied to group orders only

/* ---------- JSON FILE STORAGE ---------- */

function dataFile(name) {
    return path.join(DATA_DIR, name + ".json");
}

function readData(name) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const file = dataFile(name);
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
    try {
        const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        return [];
    }
}

// Write to a temp file first, then rename, so a crash never corrupts the JSON.
function writeData(name, records) {
    const file = dataFile(name);
    const tmp = file + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(records, null, 2));
    fs.renameSync(tmp, file);
}

function appendRecord(name, record) {
    const records = readData(name); // read + write happen in one synchronous step
    records.push(record);
    writeData(name, records);
}

/* ---------- VALIDATION HELPERS ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

function clean(value) {
    return typeof value === "string" ? value.trim() : "";
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return salt + ":" + hash;
}

function checkPassword(password, stored) {
    const [salt, hash] = stored.split(":");
    const test = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(test, Buffer.from(hash, "hex"));
}

function makeId(prefix) {
    return prefix + "-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

/* ---------- API HANDLERS ---------- */
// Each handler returns { status, body }.

function handleSignup(data) {
    const name = clean(data.name);
    const email = clean(data.email).toLowerCase();
    const phone = clean(data.phone);
    const password = typeof data.password === "string" ? data.password : "";
    const errors = {};

    if (name.length < 2 || name.length > 50) errors.name = "Name must be 2-50 characters.";
    if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
    if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid 10-digit mobile number.";
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        errors.password = "Password needs 8+ characters with a letter and a number.";
    }
    if (Object.keys(errors).length) return { status: 400, body: { errors } };

    const users = readData("users");
    if (users.some((u) => u.email === email)) {
        return { status: 409, body: { errors: { email: "This email is already registered." } } };
    }

    const user = {
        id: makeId("U"),
        name,
        email,
        phone,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString()
    };
    users.push(user);
    writeData("users", users);

    return { status: 201, body: { message: "Account created.", user: { name, email } } };
}

function handleLogin(data) {
    const email = clean(data.email).toLowerCase();
    const password = typeof data.password === "string" ? data.password : "";
    const errors = {};

    if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Enter your password.";
    if (Object.keys(errors).length) return { status: 400, body: { errors } };

    const user = readData("users").find((u) => u.email === email);
    if (!user || !checkPassword(password, user.passwordHash)) {
        return { status: 401, body: { errors: { password: "Incorrect email or password." } } };
    }
    return { status: 200, body: { message: "Logged in.", user: { name: user.name, email: user.email } } };
}

function handleContact(data) {
    const name = clean(data.name);
    const email = clean(data.email).toLowerCase();
    const subject = clean(data.subject);
    const message = clean(data.message);
    const errors = {};

    if (name.length < 2 || name.length > 50) errors.name = "Name must be 2-50 characters.";
    if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
    if (!subject) errors.subject = "Please choose a subject.";
    if (message.length < 10 || message.length > 500) errors.message = "Message must be 10-500 characters.";
    if (Object.keys(errors).length) return { status: 400, body: { errors } };

    appendRecord("contacts", {
        id: makeId("C"),
        name,
        email,
        subject,
        message,
        createdAt: new Date().toISOString()
    });
    return { status: 201, body: { message: "Thanks! We received your message." } };
}

function handleOrder(data) {
    const customerName = clean(data.customerName);
    const phone = clean(data.phone);
    const hostel = clean(data.hostel);
    const notes = clean(data.notes);
    const paymentMode = clean(data.paymentMode);
    const mode = data.mode === "group" ? "group" : "separate";
    const errors = {};

    if (customerName.length < 2 || customerName.length > 50) errors.customerName = "Name must be 2-50 characters.";
    if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid 10-digit mobile number.";
    if (hostel.length < 2 || hostel.length > 80) errors.hostel = "Enter your hostel / room or delivery spot.";
    if (!["cash", "upi", "card"].includes(paymentMode)) errors.paymentMode = "Choose a payment mode.";
    if (notes.length > 200) errors.notes = "Notes can be at most 200 characters.";

    // Re-validate the cart on the server; never trust the browser.
    const rawItems = Array.isArray(data.items) ? data.items : [];
    const items = [];
    for (const raw of rawItems) {
        const item = clean(raw && raw.item);
        const quantity = Number(raw && raw.quantity);
        const price = Number(raw && raw.price);
        if (!item || !Number.isInteger(quantity) || quantity < 1 || quantity > 50 ||
            !Number.isFinite(price) || price < 0 || price > 10000) {
            errors.items = "Your cart contains an invalid item.";
            break;
        }
        const entry = { item, quantity, price };
        if (mode === "group") entry.member = clean(raw.member) || "Guest";
        items.push(entry);
    }
    if (!errors.items && items.length === 0) errors.items = "Your cart is empty.";
    if (Object.keys(errors).length) return { status: 400, body: { errors } };

    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    const delivery = mode === "group" ? DELIVERY_CHARGE : 0;
    const order = {
        orderId: makeId("ORD"),
        mode,
        groupCode: mode === "group" ? clean(data.groupCode) || null : null,
        customerName,
        phone,
        hostel,
        paymentMode,
        notes,
        items,
        subtotal,
        delivery,
        total: subtotal + delivery,
        status: "Placed",
        createdAt: new Date().toISOString()
    };
    appendRecord("orders", order);

    return { status: 201, body: { message: "Order placed.", orderId: order.orderId, total: order.total } };
}

const ROUTES = {
    "POST /api/signup": handleSignup,
    "POST /api/login": handleLogin,
    "POST /api/contact": handleContact,
    "POST /api/orders": handleOrder
};

/* ---------- HTTP HELPERS ---------- */

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

function sendJSON(res, status, body) {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(body));
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", (chunk) => {
            raw += chunk;
            if (raw.length > 100 * 1024) {
                reject(new Error("Body too large"));
                req.destroy();
            }
        });
        req.on("end", () => {
            try {
                resolve(raw ? JSON.parse(raw) : {});
            } catch (err) {
                reject(new Error("Invalid JSON"));
            }
        });
        req.on("error", reject);
    });
}

function serveStatic(req, res) {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const relative = urlPath === "/" ? "index.html" : urlPath;
    const filePath = path.normalize(path.join(PUBLIC_DIR, relative));

    // Block path traversal (../) so only files inside /public are served.
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        return res.end("Forbidden");
    }
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            return res.end("<h1>404 - Page not found</h1><a href='/'>Back to CampusBites</a>");
        }
        const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": type });
        res.end(content);
    });
}

/* ---------- SERVER ---------- */

const server = http.createServer(async (req, res) => {
    const route = req.method + " " + req.url.split("?")[0];

    if (ROUTES[route]) {
        try {
            const data = await readBody(req);
            const result = ROUTES[route](data);
            return sendJSON(res, result.status, result.body);
        } catch (err) {
            return sendJSON(res, 400, { errors: { form: err.message } });
        }
    }
    if (req.url.startsWith("/api/")) {
        return sendJSON(res, 404, { errors: { form: "Unknown API route." } });
    }
    if (req.method === "GET") return serveStatic(req, res);

    res.writeHead(405);
    res.end("Method not allowed");
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log("CampusBites running at http://localhost:" + PORT);
    });
}

module.exports = server;
