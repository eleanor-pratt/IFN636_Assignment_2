const Order = require('../models/Order');

const createOrderFromBasket = (userId, items) =>{
    const description = 'Online order'
    const completed = 'Not Filled'
    const orderDate = new Date()

    items = items.map((item) => {
        return {plant: item.plant, quantity: item.quantity}
    })

    return new Order({
        userId, description, completed, items, orderDate
    })
}

module.exports = { createOrderFromBasket };