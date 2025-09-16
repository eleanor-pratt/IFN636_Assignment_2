
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { checkoutBasket } = require('../controllers/checkoutController');
const router = express.Router();

router.post('/', protect, checkoutBasket)


module.exports = router;
