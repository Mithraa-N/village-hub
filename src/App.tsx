import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getAuthToken, getUser } from "./lib/auth";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Complaints from "./pages/Complaints";
import Budget from "./pages/Budget";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const token = getAuthToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute roles={["ADMIN", "OPERATOR"]}><Assets /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute roles={["ADMIN", "OPERATOR"]}><Complaints /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute roles={["ADMIN"]}><Budget /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={["ADMIN"]}><UserManagement /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);



export default App;

