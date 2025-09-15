const { default: mongoose } = require("mongoose");

const basketItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  plant: {type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true},
  quantity: {type: Number, min: 0, required: true},
})

module.exports = mongoose.model('BasketItems', basketItemSchema);
