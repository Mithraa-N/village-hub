import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { getUser, Role } from "./lib/auth";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Complaints from "./pages/Complaints";
import Budget from "./pages/Budget";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) => {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<AccessDenied />} />

          {/* Root Redirection based on role */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />

          {/* Viewer / General Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN", "OPERATOR", "VIEWER"]}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Operator Specific Routes */}
          <Route path="/ops/assets" element={
            <ProtectedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
              <Assets />
            </ProtectedRoute>
          } />

          {/* Admin Specific Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/budget" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Budget />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          } />


          {/* Alias for existing routes to handle legacy links or direct navigation */}
          <Route path="/assets" element={<Navigate to="/ops/assets" replace />} />
          <Route path="/complaints" element={
            <ProtectedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
              <Complaints />
            </ProtectedRoute>
          } />
          <Route path="/budget" element={<Navigate to="/admin/budget" replace />} />
          <Route path="/users" element={<Navigate to="/admin/users" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
