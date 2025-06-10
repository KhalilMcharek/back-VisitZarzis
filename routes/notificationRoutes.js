const express = require("express");
const { getNotifications ,markAsRead,
    getUnreadCount,
   } = require("../controllers/notificationController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/read", verifyToken, markAsRead);

router.get("/unread-count", verifyToken, getUnreadCount);
module.exports = router;
