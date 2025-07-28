import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  employment: {
    employeeId: { type: String, unique: true },
    jobTitle: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active'
    },
    salary: Number,
    payType: {
      type: String,
      enum: ['hourly', 'salary'],
      default: 'salary'
    }
  },
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    graduationYear: Number
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expirationDate: Date
  }],
  emergencyContacts: [{
    name: String,
    relationship: String,
    phone: String,
    email: String
  }],
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  customFields: [{
    fieldName: String,
    fieldValue: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Employee', employeeSchema);
