// routes/userRoutes.js
const express = require('express');
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserById, // optional, if you implemented it
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.post('/', protect, adminOnly, addUser);
// router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
