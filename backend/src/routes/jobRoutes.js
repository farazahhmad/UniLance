const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// POST /api/jobs (Only Clients)
// Use upload.array('images') for multiple files, or upload.single('image') for one.
router.post('/', authMiddleware, checkRole('client'), upload.array('images', 10), jobController.createJob);

// GET /api/jobs (Public - anyone can view)
router.get('/', jobController.getAllJobs);

// GET /api/jobs/my-jobs (Client only)
router.get('/my-jobs', authMiddleware, checkRole('client'), jobController.getMyJobs);

// GET /api/jobs/:id (Public - anyone can view)
router.get('/:id', jobController.getJobById);

module.exports = router;