import Department from "../models/Department.js";
import Employee from "../models/Employee.js";

// Helper: map Department document to frontend shape (head may be populated or raw id/string)
const mapDepartment = (dept) => {
  // Resolve head name and id whether head is populated (object) or a raw string/id
  const headObj = dept.head;
  const headName = headObj && typeof headObj === 'object' ? headObj.name : (headObj || '');
  const headId = headObj && typeof headObj === 'object' ? headObj._id : null;
  const headAvatar = (headObj && typeof headObj === 'object' && headObj.profileImage)
    ? headObj.profileImage
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(headName || "")}\u0026background=3b82f6\u0026color=fff`;

  return {
    id: dept._id,
    name: dept.name,
    description: dept.description,
    head: headName,
    headId,
    headAvatar,
    employeeCount: typeof dept.employeeCount === 'number' ? dept.employeeCount : 0,
    averageSalary: typeof dept.averageSalary === 'number' ? dept.averageSalary : 0,
    budget: typeof dept.budget === 'number' ? dept.budget : 0,
    location: dept.location,
    established: dept.established ? new Date(dept.established).toISOString().split("T")[0] : "",
  };
};

export const getAllDepartments = async (req, res) => {
  try {
  // Populate head so we can return head name/profileImage/headId to frontend
  const departments = await Department.find().populate({ path: 'head', select: 'name profileImage' });

    // Aggregate average salary per department (exclude non-positive/undefined salaries)
    const avgs = await Employee.aggregate([
      { $match: { salary: { $gt: 0 } } },
      { $group: { _id: "$department", avgSalary: { $avg: "$salary" } } },
    ]);
    const avgMap = new Map(avgs.map((a) => [String(a._id), a.avgSalary]));

    const mapped = (departments || []).map((dept) => {
      const base = mapDepartment(dept);
      const override = avgMap.get(String(dept._id));
      if (override !== undefined) base.averageSalary = override;
      return base;
    });
    return res.status(200).json({
      status: true,
      message: "Departments fetched successfully",
      data: mapped,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error,
    });
  }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
  const department = await Department.findById(id).populate({ path: 'head', select: 'name profileImage' });
    if (!department) {
      return res.status(404).json({
        status: false,
        message: "Department not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Department fetched successfully",
      data: mapDepartment(department),
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch department",
      error: err.message,
    });
  }
};

// Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { name, description, head, location, budget } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        status: false,
        message: "Name and description are required",
      });
    }
    const department = new Department({
      name,
      description,
      head,
      location,
      budget: Number.isFinite(Number(budget)) ? Number(budget) : 0,
      employeeCount: 0,
      averageSalary: 0,
      // let schema default set established as Date
    });
    await department.save();
    // re-fetch with populated head for consistent response shape
    const saved = await Department.findById(department._id).populate({ path: 'head', select: 'name profileImage' });
    return res.status(201).json({
      status: true,
      message: "Department created successfully",
      data: mapDepartment(saved),
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to create department",
      error: err.message,
    });
  }
};

// Update a department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, head, location, budget, employeeCount, averageSalary, established } = req.body;
    const updates = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(head !== undefined && { head }),
      ...(location !== undefined && { location }),
      ...(budget !== undefined && { budget: Number.isFinite(Number(budget)) ? Number(budget) : 0 }),
      ...(employeeCount !== undefined && { employeeCount: Number(employeeCount) || 0 }),
      ...(averageSalary !== undefined && { averageSalary: Number(averageSalary) || 0 }),
      ...(established !== undefined && { established }),
    };
  let department = await Department.findByIdAndUpdate(id, updates, { new: true });
  // ensure head is populated for the response
  department = await Department.findById(department._id).populate({ path: 'head', select: 'name profileImage' });
    if (!department) {
      return res.status(404).json({
        status: false,
        message: "Department not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Department updated successfully",
      data: mapDepartment(department),
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to update department",
      error: err.message,
    });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({
        status: false,
        message: "Department not found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Department deleted successfully",
      data: mapDepartment(department),
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to delete department",
      error: err.message,
    });
  }
};

// Search departments (by name, description, or head)
export const searchDepartments = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = q ? new RegExp(q, "i") : /.*/;
    const departments = await Department.find({
      $or: [{ name: regex }, { description: regex }],
    }).populate({ path: 'head', select: 'name profileImage' });
    const filtered = (departments || []).filter((d) => regex.test(d.name) || regex.test(d.description || "") || regex.test(d.head?.name || ""));
    const mapped = filtered.map(mapDepartment);
    return res.status(200).json({
      status: true,
      message: "Departments search results",
      data: mapped,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to search departments",
      error: err.message,
    });
  }
};

// Public: minimal list for unauthenticated clients (e.g., signup form)
export const getDepartmentsPublicList = async (req, res) => {
  try {
    const departments = await Department.find({}, { name: 1 }).sort({ name: 1 });
    const data = (departments || []).map((d) => ({ id: d._id, name: d.name }));
    return res.status(200).json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to load departments" });
  }
};
