const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/history/:jobId', chatController.getChatHistory);

module.exports = router;
