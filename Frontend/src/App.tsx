import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/layout/Header';
import { AuthForm } from './components/auth/AuthForm';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Salary from './pages/Salary';
import LeaveRequests from './pages/LeaveRequests';
import Recruitment from './pages/Recruitment';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import Goals from './pages/Goals';
import Payslips from './pages/Payslips';
import NotFound from "./pages/NotFound";
import EmployeeDevices from './pages/EmployeeDevices';
import HRDeviceManagement from './pages/HRDeviceManagement';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar } from "./components/layout/Sidebar";


const queryClient = new QueryClient();

  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) return <AuthForm />;

    return (
      <div className="min-h-screen w-full flex flex-col">
        {/* Header visible only on sm/md */}
        <div className="block lg:hidden">
          <Header />
        </div>

        <div className="flex flex-1">
          {/* Sidebar visible only on lg */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    );
  };

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Dashboard /> : <AuthForm />} 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/departments" 
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/attendance" 
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/salary" 
        element={
          <ProtectedRoute>
            <Salary />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/leave-requests" 
        element={
          <ProtectedRoute>
            <LeaveRequests />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruitment" 
        element={
          <ProtectedRoute>
            <Recruitment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals" 
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payslips" 
        element={
          <ProtectedRoute>
            <Payslips />
          </ProtectedRoute>
        } 
      />
            <Route 
        path="/my-devices" 
        element={
          <ProtectedRoute>
            <EmployeeDevices />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/device-management" 
        element={
          <ProtectedRoute>
            <HRDeviceManagement />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
