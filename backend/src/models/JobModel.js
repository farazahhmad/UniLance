const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Job title is required'],
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, 'Job description is required'] 
    },
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    budget: { 
        type: Number, 
        required: [true, 'Budget is required'],
        min: [0, 'Budget cannot be negative']
    },
    deadline: { 
        type: Date, 
        required: [true, 'Deadline is required'] 
    },
    status: { 
        type: String, 
        enum: ['POSTED', 'APPLIED', 'HIRED', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED'], 
        default: 'POSTED' 
    },
    hiredWorkerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null 
    },
    skillsRequired: {
        type: [String],
        index: true 
    }, 
    images: {
        type: [String], 
        default: []
    }
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;