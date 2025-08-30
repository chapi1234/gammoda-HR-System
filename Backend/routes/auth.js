import express from "express";
import {
  register,
  login,
  forgetPasswordRequest,
  verifyOTP,
  resetPassword,
  changePassword,
} from "../controllers/authController.js"; 

const router = express.Router();

router.post("/register", register); 
router.post("/login", login); 
router.post("/forget-password", forgetPasswordRequest);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.put("/change-password/:id", changePassword);

export default router;
