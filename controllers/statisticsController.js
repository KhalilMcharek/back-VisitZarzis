const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
exports.getDashboardStats = async (req, res) => {
  try {
    
    const totalBookings = await Booking.countDocuments();

    
    const popularActivities = await Booking.aggregate([
      {
        $group: {
          _id: '$activity',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'activities', 
          localField: '_id',
          foreignField: '_id',
          as: 'activityDetails',
        },
      },
      { $unwind: '$activityDetails' },
      {
        $project: {
          _id: 1,
          count: 1,
          'activityDetails.title': 1,
        },
      },
    ]);

  
    const totalActivities = await Activity.countDocuments();

 
    const totalclients = await User.countDocuments({ role: 'client' });


    const totalManagers = await User.countDocuments({ role: 'manager' });

    const topRatedActivities = await Feedback.aggregate([
      {
        $group: {
          _id: '$activity',
          averageRating: { $avg: '$rating' },
          totalFeedbacks: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1, totalFeedbacks: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'activities',
          localField: '_id',
          foreignField: '_id',
          as: 'activityDetails',
        },
      },
      { $unwind: '$activityDetails' },
      {
        $project: {
          _id: 1,
          averageRating: { $round: ['$averageRating', 1] },
          totalFeedbacks: 1,
          'activityDetails.title': 1,
        },
      },
    ]);
    
    res.status(200).send({
      topRatedActivities,
      totalBookings,
      totalActivities,
      totalclients,
      totalManagers,
      popularActivities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch dashboard statistics' });
  }
};
