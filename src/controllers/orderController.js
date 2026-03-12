import Product from "../models/products.js";
import Order from "../models/orders.js";
import mongoose from "mongoose";

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping address",
      });
    }

    const items = [];
    let totalPriceCalculated = 0;

    for (const item of orderItems) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: true }
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product out of stock for product ID: ${item.product}`,
        });
      }

      const orderItem = {
        product: product._id,
        vendor: product.vendor,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };

      items.push(orderItem);

      totalPriceCalculated += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      shippingAddress,
      paymentMethod,
      totalPrice: totalPriceCalculated,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        message: "Order cannot be paid in this state",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = "CBE";
    order.orderStatus = "processing";

    await order.save();

    res.status(200).json({
      message: "Payment confirmed",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const shippingOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "processing") {
      return res.status(400).json({
        message: "Order must be processing before shipping",
      });
    }

    order.orderStatus = "shipped";

    await order.save();

    res.status(200).json({
      message: "Order marked as shipped",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const completionOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "shipped") {
      return res.status(400).json({
        message: "Order is not shipped yet",
      });
    }

    order.orderStatus = "delivered";

    await order.save();

    res.status(200).json({
      message: "Order marked as delivered",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
const cancelOrder = async (req, res) => { 
  try {
    const orderID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orderID)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    const order = await Order.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if(order.orderStatus ==="shipped" || order.orderStatus === "delivered"){
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }
    // restore stock for each item in the order
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    // update order status to cancelled
    order.orderStatus = "cancelled";
    await order.save();
    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

export { createOrder, confirmPayment, shippingOrder, completionOrder,cancelOrder };