const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Lien avec le modèle User
     // required: true,
    },
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
    
    },
    reservedDate: {
  type: Date,
  required: true, 
}

  });
  
  module.exports = mongoose.model('Booking', bookingSchema);
  