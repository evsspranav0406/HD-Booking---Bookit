const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  slots: [{
    date: { type: Date, required: true },
    time: { type: String, required: true },
    available: { type: Boolean, default: true },
    maxParticipants: { type: Number, default: 10 },
    bookedCount: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Experience', experienceSchema);
