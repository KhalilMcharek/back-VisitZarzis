const Notification = require('../models/Notification');

const createNotification = async (userId, message, type = 'info') => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
    });
    await notification.save();
  } catch (error) {
    console.error('Erreur lors de la création de la notification :', error);
  }
};

module.exports = { createNotification };
