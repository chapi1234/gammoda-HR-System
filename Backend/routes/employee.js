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
import uploadProfile from "../config/multerProfile.js";
import { resumeUpload, profileUpload } from "../controllers/employeeController.js";


const router = express.Router(); 

router.get("/", authorize(["hr"]), getAllEmployees);
router.get("/:id", authorize(["employee", "hr"]), getEmployeeById);
router.post("/create", authorize(["hr"]), createEmployee);
router.put("/update/:id", authorize(["employee", "hr"]), updateEmployee);
router.put("/edit/:id", authorize(["employee","hr"]), editEmployee);
router.delete("/delete/:id", authorize(["hr"]), deleteEmployee);
router.put("/upload-resume/:id", upload.single("resume"), resumeUpload);
router.put("/upload-profile/:id", authorize(["employee","hr"]), uploadProfile.single("profile"), profileUpload);

export default router;