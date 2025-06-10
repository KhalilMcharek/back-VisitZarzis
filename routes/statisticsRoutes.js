const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statisticsController');
const verifyRole = require("../middlewares/roleMiddleware");
// Route pour les statistiques du tableau de bord
router.get('/', getDashboardStats);

module.exports = router;
