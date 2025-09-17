import express from "express";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments
} from "../controllers/departmentController.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.get("/", authorize(["hr", "admin"]), getDepartments);
router.get("/:id", authorize(["hr", "admin"]), getDepartmentById);
router.post("/", authorize(["hr", "admin"]), createDepartment);
router.put("/:id", authorize(["hr", "admin"]), updateDepartment);
router.delete("/:id", authorize(["hr", "admin"]), deleteDepartment);
router.get("/search", authorize(["hr", "admin"]), searchDepartments);

export default router;
