import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['employee', 'manager', 'hr', 'admin'],
    default: 'employee'
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
