const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// All routes here require Admin privileges
router.use(authMiddleware, checkRole('admin'));

router.get('/stats', adminController.getPlatformStats);
router.delete('/job/:jobId', adminController.deleteInappropriateJob);

module.exports = router;