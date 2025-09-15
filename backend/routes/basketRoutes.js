
const express = require('express');
const { getBasketItems, updateBasketItem, deleteBasketItem, createBasketItem } = require('../controllers/basketController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getBasketItems);
router.post('/', protect, createBasketItem);
router.delete('/:id', protect, deleteBasketItem);
router.put('/:id', protect, updateBasketItem);

module.exports = router;
