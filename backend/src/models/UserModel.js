const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true, 
    lowercase: true,
    trim: true,
    // Regex to enforce college email format (e.g., student@nitjsr.ac.in or .edu)
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    select: false // This prevents the password from being returned in API responses by default 
  },
  role: { 
    type: String, 
    enum: ['client', 'admin', 'worker'], 
    default: 'worker' 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  // OTP logic for verification
  otp: { type: String, select: false },
  otpExpires: { type: Date, select: false },
  
  // Professional Stats
  rating: { 
    type: Number, 
    default: 0,
    min: 0, 
    max: 5 
  },
  completedJobs: { 
    type: Number, 
    default: 0 
  },
  skills: {
    type: [String],
    index: true // Optimizes searching workers by skill
  },
  college: {
    type: String,
    required: [true, 'College name is required']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true // Automatically adds updatedAt and createdAt fields
});

const User = mongoose.model('User', userSchema);
module.exports = User;