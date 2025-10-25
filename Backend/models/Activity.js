import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  action: { type: String, required: true },
  type: { type: String, default: 'general' },
  meta: { type: Object },
}, { timestamps: true });

export default mongoose.model('Activity', ActivitySchema);
 