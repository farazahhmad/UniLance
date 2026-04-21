const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// 1. Apply to a job (Worker only)
router.post('/apply/:jobId', authMiddleware, checkRole('worker'), proposalController.applyToJob);

// 2. View all proposals for a specific job (Public/Logged-in)
router.get('/job/:jobId', authMiddleware, proposalController.getProposalsByJob);

// 3. Accept a proposal (Client only - The "State Machine" logic)
router.patch('/:proposalId/accept', authMiddleware, checkRole('client'), proposalController.acceptProposal);

// 4. Reject a proposal (Client only)
router.patch('/:proposalId/reject', authMiddleware, checkRole('client'), proposalController.rejectProposal);

// 5. Get my proposals (Worker only)
router.get('/my-proposals', authMiddleware, checkRole('worker'), proposalController.getMyProposals);

// 6. Check if worker has applied to a job
router.get('/check-applied/:jobId', authMiddleware, checkRole('worker'), proposalController.checkApplied);

module.exports = router;