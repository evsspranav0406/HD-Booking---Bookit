const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://evsspranav_db_user:admin@cluster.lsoa0yv.mongodb.net/?appName=Cluster ', {
  bufferCommands: false,
  bufferMaxEntries: 0,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HD Booking API' });
});

app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/promo', require('./routes/promo'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
