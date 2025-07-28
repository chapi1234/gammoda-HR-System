import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  resume: {
    filename: String,
    url: String,
  },
  coverLetter: String,
  status: {
    type: String,
    enum: ["applied", "screening", "interview", "offer", "hired", "rejected"],
    default: "applied",
  },
  score: { type: Number, default: 0 },
  interviews: [
    {
      date: Date,
      type: String,
      interviewer: String,
      notes: String,
      status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
      },
    },
  ],
  skills: [String],
  notes: String,
  appliedAt: { type: Date, default: Date.now },
});

const candidateSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: String,
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    resume: {
      filename: String,
      url: String,
    },
    parsedResume: mongoose.Schema.Types.Mixed,
    applications: [applicationSchema],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Candidate", candidateSchema);
