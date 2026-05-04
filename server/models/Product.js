const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',        // this links to the User model
    required: true
  },
  name: { type: String, required: true },
  category: { type: String, default: 'shoes' },
  sizes: [Number],      // example: [38, 39, 40, 41]
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  images: [String],     // array of image URLs
  type: {
    type: String,
    enum: ['ready', 'custom'],
    default: 'ready'
  },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);