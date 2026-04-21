const Review = require('../models/ReviewModel');
const Job = require('../models/JobModel');
const User = require('../models/UserModel');

exports.postReview = async (req, res) => {
    try {
        const { jobId, rating, comment } = req.body;

        // Verify the job exists and is HIRED
        const job = await Job.findById(jobId);
        if (!job || job.status !== 'HIRED') {
            return res.status(400).json({ message: "Can only review hired/completed jobs." });
        }

        // Only the Client who posted the job can review
        if (job.clientId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the job owner can leave a review." });
        }

        // Create Review
        const review = await Review.create({
            jobId,
            clientId: req.user.id,
            workerId: job.hiredWorkerId,
            rating,
            comment
        });

        //  Mark Job as COMPLETED
        job.status = 'COMPLETED';
        await job.save();

        // update worker's average rating
        const reviews = await Review.find({ workerId: job.hiredWorkerId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await User.findByIdAndUpdate(job.hiredWorkerId, { 
            rating: avgRating.toFixed(1) 
        });

        res.status(201).json({ success: true, message: "Review posted and Job marked as completed!" });

    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: "Job already reviewed." });
        res.status(500).json({ message: "Server error." });
    }
};