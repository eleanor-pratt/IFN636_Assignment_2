
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    completed: { type: String, enum: ['Filled', 'Not Filled'] },
    orderDate: { type: Date },
    items: [{
        plant: {type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true},
        quantity: {type: Number, min: 0, required: true},
    }]
});

module.exports = mongoose.model('Order', orderSchema);
