const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).send(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erreur lors de la récupération des notifications' });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.send({ message: "Notifications marked as read." });
  } catch (error) {
    res.status(500).send({ error: "Erreur lors de la mise à jour des notifications." });
  }
};
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.send({ count });
  } catch (error) {
    res.status(500).send({ error: "Erreur lors du comptage." });
  }
};
