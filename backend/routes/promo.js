const express = require('express');
const Promo = require('../models/Promo');

const router = express.Router();

// POST /api/promo/validate - Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    // For simplicity, hardcode some promo codes
    let discount = 0;
    let discountType = '';

    if (code === 'SAVE10') {
      discount = 10;
      discountType = 'percentage';
    } else if (code === 'FLAT100') {
      discount = 100;
      discountType = 'fixed';
    } else {
      return res.status(400).json({ message: 'Invalid promo code' });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (totalAmount * discount) / 100;
    } else {
      discountAmount = Math.min(discount, totalAmount);
    }

    res.json({
      valid: true,
      discountType,
      discountValue: discount,
      discountAmount,
      finalAmount: totalAmount - discountAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
