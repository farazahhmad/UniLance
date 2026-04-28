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

exports.updateProfile = async (req, res) => {
    try {
        const { bio, skills, portfolioLink, githubProfile } = req.body;

        // Find user by ID (from protect/verifyToken middleware) and update
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $set: { 
                    bio, 
                    skills, 
                    portfolioLink, 
                    githubProfile 
                } 
            },
            { new: true, runValidators: true } // 'new' returns the updated document
        ).select("-password"); // Don't send the password back!

        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during profile update" });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password -email");
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }
};