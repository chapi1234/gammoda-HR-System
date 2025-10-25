import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import Department from '../models/Department.js';
import Employee from '../models/Employee.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gammoda';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB for seeding');

  // Create Department
  let dep = await Department.findOne({ name: 'Engineering' });
  if (!dep) {
    dep = new Department({ name: 'Engineering', description: 'Engineering dept' });
    await dep.save();
    console.log('Created department:', dep._id);
  } else {
    console.log('Department exists:', dep._id);
  }

  // Create HR user
  let hr = await Employee.findOne({ email: 'hr@example.com' });
  if (!hr) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('Password123', salt);
    hr = new Employee({
      name: 'HR Admin',
      email: 'hr@example.com',
      role: 'hr',
      department: dep._id,
      password: hashed,
      employeeId: 'EMP_HR_01',
      position: 'HR Manager'
    });
    await hr.save();
    console.log('Created HR user:', hr._id);
  } else {
    console.log('HR exists:', hr._id);
  }

  // Create demo employee
  let emp = await Employee.findOne({ employeeId: 'EMP001' });
  if (!emp) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('Password123', salt);
    emp = new Employee({
      name: 'Demo Employee',
      email: 'employee1@example.com',
      role: 'employee',
      department: dep._id,
      password: hashed,
      employeeId: 'EMP001',
      position: 'Developer'
    });
    await emp.save();
    console.log('Created demo employee:', emp._id);
  } else {
    console.log('Demo employee exists:', emp._id);
  }

  console.log('Seeding complete');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed error', err);
  process.exit(1);
});
