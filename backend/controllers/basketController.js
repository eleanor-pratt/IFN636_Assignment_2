const BasketItem = require('../models/Basket');
const Plant = require('../models/Plant');


const getBasketItems = async (req,res) => {
    try {
        const items = await BasketItem.find({ 
          userId: req.user.id
        }).populate('plant');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createBasketItem = async (req, res) => {
const { plant, quantity } = req.body;
    try {
        const basketItem = await BasketItem.create({ 
          userId: req.user.id, plant, quantity });
        res.status(201).json(basketItem);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const updateBasketItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    const basketItem = await BasketItem.findById(req.params.id).populate('plant');
    if (!basketItem) return res.status(404).json({ message: 'Basket item not found' });

    basketItem.quantity = quantity || basketItem.quantity;
    
    const updatedBasket = await basketItem.save();
    res.json(updatedBasket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBasketItem = async (req, res) => {
    try {
        const basketItem = await BasketItem.findById(req.params.id);
        if (!basketItem) return res.status(404).json({ message: 'Basket item not found' });
        
        await basketItem.remove();
        res.json({ message: 'Basket item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { getBasketItems, createBasketItem, updateBasketItem, deleteBasketItem };