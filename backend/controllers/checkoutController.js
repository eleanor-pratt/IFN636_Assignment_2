const { createOrderFromBasket } = require("../factories/orderFactory");
const BasketItem = require('../models/Basket');

const checkoutBasket = async (req,res) => {
    try {
        const items = await BasketItem.find({ 
          userId: req.user.id
        }).populate('plant');

        if (items.length <= 0) {
            return res.status(400).json({ message: "No items in basket"})
        }

        // Create a new order
        const order = createOrderFromBasket(req.user.id, items)
        await order.save()

        // Delete items
        for (const item of items) {
            const basketItem = await BasketItem.findById(item.id);            
            await basketItem.remove();
        }

        res.json(order);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

module.exports = { checkoutBasket };