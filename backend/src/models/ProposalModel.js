const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    workerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    proposalText: { 
        type: String, 
        required: [true, 'Please provide a cover letter or description'],
        minLength: [20, 'Proposal text must be at least 20 characters']
    },
    proposedPrice: { 
        type: Number, 
        required: [true, 'Please specify your bid amount'] 
    },
    estimatedDays: { 
        type: Number, 
        required: [true, 'How many days will this take?'] 
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'], 
        default: 'PENDING' 
    }
}, { timestamps: true });

// This prevents the same worker from applying to the same job twice
proposalSchema.index({ jobId: 1, workerId: 1 }, { unique: true });

const Proposal = mongoose.model('Proposal', proposalSchema);
module.exports = Proposal;