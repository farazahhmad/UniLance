const Job = require('../models/JobModel');
const User = require('../models/IserModel');
const Proposal = require('../models/ProposalModel');

exports.getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'POSTED' });
        const completedJobs = await Job.countDocuments({ status: 'COMPLETED' });

        // Calculate total sum of all budgets for completed jobs
        const totalVolume = await Job.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $group: { _id: null, total: { $sum: "$budget" } } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                users: totalUsers,
                jobs: totalJobs,
                active: activeJobs,
                completed: completedJobs,
                revenueFlow: totalVolume[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin stats." });
    }
};

exports.deleteInappropriateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // When an admin deletes a job, we should also delete all related proposals
        await Job.findByIdAndDelete(jobId);
        await Proposal.deleteMany({ jobId });

        res.status(200).json({ success: true, message: "Job and linked proposals removed by Admin." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job." });
    }
};