import Event from "../models/Event.js";
import Joi from "joi";

// Validation schema
const eventSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().allow("").max(2000),
  date: Joi.alternatives(Joi.string(), Joi.date()).required(),
  time: Joi.string().trim().default("09:00"),
  duration: Joi.number().integer().min(1).max(24 * 60).default(60),
  type: Joi.string()
    .valid("meeting", "holiday", "training", "personal", "other")
    .default("meeting"),
  location: Joi.string().allow(""),
  attendees: Joi.array().items(Joi.string().trim()).default([]),
  color: Joi.string().allow("")
});

const typeToColor = {
  meeting: "bg-blue-500",
  holiday: "bg-red-500",
  training: "bg-purple-500",
  personal: "bg-green-500",
  other: "bg-gray-500"
};

function parseDateOnly(value) {
  if (!value) return null;
  // Accept Date as-is
  if (value instanceof Date) return value;
  // If string like YYYY-MM-DD, create LOCAL date to avoid UTC offset issues
  if (typeof value === 'string') {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      const year = Number(m[1]);
      const monthIndex = Number(m[2]) - 1; // 0-based
      const day = Number(m[3]);
      const local = new Date(year, monthIndex, day); // local midnight
      if (!Number.isNaN(local.getTime())) return local;
    }
    // fallback for other string formats
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
    return null;
  }
  // Fallback
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Create
export const createEvent = async (req, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ status: false, message: "Validation failed", details: error.details });
    }

    const dateParsed = parseDateOnly(value.date);
    if (!dateParsed) {
      return res.status(400).json({ status: false, message: "Invalid date format" });
    }

    const color = value.color && value.color.trim().length > 0 ? value.color : (typeToColor[value.type] || "bg-gray-500");

    const created = await Event.create({
      title: value.title,
      description: value.description,
      date: dateParsed,
      time: value.time,
      duration: value.duration,
      type: value.type,
      location: value.location,
      attendees: value.attendees || [],
      color
    });

    return res.status(201).json({ status: true, message: "Event created", data: created });
  } catch (err) {
    console.error("createEvent error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// List with filters: from, to, type, q
export const getEvents = async (req, res) => {
  try {
    const { from, to, type, q } = req.query;

    const filter = {};
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = startOfDay(parseDateOnly(from));
      if (to) filter.date.$lte = endOfDay(parseDateOnly(to));
    }
    if (type) {
      filter.type = type;
    }
    if (q && String(q).trim().length > 0) {
      const regex = new RegExp(String(q).trim(), "i");
      filter.$or = [{ title: regex }, { description: regex }, { location: regex }];
    }

    const events = await Event.find(filter).sort({ date: 1, time: 1, createdAt: -1 });
    return res.status(200).json({ status: true, data: events });
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Search alias endpoint
export const searchEvents = async (req, res) => {
  req.query.q = req.query.q || "";
  return getEvents(req, res);
};

// Get by a specific date (YYYY-MM-DD)
export const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const d = parseDateOnly(date);
    if (!d) {
      return res.status(400).json({ status: false, message: "Invalid date" });
    }
    const events = await Event.find({ date: { $gte: startOfDay(d), $lte: endOfDay(d) } }).sort({ time: 1 });
    return res.status(200).json({ status: true, data: events });
  } catch (err) {
    console.error("getEventsByDate error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Upcoming
export const getUpcomingEvents = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 5, 50));
    const now = startOfDay(new Date());
    const events = await Event.find({ date: { $gte: now } })
      .sort({ date: 1, time: 1 })
      .limit(limit);
    return res.status(200).json({ status: true, data: events });
  } catch (err) {
    console.error("getUpcomingEvents error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get by id
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ status: false, message: "Event not found" });
    return res.status(200).json({ status: true, data: event });
  } catch (err) {
    console.error("getEventById error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Update
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = eventSchema.fork(["title", "date"], (s) => s.optional()).validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ status: false, message: "Validation failed", details: error.details });
    }

    const update = { ...value };
    if (update.date) {
      const d = parseDateOnly(update.date);
      if (!d) return res.status(400).json({ status: false, message: "Invalid date format" });
      update.date = d;
    }

    if (!update.color && update.type) {
      update.color = typeToColor[update.type] || "bg-gray-500";
    }

    const updated = await Event.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ status: false, message: "Event not found" });
    return res.status(200).json({ status: true, message: "Event updated", data: updated });
  } catch (err) {
    console.error("updateEvent error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Delete
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ status: false, message: "Event not found" });
    return res.status(200).json({ status: true, message: "Event deleted" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};
