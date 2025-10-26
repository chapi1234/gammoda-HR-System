import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    // Auth & Account
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["employee", "hr"],
      default: "employee",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    // Personal Info
    name: { type: String, required: true },
    phone: String,
    gender: { type: String, enum: ["M", "F"], default: "M" },
    dateOfBirth: Date,
    profileImage: { type: String },
    address: { type: String },
    bio: { type: String },
    skills: { type: String },
  // Employment Info
  position: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    employeeId: { type: String },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },
    salary: { type: Number },
    payType: {
      type: String,
      enum: ["hourly", "salary"],
      default: "salary",
    },
    emergencyContact: { type: String },
    emergencyPhone: { type: String },
    resume: { 
      name: String,
      type: String,
      url: String,
      uploadDate: { type: Date, default: Date.now },
     },

    // Education & Certifications
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        graduationYear: Number,
      },
    ],
    certifications: [
      {
        name: String,
        issuingOrganization: String,
        issueDate: Date,
        expirationDate: Date,
      },
    ],

    // Documents
    documents: [
      {
        name: String,
        type: String,
        url: String,
        uploadDate: { type: Date, default: Date.now },
      },
    ],

    // Custom Fields
    customFields: [
      {
        fieldName: String,
        fieldValue: String,
      },
    ],
    otp: String,
    otpExpiry: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Employee", EmployeeSchema);
