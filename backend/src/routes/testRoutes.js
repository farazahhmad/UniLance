
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Only Workers can see this
router.get('/worker-only', authMiddleware, checkRole('worker'), (req, res) => {
    res.json({ message: "Welcome, Worker! You can see your dashboard." });
});

// Only Clients can see this
router.get('/client-only', authMiddleware, checkRole('client'), (req, res) => {
    res.json({ message: "Welcome, Client! You can post jobs here." });
});

// Both Admin and Client can see this
router.get('/management', authMiddleware, checkRole('admin', 'client'), (req, res) => {
    res.json({ message: "Welcome, Manager/Admin!" });
});

module.exports = router;