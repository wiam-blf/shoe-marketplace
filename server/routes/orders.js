const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// ─── PLACE AN ORDER (clients only) ────────────────────
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ msg: 'Only clients can place orders' });
    }

    const order = await Order.create({
      ...req.body,
      client: req.user.id  // attach who is ordering
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─── GET MY ORDERS ────────────────────────────────────
// clients see their own orders
// sellers see orders for their products
router.get('/mine', auth, async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'client') {
      // find all orders where client = logged in user
      orders = await Order.find({ client: req.user.id })
        .populate('product', 'name price images')
        .populate('client', 'name email');

    } else {
      // seller: find orders where the product belongs to them
      orders = await Order.find()
        .populate({
          path: 'product',
          match: { seller: req.user.id }, // only their products
          select: 'name price images seller'
        })
        .populate('client', 'name email contact');

      // remove orders where product didn't match (null)
      orders = orders.filter(o => o.product !== null);
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─── UPDATE ORDER STATUS (sellers only) ───────────────
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ msg: 'Only sellers can update order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;