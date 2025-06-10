const express = require("express");
const router = express.Router();
const { getUnvalidatedManagers, validateManager } = require("../controllers/userController");

// Only admins should access these
router.get("/managers/pending", getUnvalidatedManagers);
router.patch("/managers/validate/:id", validateManager);

module.exports = router;
