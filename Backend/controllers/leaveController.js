import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';

// Create a new leave request (employee)
export const createLeave = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { type, startDate, endDate, reason } = req.body;
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ status: false, message: 'All fields are required.' });
    }
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const leave = new Leave({
      employee: userId,
      type,
      startDate,
      endDate,
      days,
      reason,
      status: 'pending',
    });
    await leave.save();
    const populated = await leave.populate([
      // include profileImage so frontend can show persisted avatars
      { path: 'employee', select: 'name employeeId profileImage' },
      { path: 'manager', select: 'name' }
    ]);
    return res.status(201).json({ status: true, message: 'Leave request submitted.', data: populated });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to submit leave request', error: err.message });
  }
};

// List all leave requests (HR) or my leave requests (employee)
export const listLeaves = async (req, res) => {
  try {
    const isHR = req.user?.role === 'hr';
    let leaves;
    if (isHR) {
      leaves = await Leave.find()
        // include profileImage so frontend can use the persisted image URL
        .populate('employee', 'name employeeId profileImage')
        .populate('manager', 'name')
        .sort({ createdAt: -1 });
    } else {
      leaves = await Leave.find({ employee: req.user?._id || req.user?.id })
        .populate('employee', 'name employeeId profileImage')
        .populate('manager', 'name')
        .sort({ createdAt: -1 });
    }
    return res.status(200).json({ status: true, data: leaves });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to fetch leave requests', error: err.message });
  }
};

// Approve or reject a leave request (HR)
export const reviewLeave = async (req, res) => {
  try {
    if (req.user?.role !== 'hr') return res.status(403).json({ status: false, message: 'Forbidden' });
    const { id } = req.params;
    const { status, comments } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ status: false, message: 'Invalid status' });
    }
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ status: false, message: 'Leave request not found' });
    leave.status = status;
    leave.comments = comments || '';
    leave.approvalDate = new Date();
    leave.manager = req.user?._id || req.user?.id;
    await leave.save();
    const populated = await leave.populate([
      { path: 'employee', select: 'name employeeId profileImage' },
      { path: 'manager', select: 'name' }
    ]);
    return res.status(200).json({ status: true, message: `Leave ${status}`, data: populated });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to review leave', error: err.message });
  }
};

// Update a leave request (employee, only if pending)
export const updateLeave = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { id } = req.params;
    const { type, startDate, endDate, reason } = req.body;
    const leave = await Leave.findOne({ _id: id, employee: userId, status: 'pending' });
    if (!leave) return res.status(404).json({ status: false, message: 'Leave not found or not editable' });
    if (type) leave.type = type;
    if (startDate) leave.startDate = startDate;
    if (endDate) leave.endDate = endDate;
    if (reason) leave.reason = reason;
    leave.days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    await leave.save();
    const populated = await leave.populate([
      { path: 'employee', select: 'name employeeId profileImage' },
      { path: 'manager', select: 'name' }
    ]);
    return res.status(200).json({ status: true, message: 'Leave updated', data: populated });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to update leave', error: err.message });
  }
};

// Delete a leave request (employee, only if pending)
export const deleteLeave = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { id } = req.params;
    const leave = await Leave.findOneAndDelete({ _id: id, employee: userId, status: 'pending' });
    if (!leave) return res.status(404).json({ status: false, message: 'Leave not found or not deletable' });
    return res.status(200).json({ status: true, message: 'Leave deleted' });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to delete leave', error: err.message });
  }
};
