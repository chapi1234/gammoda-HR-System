import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/DBconnect.js";
import cloudinary from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employee.js"
import departmentRoutes from "./routes/department.js";
import eventRoutes from "./routes/event.js";
import goalRoutes from "./routes/goal.js";
import attendanceRoutes from "./routes/attendance.js";
import activityRoutes from "./routes/activity.js";
import leaveRoutes from "./routes/leave.js";
import payrollRoutes from "./routes/payroll.js";
import payslipRoutes from './routes/payslip.js';
import jobRoutes from './routes/jobs.js';
import candidateRoutes from './routes/candidates.js';
import deviceRoutes from './routes/device.js';

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['https://gammoda.vercel.app', 'http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

// Route middlewares
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/activities", activityRoutes);

app.use("/api/leave", leaveRoutes);
app.use('/api/payslips', payslipRoutes);
app.use("/api/payroll", payrollRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/devices', deviceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
