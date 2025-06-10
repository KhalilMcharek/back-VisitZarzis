const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  getManagerBookings,getClientBookings,cancelBooking
} = require("../controllers/BookingController");
const verifyRole = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/",verifyToken,  createBooking);
router.get("/", verifyToken, verifyRole(["admin"]), getAllBookings);
 router.get("/manager", verifyToken, verifyRole(["manager"]), getManagerBookings); //  reservations par manager
 router.get("/client", verifyToken, getClientBookings);
router.patch("/cancel/:id", verifyToken, cancelBooking);
router.put("/:id", verifyToken, updateBooking);
router.delete("/:id", verifyToken, deleteBooking);

router.get("/:id", verifyToken, getBookingById);



router.put("/update-status/:bookingId",verifyToken,verifyRole(["manager", "admin"]),updateBookingStatus);

module.exports = router;
