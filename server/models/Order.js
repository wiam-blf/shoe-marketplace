const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { type: Number, required: true },
  sizes: [Number],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'shipped'],
    default: 'pending'
  },
  customDetails: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);