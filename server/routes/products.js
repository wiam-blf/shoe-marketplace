const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// ─── GET ALL PRODUCTS (with optional filters) ─────────
// Anyone can browse — no auth needed
router.get('/', async (req, res) => {
  try {
    const { minPrice, maxPrice, size, type } = req.query;
    
    // Build a filter object based on what was sent
    let filter = {};
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); // greater than or equal
      if (maxPrice) filter.price.$lte = Number(maxPrice); // less than or equal
    }
    if (size) filter.sizes = Number(size); // find products that have this size

    const products = await Product.find(filter)
      .populate('seller', 'name businessInfo'); // fetch seller name too
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─── GET SINGLE PRODUCT ───────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name businessInfo contact');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─── ADD PRODUCT (sellers only) ───────────────────────
router.post('/', auth, async (req, res) => {
  try {
    // Only sellers can add products
    if (req.user.role !== 'seller') {
      return res.status(403).json({ msg: 'Only sellers can add products' });
    }

    const product = await Product.create({
      ...req.body,           // spread all the fields from the request
      seller: req.user.id    // attach the logged in seller's id
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─── UPDATE PRODUCT ───────────────────────────────────
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  // return the updated version
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─── DELETE PRODUCT ───────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;