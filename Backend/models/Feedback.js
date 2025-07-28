import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    category: {
      type: String,
      enum: ["performance", "peer", "manager", "self", "exit", "general"],
      default: "general",
    },
    subject: {
      type: String,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        url: String,
        filename: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "reviewed", "archived"],
      default: "pending",
    },
    response: {
      type: String,
      maxlength: 2000,
    },
    respondedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", feedbackSchema);
