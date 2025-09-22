const Order = require('../models/Order');
const getOrderForUser = async (req,res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addOrder = async (req, res) => {
const { orderNumber, description, completed, orderDate } = req.body;
    try {
        const order = await Order.create({ userId: req.user.id, orderNumber, description, completed, orderDate });
        res.status(201).json(order);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const updateOrder = async (req,res) => {
    const { orderNumber, description, completed, orderDate } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.orderNumber = orderNumber|| order.orderNumber;
        order.description = description || order.description;
        order.completed = completed ?? order.completed;
        order.orderDate = orderDate || order.orderDate;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        await order.remove();
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrderForUser, addOrder, updateOrder, deleteOrder, getAllOrders };