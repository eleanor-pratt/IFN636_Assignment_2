
const express = require('express');
const { getOrderForUser, updateOrder, deleteOrder, addOrder, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/user', protect, getOrderForUser);
router.get('/all', protect, adminOnly, getAllOrders);
router.post('/', protect, addOrder);
router.delete('/:id', protect, deleteOrder);
router.put('/:id', protect, updateOrder);

module.exports = router;

