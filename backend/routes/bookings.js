const express = require('express');
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');

const router = express.Router();

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const { experienceId, userName, userEmail, userPhone, date, time, participants = 1, promoCode } = req.body;

    // Check if experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Find the slot
    const slot = experience.slots.find(s => s.date.toISOString().split('T')[0] === date && s.time === time);
    if (!slot) {
      return res.status(400).json({ message: 'Slot not found' });
    }

    // Check if slot is available
    if (!slot.available || slot.bookedCount >= slot.maxParticipants) {
      return res.status(400).json({ message: 'Slot is fully booked' });
    }

    // Check for double booking
    const existingBooking = await Booking.findOne({
      experienceId,
      date: new Date(date),
      time,
      userEmail,
      status: 'confirmed'
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this slot' });
    }

    // Calculate total price
    let totalPrice = experience.price * participants;
    let discount = 0;

    if (promoCode) {
      // Validate promo code (simplified - in real app, check against Promo model)
      if (promoCode === 'SAVE10') {
        discount = totalPrice * 0.1;
      } else if (promoCode === 'FLAT100') {
        discount = 100;
      }
      totalPrice -= discount;
    }

    // Create booking
    const booking = new Booking({
      experienceId,
      userName,
      userEmail,
      userPhone,
      date: new Date(date),
      time,
      participants,
      promoCode,
      discount,
      totalPrice
    });

    await booking.save();

    // Update slot booking count
    slot.bookedCount += participants;
    if (slot.bookedCount >= slot.maxParticipants) {
      slot.available = false;
    }
    await experience.save();

    res.status(201).json({ message: 'Booking confirmed', bookingId: booking._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
