// Order controller: Handles order placement, validation, and CRUD operations
const crypto = require("crypto");
const Order = require("../models/Order");
const Food = require("../models/Food");

const PHONE_RE = /^[6-9]\d{9}$/;
const GROUP_DELIVERY_CHARGE = 45;

function makeOrderId() {
    return "ORD-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

function clean(value) {
    return typeof value === "string" ? value.trim() : "";
}

// @desc    Place a new order (separate or group)
// @route   POST /api/orders
// @access  Public / Optional Auth
const createOrder = async (req, res, next) => {
    try {
        const customerName = clean(req.body.customerName);
        const phone = clean(req.body.phone);
        const hostel = clean(req.body.hostel);
        const notes = clean(req.body.notes);
        const paymentMode = clean(req.body.paymentMode);
        const mode = req.body.mode === "group" ? "group" : "separate";
        const groupCode = mode === "group" ? clean(req.body.groupCode) || "CB-7X2W" : null;
        const rawItems = Array.isArray(req.body.items) ? req.body.items : [];

        const errors = {};

        if (customerName.length < 2 || customerName.length > 50) {
            errors.customerName = "Name must be 2-50 characters.";
        }
        if (!PHONE_RE.test(phone)) {
            errors.phone = "Enter a valid 10-digit Indian mobile number.";
        }
        if (hostel.length < 2 || hostel.length > 80) {
            errors.hostel = "Enter your hostel / room or delivery spot.";
        }
        if (!["cash", "upi", "card"].includes(paymentMode)) {
            errors.paymentMode = "Choose a valid payment mode (cash, upi, or card).";
        }
        if (notes.length > 200) {
            errors.notes = "Notes can be at most 200 characters.";
        }

        if (rawItems.length === 0) {
            errors.items = "Your cart is empty.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors, message: "Validation failed." });
        }

        // Validate items and verify prices against the database catalog
        const validatedItems = [];
        for (const raw of rawItems) {
            const itemName = clean(raw && raw.item);
            const quantity = Number(raw && raw.quantity);
            const clientPrice = Number(raw && raw.price);

            if (!itemName || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
                return res.status(400).json({
                    errors: { items: `Invalid item or quantity for "${itemName || 'item'}".` },
                    message: "Cart validation failed."
                });
            }

            // Look up item in catalog by ID or by name
            let catalogItem = null;
            if (raw.food && typeof raw.food === "string" && raw.food.match(/^[0-9a-fA-F]{24}$/)) {
                catalogItem = await Food.findById(raw.food);
            }
            if (!catalogItem) {
                catalogItem = await Food.findOne({ name: new RegExp(`^${itemName}$`, "i") });
            }

            let unitPrice;
            let isCustom = false;
            let foodRef = null;

            if (catalogItem) {
                // Verified catalog item: enforce trusted server catalog price
                unitPrice = catalogItem.price;
                foodRef = catalogItem._id;
            } else {
                // Custom food item entered manually in demo mode
                if (!Number.isFinite(clientPrice) || clientPrice < 1 || clientPrice > 10000) {
                    return res.status(400).json({
                        errors: { items: `Invalid price for custom item "${itemName}". Must be between ₹1 and ₹10,000.` },
                        message: "Invalid item price."
                    });
                }
                unitPrice = clientPrice;
                isCustom = true;
            }

            const itemEntry = {
                food: foodRef,
                item: itemName,
                quantity,
                price: unitPrice,
                isCustom
            };

            if (mode === "group") {
                itemEntry.member = clean(raw.member) || "Guest";
            }

            validatedItems.push(itemEntry);
        }

        const subtotal = validatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const delivery = mode === "group" && validatedItems.length > 0 ? GROUP_DELIVERY_CHARGE : 0;
        const total = subtotal + delivery;

        const order = await Order.create({
            orderId: makeOrderId(),
            user: req.user ? req.user._id : null,
            mode,
            groupCode,
            customerName,
            phone,
            hostel,
            paymentMode,
            notes,
            items: validatedItems,
            subtotal,
            delivery,
            total,
            status: "Placed"
        });

        return res.status(201).json({
            message: "Order placed.",
            orderId: order.orderId,
            total: order.total,
            order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin gets all, Customer gets their own)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
    try {
        let filter = {};
        if (req.user.role !== "admin") {
            filter.user = req.user._id;
        }

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .populate("items.food", "name price category");

        return res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order by orderId or Mongo _id
// @route   GET /api/orders/:id
// @access  Public / Private (Admin or order owner)
const getOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;
        let order;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id).populate("items.food", "name price category");
        } else {
            order = await Order.findOne({ orderId: id.toUpperCase() }).populate("items.food", "name price category");
        }

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // If order belongs to an authenticated user, check ownership or admin role
        if (order.user && req.user) {
            if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized to view this order." });
            }
        }

        return res.status(200).json({ order });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin or order owner for cancellation)
const updateOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { status, notes } = req.body;

        let order;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id);
        } else {
            order = await Order.findOne({ orderId: id.toUpperCase() });
        }

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (req.user.role !== "admin") {
            // Customer can only cancel their own placed order
            if (!order.user || order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized to modify this order." });
            }
            if (status && status !== "Cancelled") {
                return res.status(403).json({ message: "Customers can only cancel pending orders." });
            }
        }

        if (status) {
            const allowed = ["Placed", "Preparing", "Ready", "Completed", "Cancelled"];
            if (!allowed.includes(status)) {
                return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(", ")}` });
            }
            order.status = status;
        }

        if (notes !== undefined) {
            order.notes = clean(notes);
        }

        const updatedOrder = await order.save();

        return res.status(200).json({
            message: "Order updated successfully.",
            order: updatedOrder
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        let order;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id);
        } else {
            order = await Order.findOne({ orderId: id.toUpperCase() });
        }

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        await order.deleteOne();

        return res.status(200).json({
            message: "Order deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
