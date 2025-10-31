import Payslip from '../models/Payslip.js';
import Employee from '../models/Employee.js';

// GET /api/payslips
// HR: list all; Employee: list own
export const listPayslips = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let payslips;
    if (role === 'hr') {
      payslips = await Payslip.find().populate('employee', 'name employeeId department position').sort({ payDate: -1 });
    } else {
      payslips = await Payslip.find({ employee: _id }).populate('employee', 'name employeeId department position').sort({ payDate: -1 });
    }
    res.json({ status: true, data: payslips });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error listing payslips' });
  }
};

// GET /api/payslips/:id
export const getPayslip = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id).populate('employee', 'name employeeId department position');
    if (!payslip) return res.status(404).json({ status: false, message: 'Payslip not found' });
    // ensure employee can only fetch own payslip
    if (req.user.role !== 'hr' && payslip.employeeId !== req.user.employeeId) {
      return res.status(403).json({ status: false, message: 'Forbidden' });
    }
    res.json({ status: true, data: payslip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error fetching payslip' });
  }
};

// POST /api/payslips  (HR only)
export const createPayslip = async (req, res) => {
  try {
    if (req.user.role !== 'hr') return res.status(403).json({ status: false, message: 'Forbidden' });
    const { employeeId, payDate, salaryBreakdown, netSalary, periodStart, periodEnd } = req.body;
    const emp = await Employee.findOne({ employeeId });
    if (!emp) return res.status(400).json({ status: false, message: 'Employee not found for provided employeeId' });

    const payslip = new Payslip({
      employee: emp._id,
      employeeId: emp.employeeId,
      employeeName: emp.name,
      department: emp.department,
      payDate: payDate ? new Date(payDate) : new Date(),
      periodStart: periodStart ? new Date(periodStart) : null,
      periodEnd: periodEnd ? new Date(periodEnd) : null,
      salaryBreakdown,
      netSalary,
    });

    await payslip.save();
    const populated = await payslip.populate('employee', 'name employeeId');
    res.status(201).json({ status: true, message: 'Payslip created', data: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error creating payslip' });
  }
};

// DELETE /api/payslips/:id  (HR only)
export const deletePayslip = async (req, res) => {
  try {
    if (req.user.role !== 'hr') return res.status(403).json({ status: false, message: 'Forbidden' });
    const payslip = await Payslip.findById(req.params.id);
    if (!payslip) return res.status(404).json({ status: false, message: 'Payslip not found' });
    await payslip.remove();
    res.json({ status: true, message: 'Payslip deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error deleting payslip' });
  }
};
