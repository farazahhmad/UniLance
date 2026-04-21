const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// POST a review (Client only)
router.post('/', authMiddleware, checkRole('client'), reviewController.postReview);

module.exports = router;