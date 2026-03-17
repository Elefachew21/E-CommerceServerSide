import Product from "../models/products.js";
import Order from "../models/orders.js";
import User from "../models/users.js";

// Get total users
const totalUser = async (req, res) => {
    try {
        const count = await User.countDocuments();
        return res.status(200).json({
            success: true,
            totalUsers: count
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get total products
const totalProducts = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        return res.status(200).json({
            success: true,
            totalProducts: count
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get total orders
const totalOrders = async (req, res) => {
    try {
        const count = await Order.countDocuments();
        return res.status(200).json({
            success: true,
            totalOrders: count
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// total revenue , total selling products

export { totalUser, totalProducts, totalOrders };