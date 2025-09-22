
const express = require('express');
const { getPlants, updatePlant, deletePlant, addPlant } = require('../controllers/plantController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getPlants);
router.post('/', protect, adminOnly, addPlant);
router.delete('/:id', protect, adminOnly, deletePlant);
router.put('/:id', protect, adminOnly, updatePlant);

module.exports = router;
