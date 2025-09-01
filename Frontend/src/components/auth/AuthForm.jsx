import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import {
  Building2,
  Mail,
  Lock,
  User,
  Shield,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import logo from "../../assets/download.jpg";
import { toast } from "react-toastify";

export const AuthForm = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // 'login', 'signup', 'forgot-email', 'forgot-code', 'forgot-password'
  const [otpCode, setOtpCode] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    department: "",
    avatar: "",
  });

  const [forgotForm, setForgotForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Human Resources",
    "Finance",
    "Operations",
    "Customer Support",
    "Product",
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password, loginForm.role);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: signupForm.name,
        email: signupForm.email,
        role: signupForm.role,
        department: signupForm.department,
        avatar: signupForm.avatar || "",
        password: signupForm.password,
        confirmPassword: signupForm.confirmPassword,
      };
      await signup(payload);
      // await signup(signupForm);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleForgotEmail = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   // Simulate sending email
  //   setTimeout(() => {
  //     setLoading(false);
  //     setMode("forgot-code");
  //   }, 1000);
  // };
  const handleForgotEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forget-password", {
        email: forgotForm.email,
      });
      toast.success(res.data.message);
      setMode("forgot-code");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  // const handleCodeVerification = (e) => {
  //   e.preventDefault();
  //   if (otpCode === "123456") {
  //     // Demo code
  //     setMode("forgot-password");
  //   } else {
  //     alert("Invalid code. Use 123456 for demo.");
  //   }
  // };
  const [resetToken, setResetToken] = useState("");

  // const handleCodeVerification = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const res = await axios.post("http://localhost:5000/auth/verify-otp", {
  //       email: forgotForm.email,
  //       otp: otpCode,
  //     });
  //     setResetToken(res.data.resetToken);
  //     alert(res.data.message);
  //     setMode("forgot-password");
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Invalid or expired code");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleCodeVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: forgotForm.email.trim(),
        otp: otpCode.trim(),   // ✅ make sure OTP is a string without spaces
      });
      setResetToken(res.data.resetToken);
      toast.success(res.data.message);
      setMode("forgot-password");
    } catch (err) {
      toast.success(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // const handlePasswordReset = (e) => {
  //   e.preventDefault();
  //   if (forgotForm.newPassword !== forgotForm.confirmPassword) {
  //     toast.error("Passwords do not match");
  //     return;
  //   }
  //   setLoading(true);
  //   // Simulate password reset
  //   setTimeout(() => {
  //     setLoading(false);
  //     toast.success("Password reset successful!");
  //     setMode("login");
  //     setForgotForm({ email: "", newPassword: "", confirmPassword: "" });
  //     setOtpCode("");
  //   }, 1000);
  // };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        resetToken,
        newPassword: forgotForm.newPassword,
        confirmNewPassword: forgotForm.confirmPassword,
      });
      toast.success(res.data.message);
      setMode("login");
      setForgotForm({ email: "", newPassword: "", confirmPassword: "" });
      setOtpCode("");
      setResetToken("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-3/4 sm:w-1/2 max-w-xl mx-auto"> 
        {" "}
        {/* Responsive: half screen on sm+, centered */}
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4 overflow-hidden">
            {/* <Building2 className="w-8 h-8 text-primary" /> */}
            <img
              src={logo}
              alt="GammoDA Logo"
              className="w-16 h-16 object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">GammoDA</h1>
          <p className="text-blue-100">HR Management System</p>
        </div>
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            {mode === "login" && (
              <>
                <CardTitle className="text-xl">Sign In</CardTitle>
                <CardDescription>Welcome back to your account</CardDescription>
              </>
            )}
            {mode === "signup" && (
              <>
                <CardTitle className="text-xl">Create Account</CardTitle>
                <CardDescription>Join our team today</CardDescription>
              </>
            )}
            {mode === "forgot-email" && (
              <>
                <CardTitle className="text-xl">Reset Password</CardTitle>
                <CardDescription>
                  Enter your email to receive a reset code
                </CardDescription>
              </>
            )}
            {mode === "forgot-code" && (
              <>
                <CardTitle className="text-xl">Verify Code</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to your email
                </CardDescription>
              </>
            )}
            {mode === "forgot-password" && (
              <>
                <CardTitle className="text-xl">New Password</CardTitle>
                <CardDescription>Create your new password</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Login Form */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={loginForm.role}
                    onValueChange={(value) =>
                      setLoginForm((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Employee</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="hr">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>HR Manager</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode("forgot-email")}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                {/* Toggle to Sign Up */}
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Signup Form */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select
                      value={signupForm.role}
                      onValueChange={(value) =>
                        setSignupForm((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="hr">HR Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={signupForm.department}
                      onValueChange={(value) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          department: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Toggle to Sign In */}
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Forgot Password - Email Step */}
            {mode === "forgot-email" && (
              <form onSubmit={handleForgotEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={forgotForm.email}
                      onChange={(e) =>
                        setForgotForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Code"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Forgot Password - Code Verification */}
            {mode === "forgot-code" && (
              <form onSubmit={handleCodeVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otpCode}
                      onChange={setOtpCode}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {/* <p className="text-xs text-center text-muted-foreground">
                    Demo code: 123456
                  </p> */}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={otpCode.length !== 6}
                >
                  Verify Code
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode("forgot-email")}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Email
                  </button>
                </div>
              </form>
            )}

            {/* Forgot Password - New Password */}
            {mode === "forgot-password" && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      className="pl-10"
                      value={forgotForm.newPassword}
                      onChange={(e) =>
                        setForgotForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-10"
                      value={forgotForm.confirmPassword}
                      onChange={(e) =>
                        setForgotForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
