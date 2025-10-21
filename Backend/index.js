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

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
