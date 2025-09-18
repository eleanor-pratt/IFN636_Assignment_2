// controllers/userController.js
const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    // Don't return password hashes
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    console.log(req.body);
    // password will be hashed by the pre('save') hook
    const user = await User.create({ name, email, password, role });
    const obj = user.toObject();
    delete obj.password; // never return hashes
    res.status(201).json(obj);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Mirror your plantController style, but:
    // - only set password if provided so it re-hashes
    // - allow role=0 using nullish coalescing
    user.name = name || user.name;
    user.email = email || user.email;
    if (typeof role !== 'undefined') user.role = role; // allow 0
    if (password) user.password = password; // triggers pre('save') hash

    const updatedUser = await user.save();
    const obj = updatedUser.toObject();
    delete obj.password;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove(); // mirrors your plantController style
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, addUser, updateUser, deleteUser };