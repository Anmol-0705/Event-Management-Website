const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
});

// create order and pending registration
router.post('/create-order', auth(), async (req, res) => {
  try {
    const { eventId } = req.body;
    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (ev.status !== 'approved') return res.status(400).json({ message: 'Event not open for registration' });

    const amountPaise = Math.round((ev.price || 0) * 100); // rupees -> paise
    const options = {
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Save registration as pending
    const reg = new Registration({
      event: ev._id,
      user: req.user._id,
      amount: ev.price || 0,
      razorpayOrderId: order.id,
      paymentStatus: 'pending'
    });
    await reg.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// verify payment sent by client after checkout
router.post('/verify', auth(), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

    if (expectedSignature === razorpay_signature) {
      // update registration
      const reg = await Registration.findOne({ razorpayOrderId: razorpay_order_id });
      if (!reg) return res.status(404).json({ message: 'Registration not found' });
      reg.paymentStatus = 'paid';
      reg.razorpayPaymentId = razorpay_payment_id;
      reg.razorpaySignature = razorpay_signature;
      await reg.save();
      return res.json({ ok: true });
    } else {
      return res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// webhook endpoint (optional)
router.post('/webhook', express.json({ type: '*/*' }), async (req, res) => {
  // If you configure Razorpay webhooks, verify signature here using process.env.RAZORPAY_WEBHOOK_SECRET
  // For now, we accept events and update registrations if payment captured
  const payload = req.body;
  // handle accordingly...
  res.json({ received: true });
});

// list registrations for current user
router.get('/my', auth(), async (req, res) => {
  const regs = await Registration.find({ user: req.user._id }).populate('event');
  res.json(regs);
});

module.exports = router;
