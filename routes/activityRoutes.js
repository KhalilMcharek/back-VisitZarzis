const express = require("express");
const {
  getFilteredActivities,
  createActivity,
  //getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getAllActivitiesDashboard,
} = require("../controllers/activityController");
const verifyRole = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const router = express.Router();

//router.get("/public", getAllActivities);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "manager"]),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  (req, res, next) => {
    //console.log(req.files);
    //console.log( req.body);
    next();
  },
  createActivity
);

router.get("/filtred", getFilteredActivities);
router.get("/:id", getActivityById);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "manager"]),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  updateActivity
);

router.get("/", verifyToken, getAllActivitiesDashboard);

router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "manager"]),
  deleteActivity
);


module.exports = router;
