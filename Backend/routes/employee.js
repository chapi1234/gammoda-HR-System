import express from "express";
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    editEmployee,
    deleteEmployee 
} from "../controllers/employeeController.js";
import authorize from "../middlewares/authorize.js";
import upload from "../config/multer.js";
import { resumeUpload } from "../controllers/employeeController.js";


const router = express.Router(); 

router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.post("/create", createEmployee);
router.put("/update/:id", authorize(["employee", "hr"]), updateEmployee);
router.put("/edit/:id", authorize(["hr"]), editEmployee);
router.delete("/delete/:id", deleteEmployee);
router.put("/upload-resume/:id", upload.single("resume"), resumeUpload);

export default router;