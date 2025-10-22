import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';

// Create a new payroll record
export const createPayroll = async (req, res) => {
  try {
    // Prefer the MongoDB employee _id in the request body as `employee`.
    // For backwards compatibility we will also accept a legacy `employeeId` (EMP...) but prefer `employee`.
    const { employee, employeeId, baseSalary, bonus, deductions, payDate, status } = req.body;
    if ((!employee && !employeeId) || !baseSalary || !payDate) {
      return res.status(400).json({ status: false, message: 'Required fields missing: employee (ObjectId), baseSalary, payDate' });
    }

    let empDoc = null;
    // If `employee` looks like an ObjectId, use it to find employee by _id
    const objIdRegex = typeof employee === 'string' && /^[0-9a-fA-F]{24}$/.test(employee);
    if (employee && objIdRegex) {
      empDoc = await Employee.findById(employee).populate('department', 'name');
    } else if (employeeId) {
      // legacy: allow finding by human-friendly employeeId
      empDoc = await Employee.findOne({ employeeId }).populate('department', 'name');
    }

    if (!empDoc) {
      return res.status(404).json({ status: false, message: 'Employee not found for provided id/value' });
    }

    const netSalary = Number(baseSalary) + Number(bonus || 0) - Number(deductions || 0);
    const payroll = new Payroll({
      employee: empDoc._id,
      employeeId: empDoc.employeeId,
      employeeName: empDoc.name,
      department: empDoc.department?.name || '',
      position: empDoc.position,
      baseSalary: Number(baseSalary),
      bonus: Number(bonus || 0),
      deductions: Number(deductions || 0),
      netSalary,
      payDate: new Date(payDate),
      status: status || 'pending',
      payPeriod: {
        startDate: new Date(payDate),
        endDate: new Date(payDate)
      }
    });

    await payroll.save();
    console.log('createPayroll: saved payroll id=', payroll._id);
    const populated = await payroll.populate({ path: 'employee', select: 'name employeeId department position' });

    // Verify persistence
    try {
      const check = await Payroll.findById(payroll._id);
      console.log('createPayroll: verification findById result:', !!check);
    } catch (e) {
      console.error('createPayroll: verification query failed', e);
    }

    res.status(201).json({ status: true, message: 'Payroll record created', data: populated });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Get all payroll records (HR) or own (employee)
export const getPayrolls = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let payrolls;
    if (role === 'hr') {
      payrolls = await Payroll.find().populate({ path: 'employee', select: 'name employeeId' }).sort({ payDate: -1 });
    } else {
      // employee: find by employee ObjectId (from token)
      payrolls = await Payroll.find({ employee: _id }).populate({ path: 'employee', select: 'name employeeId' }).sort({ payDate: -1 });
    }
    console.log(`getPayrolls: role=${role}, results=${payrolls.length}`);
    res.json({ status: true, data: payrolls });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Update a payroll record (HR only)
export const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { baseSalary, bonus, deductions, payDate, status } = req.body;
    const payroll = await Payroll.findById(id);
    if (!payroll) return res.status(404).json({ status: false, message: 'Payroll not found' });
    if (baseSalary !== undefined) payroll.baseSalary = baseSalary;
    if (bonus !== undefined) payroll.bonus = bonus;
    if (deductions !== undefined) payroll.deductions = deductions;
    if (payDate !== undefined) payroll.payDate = payDate;
    if (status !== undefined) payroll.status = status;
    payroll.netSalary = parseInt(payroll.baseSalary) + parseInt(payroll.bonus || 0) - parseInt(payroll.deductions || 0);
  await payroll.save();
  const populated = await payroll.populate({ path: 'employee', select: 'name employeeId' });
  res.json({ status: true, message: 'Payroll updated', data: populated });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete a payroll record (HR only)
export const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findByIdAndDelete(id);
    if (!payroll) return res.status(404).json({ status: false, message: 'Payroll not found' });
    res.json({ status: true, message: 'Payroll deleted' });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
