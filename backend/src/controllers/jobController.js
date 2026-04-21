const Job = require('../models/JobModel'); 

const Proposal = require('../models/ProposalModel');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');
const normalizeSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') {
        return skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
};

exports.createJob = async (req, res) => {
    try {
        const { title, description, budget, deadline, skillsRequired } = req.body;

        // 1. Validation Logic
        if (!title || !description || !budget || !deadline) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        if (Number(budget) <= 0) {
            return res.status(400).json({ message: "Budget must be greater than 0." });
        }

        if (new Date(deadline) <= new Date()) {
            return res.status(400).json({ message: "Deadline must be a future date." });
        }

        
        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        
        const newJob = new Job({
            title,
            description,
            budget: Number(budget),
            deadline,
            skillsRequired: normalizeSkills(skillsRequired),
            images: imagePaths,
            clientId: req.user.id,
            status: "POSTED"
        });

        await newJob.save();

        res.status(201).json({
            success: true,
            message: "Job posted successfully with images!",
            job: newJob
        });

    } catch (error) {
        console.error("Job Creation Error:", error);
        res.status(500).json({ message: "Server error while posting job." });
    }
};

// GET /api/jobs (The "Marketplace Feed")
exports.getAllJobs = async (req, res) => {
    try {
        // We only want to show jobs that are still open for applications
        const jobs = await Job.find({ status: { $in: ['POSTED', 'APPLIED'] } })
            .populate('clientId', 'name email college')
            .sort({ createdAt: -1 }); // Newest jobs first

        res.status(200).json({ 
            success: true, 
            count: jobs.length,
            jobs 
        });
    } catch (error) {
        console.error("Get All Jobs Error:", error);
        res.status(500).json({ message: "Server error while fetching jobs." });
    }
};

// GET /api/jobs/:id (Public - anyone can view)
exports.getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const job = await Job.findById(id)
            .populate('clientId', 'name email college');
            
        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: "Job not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            job 
        });
    } catch (error) {
        console.error("Get Job By ID Error:", error);
        res.status(500).json({ message: "Server error while fetching job." });
    }
};



//email for delete job

exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Get all pending applicants before deleting
        const proposals = await Proposal.find({ jobId }).populate('workerId', 'email');
        
        await Job.findByIdAndDelete(jobId);
        await Proposal.deleteMany({ jobId });

        // Batch notify 
        proposals.forEach(async (p) => {
            try {
                await sendEmail({
                    email: p.workerId.email,
                    subject: "Job Update: Position Closed",
                    message: "The job you applied for has been removed or closed by the owner."
                });
            } catch (e) { /* ignore */ }
        });

        res.status(200).json({ success: true, message: "Job deleted and applicants notified." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job." });
    }
};

exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            { $match: { clientId: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $lookup: {
                    from: 'proposals',
                    localField: '_id',
                    foreignField: 'jobId',
                    as: 'proposals'
                }
            },
            {
                $addFields: {
                    proposalsCount: { $size: '$proposals' }
                }
            },
            {
                $project: {
                    proposals: 0 // Remove the proposals array, just keep count
                }
            }
        ]);
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Get My Jobs Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};