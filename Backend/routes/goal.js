import express from "express";
import { getGoals, getGoalById, createGoal, updateGoal, deleteGoal } from "../controllers/goalController.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// All goal operations require auth; employees can only access their own, HR can pass employeeId to filter or manage anyone
router.get("/", authorize(["employee", "hr", "admin"]), getGoals);
router.get("/:id", authorize(["employee", "hr", "admin"]), getGoalById);
router.post("/", authorize(["employee", "hr", "admin"]), createGoal);
router.put("/:id", authorize(["employee", "hr", "admin"]), updateGoal);
router.delete("/:id", authorize(["employee", "hr", "admin"]), deleteGoal);

export default router;
