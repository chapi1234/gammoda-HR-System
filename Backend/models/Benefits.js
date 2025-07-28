import mongoose from 'mongoose';

const benefitsSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  planType: { type: String, enum: ['Health', 'Dental', 'HSA', 'Retirement'] },
  provider: String,
  dependents: [{
    name: String,
    relationship: String,
    dob: Date
  }],
  effectiveDate: Date,
  endDate: Date,
  cost: Number
}, { timestamps: true });

export default mongoose.model('Benefits', benefitsSchema);
