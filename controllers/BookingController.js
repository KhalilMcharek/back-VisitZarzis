const Booking = require('../models/Booking');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

exports.createBooking = async (req, res) => {
  const { activityId, reservedDate } = req.body;

  try {
    // Validate reservedDate
    if (!reservedDate || isNaN(new Date(reservedDate).getTime())) {
      return res.status(400).send({ error: 'Invalid date format for reservedDate' });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send({ error: 'Activity not found' });
    }

    const booking = new Booking({
      activity: activityId,
      client: req.user.id,
      reservedDate: new Date(reservedDate), // Ensure it's stored as a Date object
    });

    await booking.save();

    await createNotification(
      activity.manager,
      `Un client a réservé l’activité "${activity.title}"`,
      'info'
    );

    res.status(201).send({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to create booking' });
  }
};

exports.getManagerBookings = async (req, res) => {
  try {
    const activitiesManaged = await Activity.find({ manager: req.user.id }).select('_id');
    

    const activityIds = activitiesManaged.map(activity => activity._id);
    
    const bookings = await Booking.find({ activity: { $in: activityIds } }).populate('client', 'name email')
    .populate('activity', 'title description');
      
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch bookings' });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('client', 'name email').populate('activity', 'title description');
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email').populate('activity', 'title description');
    if (!booking) {
      return res.status(404).send({ message: "Réservation non trouvée" });
    }
    res.send(booking);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
      await booking.populate("activity", "title");
await booking.populate("client", "_id");

    if (!booking) {
      return res.status(404).send({ message: "Réservation non trouvée" });
    }

    await createNotification(
      booking.client._id,
      status === "confirmed"
        ? `Votre réservation  a été confirmée ✅`
        : `Votre réservation pour "${activityTitle}" a été annulée ❌`,
      status === "confirmed" ? "success" : "error"
    );

    res.send(booking);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};



exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).send({ message: "Réservation non trouvée" });
    }
    res.send({ message: "Réservation supprimée avec succès" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).send({ error: 'Statut invalide' });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send({ error: 'Réservation introuvable' });
    }

    if (booking.status === 'confirmed' || booking.status === 'cancelled') {
      return res.status(400).send({ error: 'Le statut de cette réservation a déjà été défini et ne peut plus être modifié.' });
    }

    booking.status = status;
    await booking.save();

    await createNotification(
      booking.client,
      status === 'confirmed'
        ? `Votre réservation pour "${booking.activity.title}" a été confirmée ✅`
        : `Votre réservation pour "${booking.activity.title}" a été annulée ❌`,
      status === 'confirmed' ? 'success' : 'error'
    );

    res.status(200).send({ message: 'Statut mis à jour avec succès.', booking });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur lors de la mise à jour du statut.' });
  }
};

exports.getClientBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id })
      .populate("activity", "title description location price")
      .sort({ createdAt: -1 });

    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send({ error: "Erreur lors de la récupération des réservations." });
  }
};
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, client: req.user.id },
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).send({ error: "Réservation non trouvée ou non autorisée." });
    }

    res.send({ message: "Réservation annulée avec succès.", booking });
  } catch (error) {
    res.status(500).send({ error: "Erreur lors de l'annulation de la réservation." });
  }
};

