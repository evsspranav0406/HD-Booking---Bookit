const mongoose = require('mongoose');
const Experience = require('./models/Experience');
const Promo = require('./models/Promo');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookit');

    console.log('Connected to MongoDB');

    // Clear existing data
    await Experience.deleteMany({});
    await Promo.deleteMany({});
    console.log('Cleared existing data');

    // Sample experiences
    const experiences = [
      {
        title: "Mountain Trek Adventure",
        description: "Embark on an exhilarating trek through the majestic Himalayas. Experience breathtaking views, challenging trails, and the thrill of conquering peaks. Perfect for adventure seekers and nature lovers.",
        images: ["https://images.unsplash.com/photo-1642103360071-34bd4e1902b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1100"],
        price: 2500,
        duration: "2 Days",
        location: "Manali, Himachal Pradesh",
        category: "Adventure",
        slots: [
          {
            date: new Date('2024-02-15'),
            time: "Morning",
            available: true,
            maxParticipants: 8,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-15'),
            time: "Afternoon",
            available: true,
            maxParticipants: 8,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-16'),
            time: "Morning",
            available: true,
            maxParticipants: 8,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-16'),
            time: "Evening",
            available: true,
            maxParticipants: 8,
            bookedCount: 0
          }
        ]
      },
      {
        title: "River Rafting Expedition",
        description: "Navigate through thrilling rapids and serene waters on this adrenaline-pumping river rafting adventure. Experience the power of nature while ensuring safety with expert guides.",
        images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"],
        price: 1800,
        duration: "1 Day",
        location: "Rishikesh, Uttarakhand",
        category: "Water Sports",
        slots: [
          {
            date: new Date('2024-02-20'),
            time: "Morning",
            available: true,
            maxParticipants: 12,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-20'),
            time: "Afternoon",
            available: true,
            maxParticipants: 12,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-21'),
            time: "Morning",
            available: true,
            maxParticipants: 12,
            bookedCount: 0
          }
        ]
      },
      {
        title: "Desert Safari Experience",
        description: "Explore the golden sands of the Thar Desert on a thrilling safari. Witness stunning sunsets, visit traditional villages, and enjoy cultural performances under the stars.",
        images: ["https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800"],
        price: 2200,
        duration: "2 Days",
        location: "Jaisalmer, Rajasthan",
        category: "Cultural",
        slots: [
          {
            date: new Date('2024-02-25'),
            time: "Morning",
            available: true,
            maxParticipants: 6,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-25'),
            time: "Evening",
            available: true,
            maxParticipants: 6,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-26'),
            time: "Morning",
            available: true,
            maxParticipants: 6,
            bookedCount: 0
          }
        ]
      },
      {
        title: "Beach Yoga Retreat",
        description: "Find inner peace with sunrise yoga sessions on pristine beaches. Combine wellness, meditation, and coastal beauty for a rejuvenating experience.",
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"],
        price: 1500,
        duration: "1 Day",
        location: "Goa",
        category: "Wellness",
        slots: [
          {
            date: new Date('2024-03-01'),
            time: "Morning",
            available: true,
            maxParticipants: 15,
            bookedCount: 0
          },
          {
            date: new Date('2024-03-02'),
            time: "Morning",
            available: true,
            maxParticipants: 15,
            bookedCount: 0
          },
          {
            date: new Date('2024-03-03'),
            time: "Morning",
            available: true,
            maxParticipants: 15,
            bookedCount: 0
          }
        ]
      },
      {
        title: "Wildlife Photography Tour",
        description: "Capture stunning wildlife moments in their natural habitat. Join professional photographers to learn techniques while exploring national parks and sanctuaries.",
        images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"],
        price: 3200,
        duration: "3 Days",
        location: "Jim Corbett, Uttarakhand",
        category: "Photography",
        slots: [
          {
            date: new Date('2024-03-05'),
            time: "Morning",
            available: true,
            maxParticipants: 5,
            bookedCount: 0
          },
          {
            date: new Date('2024-03-06'),
            time: "Morning",
            available: true,
            maxParticipants: 5,
            bookedCount: 0
          }
        ]
      },
      {
        title: "City Food Walking Tour",
        description: "Discover the vibrant street food culture of India's bustling cities. Sample authentic local delicacies while learning about culinary traditions and history.",
        images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"],
        price: 800,
        duration: "Half Day",
        location: "Delhi",
        category: "Food & Culture",
        slots: [
          {
            date: new Date('2024-02-18'),
            time: "Morning",
            available: true,
            maxParticipants: 10,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-18'),
            time: "Afternoon",
            available: true,
            maxParticipants: 10,
            bookedCount: 0
          },
          {
            date: new Date('2024-02-19'),
            time: "Morning",
            available: true,
            maxParticipants: 10,
            bookedCount: 0
          }
        ]
      }
    ];

    // Insert experiences
    await Experience.insertMany(experiences);
    console.log('Experiences seeded successfully');

    // Sample promo codes
    const promos = [
      {
        code: "SAVE10",
        discountType: "percentage",
        discountValue: 10,
        minOrder: 1000,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
        usageLimit: 1000
      },
      {
        code: "FLAT100",
        discountType: "fixed",
        discountValue: 100,
        minOrder: 500,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
        usageLimit: 500
      },
      {
        code: "WELCOME20",
        discountType: "percentage",
        discountValue: 20,
        minOrder: 2000,
        maxDiscount: 500,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-03-31'),
        isActive: true,
        usageLimit: 200
      },
      {
        code: "SUMMER15",
        discountType: "percentage",
        discountValue: 15,
        minOrder: 1500,
        validFrom: new Date('2024-03-01'),
        validTo: new Date('2024-05-31'),
        isActive: true,
        usageLimit: 300
      },
      {
        code: "FLASH50",
        discountType: "fixed",
        discountValue: 50,
        minOrder: 200,
        validFrom: new Date('2024-02-01'),
        validTo: new Date('2024-02-28'),
        isActive: true,
        usageLimit: 100
      }
    ];

    // Insert promos
    await Promo.insertMany(promos);
    console.log('Promo codes seeded successfully');

    console.log('Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
