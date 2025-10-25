import mongoose from 'mongoose';

const DailyAttendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true }, // normalized to start of day
    present: { type: Number, default: 0 },
    late: { type: Number, default: 0 },
    leave: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
  }, 
  { timestamps: true }
);

export default mongoose.model('DailyAttendance', DailyAttendanceSchema);
