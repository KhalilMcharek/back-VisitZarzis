
const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mainImage: {
      type: String,
      required: false, // ou true si tu veux la rendre obligatoire
    },
  
    // 🖼️ Galerie d’images
    gallery: [
      {
        type: String, // tableau d’URL
      }
    ],
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Activity', activitySchema);
  