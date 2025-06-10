const express = require('express');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();
const verifyRole = require('../middlewares/roleMiddleware');
const verifyToken = require('../middlewares/authMiddleware');

// Routes pour les utilisateurs
router.post('/', createUser);
router.get('/',verifyToken, verifyRole(['admin']) ,getAllUsers);
router.get('/:id',verifyRole(['admin']), getUserById);
router.put('/:id',verifyToken, updateUser);
router.delete('/:id',verifyToken,verifyRole(['admin']), deleteUser);

module.exports = router;
