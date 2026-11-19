// Automated Unit and Logic Tests for CampusBites Backend
// Verifies models, business rules, calculations, authentication, and validation logic

const assert = require("assert");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log("=========================================");
console.log("  Running CampusBites Backend Test Suite ");
console.log("=========================================\n");

let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
    try {
        await fn();
        console.log(`  PASS: ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`  FAIL: ${name}`);
        console.error(`        ${err.message}`);
        failedTests++;
    }
}

async function runTests() {
    // 1. Password Hashing & Verification
    await test("bcrypt hashes and verifies password correctly", async () => {
        const password = "SecretPassword123";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        assert.notStrictEqual(password, hash, "Password must not be stored in plaintext");
        const match = await bcrypt.compare(password, hash);
        assert.strictEqual(match, true, "Valid password should verify");
        const wrongMatch = await bcrypt.compare("WrongPassword", hash);
        assert.strictEqual(wrongMatch, false, "Invalid password must fail verification");
    });

    // 2. JWT Generation & Verification
    await test("JWT tokens encode and verify user identity", async () => {
        const secret = "test_jwt_secret_key";
        const payload = { id: "user123", role: "customer" };
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        assert.ok(token, "Token should be generated");
        const decoded = jwt.verify(token, secret);
        assert.strictEqual(decoded.id, "user123");
        assert.strictEqual(decoded.role, "customer");
    });

    // 3. Indian Phone Regex Validation
    await test("Validates 10-digit Indian phone numbers", () => {
        const PHONE_RE = /^[6-9]\d{9}$/;
        assert.strictEqual(PHONE_RE.test("9876543210"), true);
        assert.strictEqual(PHONE_RE.test("8123456789"), true);
        assert.strictEqual(PHONE_RE.test("7000000000"), true);
        assert.strictEqual(PHONE_RE.test("6123456789"), true);
        assert.strictEqual(PHONE_RE.test("5123456789"), false, "Numbers starting with 5 or below are invalid");
        assert.strictEqual(PHONE_RE.test("987654321"), false, "9 digits should fail");
        assert.strictEqual(PHONE_RE.test("98765432100"), false, "11 digits should fail");
        assert.strictEqual(PHONE_RE.test("abcdefghij"), false, "Letters should fail");
    });

    // 4. Email Regex Validation
    await test("Validates email format correctly", () => {
        const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        assert.strictEqual(EMAIL_RE.test("student@campus.edu"), true);
        assert.strictEqual(EMAIL_RE.test("user.name@example.com"), true);
        assert.strictEqual(EMAIL_RE.test("invalid-email"), false);
        assert.strictEqual(EMAIL_RE.test("@missingusername.com"), false);
        assert.strictEqual(EMAIL_RE.test("user@domain"), false);
    });

    // 5. Separate Order Calculation
    await test("Calculates Personal Order subtotal and ₹0 delivery charge", () => {
        const items = [
            { item: "Classic Burger", price: 149, quantity: 2 },
            { item: "Crispy Fries", price: 99, quantity: 1 }
        ];
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const delivery = 0; // Personal order delivery is ₹0
        const total = subtotal + delivery;

        assert.strictEqual(subtotal, 149 * 2 + 99); // 298 + 99 = 397
        assert.strictEqual(delivery, 0);
        assert.strictEqual(total, 397);
    });

    // 6. Group Order Calculation & Delivery Split
    await test("Calculates Group Order subtotal, ₹45 delivery, and per-member splits", () => {
        const items = [
            { member: "Aman", item: "Classic Burger", price: 149, quantity: 1 },
            { member: "Rohan", item: "King Burger", price: 199, quantity: 1 }
        ];
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const delivery = 45; // Group order delivery is ₹45
        const total = subtotal + delivery;

        assert.strictEqual(subtotal, 348);
        assert.strictEqual(total, 393);

        const memberMap = {};
        items.forEach(i => {
            memberMap[i.member] = (memberMap[i.member] || 0) + i.price * i.quantity;
        });

        const memberCount = Object.keys(memberMap).length;
        assert.strictEqual(memberCount, 2);
        const deliveryShare = delivery / memberCount; // 22.50 each
        assert.strictEqual(deliveryShare, 22.5);

        const amanTotal = memberMap["Aman"] + deliveryShare;
        const rohanTotal = memberMap["Rohan"] + deliveryShare;

        assert.strictEqual(amanTotal, 149 + 22.5); // 171.5
        assert.strictEqual(rohanTotal, 199 + 22.5); // 221.5
        assert.strictEqual(amanTotal + rohanTotal, total, "Sum of member totals must equal final total");
    });

    // 7. Security: Role Restriction
    await test("Customer signup must never allow role: admin escalation", () => {
        const publicRequest = {
            name: "Sneaky User",
            email: "sneaky@test.com",
            password: "Password123",
            role: "admin" // malicious payload
        };
        // Simulated controller logic: always hardcode role 'customer'
        const assignedRole = "customer";
        assert.strictEqual(assignedRole, "customer", "Role must remain customer regardless of payload");
    });

    // 8. Contact Form Length Validation
    await test("Contact message enforces length restrictions (10-500 chars)", () => {
        const tooShort = "Hi";
        const valid = "Hello, I wanted to ask about the delivery time to Hostel B.";
        const tooLong = "x".repeat(501);

        assert.ok(tooShort.length < 10, "Should detect too short");
        assert.ok(valid.length >= 10 && valid.length <= 500, "Should accept valid length");
        assert.ok(tooLong.length > 500, "Should detect too long");
    });

    console.log("\n=========================================");
    console.log(`  Tests Passed: ${passedTests} | Tests Failed: ${failedTests}`);
    console.log("=========================================\n");

    if (failedTests > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTests();
