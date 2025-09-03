import mongoose from 'mongoose';

const SalaryBreakdownSchema = new mongoose.Schema({
  label: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["earning", "deduction"], required: true },
});

const PayslipSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: { type: String, required: true },
    period: { type: String, required: true },
    grossSalary: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    deductions: { type: Number, required: true },
    status: { type: String, enum: ["paid", "unpaid"], default: "paid" },
    payDate: { type: Date, required: true },
    downloadUrl: { type: String },
    salaryBreakdown: [SalaryBreakdownSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Payslip", PayslipSchema);
