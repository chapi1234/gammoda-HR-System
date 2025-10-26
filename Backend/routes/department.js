import express from "express";
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
  getDepartmentsPublicList,
} from "../controllers/departmentController.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// Place search before dynamic :id to avoid route shadowing
// Public minimal list for unauthenticated clients
router.get("/public-list", getDepartmentsPublicList);
router.get("/", authorize(["hr", "admin", "employee"]), getAllDepartments);
router.get("/search", authorize(["hr", "admin", "employee"]), searchDepartments);
router.get("/:id", authorize(["hr", "admin", "employee"]), getDepartmentById);
router.post("/", authorize(["hr", "admin"]), createDepartment);
router.put("/:id", authorize(["hr", "admin"]), updateDepartment);
router.delete("/:id", authorize(["hr", "admin"]), deleteDepartment);

export default router;
