import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    target: {
      type: Number,
      default: 100,
    },
    deadline: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["skill", "soft-skill", "project", "networking"],
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "on-hold"],
      default: "in-progress",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Goal", goalSchema);
