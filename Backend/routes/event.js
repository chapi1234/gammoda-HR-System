import express from "express";
import authorize from "../middlewares/authorize.js";
import {
  createEvent,
  getEvents,
  searchEvents,
  getEventsByDate,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// Read endpoints (employees can view)
router.get("/", authorize(["employee", "hr", "admin"]), getEvents);
router.get("/search", authorize(["employee", "hr", "admin"]), searchEvents);
router.get("/date/:date", authorize(["employee", "hr", "admin"]), getEventsByDate);
router.get("/upcoming", authorize(["employee", "hr", "admin"]), getUpcomingEvents);
router.get("/:id", authorize(["employee", "hr", "admin"]), getEventById);

// Mutating endpoints (restricted to HR/Admin)
router.post("/", authorize(["hr", "admin"]), createEvent);
router.put("/:id", authorize(["hr", "admin"]), updateEvent);
router.delete("/:id", authorize(["hr", "admin"]), deleteEvent);

export default router;
