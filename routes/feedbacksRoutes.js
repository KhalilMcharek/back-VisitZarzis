// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { addFeedback, updateFeedback, deleteFeedback,getFeedbacksByActivity } = require('../controllers/feedbackController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, addFeedback);
router.get("/activity/:activityId", getFeedbacksByActivity);

router.put('/:id', verifyToken, updateFeedback);
router.delete('/:id', verifyToken, deleteFeedback);

module.exports = router;
