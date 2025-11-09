import mongoose from 'mongoose'
const departmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  // head: { type: String },
  head:  { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  location: { type: String },
  budget: { type: Number, default: 0 },
  employeeCount: { type: Number, default: 0 },
  averageSalary: { type: Number, default: 0 },
  established: { type: Date, default: Date.now },
});

export default mongoose.model("Department", departmentSchema);