import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeId: { type: String },
  employeeName: { type: String },
  department: { type: String },
  position: { type: String },
  payPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  payDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  payslipLink: String
}, {
  timestamps: true
});

export default mongoose.model('Payroll', payrollSchema);
