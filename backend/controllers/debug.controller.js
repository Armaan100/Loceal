const jwt = require('jsonwebtoken');
const CustomerModel = require('../models/customer.model');
const OrderModel = require('../models/order.model');
const mongoose = require('mongoose');

module.exports.whoami = async (req, res) => {
  try {
    const authHeader = req.headers && req.headers.authorization;
    const tokenFromHeader = authHeader && typeof authHeader === 'string' ? authHeader.split(' ')[1] : null;
    const token = req.cookies?.token || tokenFromHeader;

    if (!token) return res.status(400).json({ ok: false, message: 'no token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) return res.status(401).json({ ok: false, message: 'invalid token' });

    const customer = await CustomerModel.findById(decoded._id).select('-password');
    if (!customer) return res.status(404).json({ ok: false, message: 'customer not found' });

    return res.json({ ok: true, customer });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message, stack: err.stack });
  }
};

module.exports.testCompletedOrders = async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) return res.status(400).json({ ok: false, message: 'customerId required' });
    if (!mongoose.Types.ObjectId.isValid(customerId)) return res.status(400).json({ ok: false, message: 'invalid customerId' });

    const raw = await OrderModel.find({ customer: customerId, orderStatus: 'completed' }).lean().exec();
    const populated = await OrderModel.find({ customer: customerId, orderStatus: 'completed' })
      .populate('seller', 'businessName')
      .populate('product', 'title images')
      .limit(10)
      .exec();

    return res.json({ ok: true, rawCount: raw.length, sampleRaw: raw.slice(0, 3), populatedCount: populated.length, samplePopulated: populated.slice(0,3) });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message, stack: err.stack });
  }
};
