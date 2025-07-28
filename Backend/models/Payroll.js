import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  payPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  earnings: {
    baseSalary: Number,
    overtime: Number, 
    bonus: Number,
    commission: Number,
    total: Number
  },
  deductions: {
    tax: Number,
    health: Number,
    retirement: Number,
    total: Number,
    others: Number
  },
  netPay: Number,
  status: {
    type: String,
    enum: ['draft', 'processed', 'paid'],
    default: 'draft'
  },
  payslipLink: String,
  payDate: Date
}, {
  timestamps: true
});

export default mongoose.model('Payroll', payrollSchema);
