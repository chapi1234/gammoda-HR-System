import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., Laptop, Phone
    type: { type: String, required: true }, // e.g., Electronics, Accessory
    brand: { type: String },
    ram: { type: String },
    storage: { type: String },
    model: { type: String },
    serialNumber: { type: String, unique: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Reference to Employee
    assignedDate: { type: Date },
    returnDate: { type: Date },
    location: { type: String },
    purchaseDate: { type: Date },
    status: {
      type: String,
      enum: ["assigned", "available", "maintenance", "lost", "retired"],
      default: "available",
    },
    condition: { type: String }, // e.g., New, Good, Needs Repair
    notes: { type: String },
    history: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        action: {
          type: String,
          enum: ["assigned", "returned", "maintenance", "lost", "retired"],
        },
        date: { type: Date, default: Date.now },
        notes: { type: String },
        location: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);
