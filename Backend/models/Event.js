import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      default: "09:00",
    },
    duration: {
      type: Number,
      default: 60,
    },
    type: {
      type: String,
      enum: ["meeting", "holiday", "training", "personal", "other"],
      default: "meeting",
    },
    location: {
      type: String,
    },
    attendees: [
      {
        type: String,
      },
    ],
    color: {
      type: String,
      default: "bg-gray-500",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
