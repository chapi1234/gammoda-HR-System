import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    checkIn: { type: String, default: null }, // e.g., '09:15'
    checkOut: { type: String, default: null },
    status: { type: String, enum: ['present', 'absent', 'late', 'leave'], default: 'present' },
    location: { type: String, default: null }, // 'Office' | 'Remote' | etc.
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Attendance', AttendanceSchema);
