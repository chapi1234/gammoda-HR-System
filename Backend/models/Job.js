import mongoose, { mongo } from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  description: String,
  requirements: [String],
  location: String,
  salaryRange: {
    min: Number,
    max: Number
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'on-hold'],
    default: 'open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  postedDate: { type: Date, default: Date.now },
  closingDate: Date,
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Job', jobSchema);
