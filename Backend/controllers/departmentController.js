import Department from "../models/Department.js";

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.status(200).json(department);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch department" });
  }
};

// Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { name, description, head, location, budget } = req.body;
    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }
    const department = new Department({
      name,
      description,
      head,
      location,
      budget: parseInt(budget) || 0,
      employeeCount: 0,
      averageSalary: 0,
      established: new Date().toISOString().split("T")[0],
    });
    await department.save();
    res.status(201).json({department});
  } catch (err) {
    res.status(500).json({ error: "Failed to create department" });
  }
};

// Update a department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const department = await Department.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.status(200).json(department);
  } catch (err) {
    res.status(500).json({ error: "Failed to update department" });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete department" });
  }
};

// Search departments (by name, description, or head)
export const searchDepartments = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, "i");
    const departments = await Department.find({
      $or: [{ name: regex }, { description: regex }, { head: regex }],
    });
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ error: "Failed to search departments" });
  }
};
