import express from "express";
import {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  searchDevices,
  assignDevice,
  returnDevice,
  getMyDevices,
} from "../controllers/deviceController.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router(); 

// Get devices for current user (employees) or all for HR/admin
router.get("/me", authorize(["employee", "hr", "admin"]), getMyDevices);

// Search devices (HR/admin)
router.get("/search", authorize(["hr", "admin"]), searchDevices);

// Get all devices (HR/admin)
router.get("/", authorize(["hr", "admin"]), getDevices);

// Get device by ID
router.get("/:id", authorize(["hr", "admin"]), getDeviceById);

// Create device
router.post("/", authorize(["hr", "admin"]), createDevice);

// Update device
router.put("/:id", authorize(["hr", "admin"]), updateDevice);

// Delete device
router.delete("/:id", authorize(["hr", "admin"]), deleteDevice);

// Assign device to employee
router.post("/:id/assign", authorize(["hr", "admin"]), assignDevice);

// Mark device as returned
router.post("/:id/return", authorize(["hr", "admin"]), returnDevice);

export default router;
