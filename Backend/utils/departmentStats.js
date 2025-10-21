import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

export const recalcDepartmentStats = async (deptId) => {
  try {
    if (!deptId) return;
    const id = typeof deptId === "string" ? deptId : String(deptId);
    const objectId = new mongoose.Types.ObjectId(id);

    // Total employees in department
    const totalCount = await Employee.countDocuments({ department: objectId });

    // Average salary considering only employees with a positive salary
    const avgAgg = await Employee.aggregate([
      { $match: { department: objectId, salary: { $gt: 0 } } },
      { $group: { _id: "$department", avgSalary: { $avg: "$salary" } } },
    ]);
    const averageSalary = avgAgg?.[0]?.avgSalary || 0;

    await Department.findByIdAndUpdate(objectId, {
      employeeCount: totalCount,
      averageSalary,
    });
  } catch (err) {
    // Non-fatal; log for diagnostics
    console.error("recalcDepartmentStats error:", err?.message || err);
  }
};
