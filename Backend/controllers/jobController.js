import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';
import Department from '../models/Department.js';

// Create a new job (HR/admin)
export const createJob = async (req, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ status: false, message: 'Forbidden' });
    }
    const { title, department, description, requirements, location, salaryRange, salary, jobType, status, closingDate } = req.body;
    if (!title || !department) {
      return res.status(400).json({ status: false, message: 'Title and department are required' });
    }

    // Resolve department: accept either ObjectId or department name
    let depDoc = null;
    try {
      if (department && department.match && department.match(/^[0-9a-fA-F]{24}$/)) {
        depDoc = await Department.findById(department);
      }
    } catch (e) {
      depDoc = null;
    }
    if (!depDoc) {
      depDoc = await Department.findOne({ name: department });
    }
    if (!depDoc) {
      return res.status(400).json({ status: false, message: 'Invalid department' });
    }

    // Parse salary string if provided (e.g. "$70,000 - $90,000") into salaryRange
    let parsedSalaryRange = salaryRange;
    if (!parsedSalaryRange && salary && typeof salary === 'string') {
      const nums = salary.replace(/[^0-9\-]/g, '').split('-').map(s => s.trim()).filter(Boolean);
      if (nums.length === 2) {
        const min = parseInt(nums[0], 10);
        const max = parseInt(nums[1], 10);
        if (!isNaN(min) && !isNaN(max)) parsedSalaryRange = { min, max };
      }
    }

    const job = new Job({
      title,
      department: depDoc._id,
      description,
      requirements,
      location,
      salaryRange: parsedSalaryRange,
      jobType,
      status,
      closingDate,
      postedBy: req.user?._id || req.user?.id
    });
    await job.save();
    return res.status(201).json({ status: true, message: 'Job created', data: job });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to create job', error: err.message });
  }
};

// List jobs with filters and pagination
export const listJobs = async (req, res) => {
  try {
    const { search, department, location, status, page = 1, limit = 20 } = req.query;
    const q = {};
    if (search) q.title = { $regex: search, $options: 'i' };
    if (department) q.department = department; // expect id or name depending on frontend mapping
    if (location) q.location = { $regex: location, $options: 'i' };
    if (status) q.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      Job.find(q).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Job.countDocuments(q),
    ]);
    return res.status(200).json({ status: true, data, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to list jobs', error: err.message });
  }
};

// Get job by id
export const getJob = async (req, res) => {
  try {
    const { id } = req.params;
    // populate department and applications (candidate basic info)
    const job = await Job.findById(id)
      .populate('department', 'name')
      .populate({ path: 'applications', select: 'name email phone applications resume createdAt' });
    if (!job) return res.status(404).json({ status: false, message: 'Job not found' });
    return res.status(200).json({ status: true, data: job });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to get job', error: err.message });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ status: false, message: 'Forbidden' });
    }
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ status: false, message: 'Job not found' });
    Object.assign(job, req.body);
    await job.save();
    return res.status(200).json({ status: true, message: 'Job updated', data: job });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to update job', error: err.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ status: false, message: 'Forbidden' });
    }
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) return res.status(404).json({ status: false, message: 'Job not found' });
    return res.status(200).json({ status: true, message: 'Job deleted' });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Failed to delete job', error: err.message });
  }
};

// Add candidate reference to job (helper)
export const addApplicationToJob = async (jobId, candidateId) => {
  try {
    await Job.findByIdAndUpdate(jobId, { $addToSet: { applications: candidateId } });
    return true;
  } catch (err) {
    console.error('Failed to add application to job', err);
    return false;
  }
};
