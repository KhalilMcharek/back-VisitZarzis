// controllers/feedbackController.js
const Feedback = require('../models/Feedback');

exports.addFeedback = async (req, res) => {
  const { activity, rating, comment } = req.body; // ✅ match key name used in frontend

  try {
    const feedback = new Feedback({
      activity,
      user: req.user.id,
      rating,
      comment,
    });

    await feedback.save();
    res.status(201).send({ message: 'Feedback added', feedback });
  } catch (err) {
    console.error("Error adding feedback:", err); // <== Add this for better debugging
    res.status(500).send({ error: 'Error adding feedback' });
  }
};


exports.getFeedbacksByActivity = async (req, res) => {
    try {
      const feedbacks = await Feedback.find({ activity: req.params.activityId })
        .populate("user", "name") // Show reviewer name
        .sort({ createdAt: -1 });
  
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des feedbacks." });
    }
  };
exports.updateFeedback = async (req, res) => {
    const { rating, comment } = req.body;
  
    try {
      const feedback = await Feedback.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { rating, comment },
        { new: true }
      );
  
      if (!feedback) {
        return res.status(404).json({ error: "Feedback non trouvé ou non autorisé." });
      }
  
      res.json(feedback);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du feedback." });
    }
  };
  
  exports.deleteFeedback = async (req, res) => {
    try {
      const feedback = await Feedback.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  
      if (!feedback) {
        return res.status(404).json({ error: "Feedback non trouvé ou non autorisé." });
      }
  
      res.json({ message: "Feedback supprimé avec succès." });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression du feedback." });
    }
  };