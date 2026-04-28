const Message = require('../models/MessageModel');

exports.getChatHistory = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        // Find messages for this specific job and sort them by time (oldest first)
        const messages = await Message.find({ jobId }).sort({ createdAt: 1 });
        
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ message: "Failed to load messages" });
    }
};