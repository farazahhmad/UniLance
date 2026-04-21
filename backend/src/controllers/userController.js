const User = require('../models/UserModel');
const Job = require('../models/JobModel');
const Review = require('../models/ReviewModel');

exports.getWorkerProfile = async (req, res) => {
    try {
        const { workerId } = req.params;

        // 1. Get Basic User Info
        const worker = await User.findById(workerId).select('-password');
        if (!worker) return res.status(404).json({ message: "Worker not found" });

        // 2. Get All Completed Jobs for this worker
        const completedJobs = await Job.find({ 
            hiredWorkerId: workerId, 
            status: 'COMPLETED' 
        }).select('title budget images createdAt');

        // 3. Get All Reviews for this worker
        const reviews = await Review.find({ workerId })
            .populate('clientId', 'name college')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                profile: worker,
                stats: {
                    totalJobs: completedJobs.length,
                    rating: worker.rating || "No ratings yet"
                },
                portfolio: completedJobs,
                reviews: reviews
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching worker profile." });
    }
};