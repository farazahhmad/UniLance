const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to update profile
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router;