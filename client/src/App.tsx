import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";
import type { Admin } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

function ProtectedRoute({ admin, children }: { admin: Admin | null; children: React.ReactNode }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!admin) {
      setLocation("/login");
    }
  }, [admin, setLocation]);

  if (!admin) {
    return null;
  }

  return <>{children}</>;
}

function LoginRoute({ admin, onLogin }: { admin: Admin | null; onLogin: (admin: Admin) => void }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (admin) {
      setLocation("/admin");
    }
  }, [admin, setLocation]);

  if (admin) {
    return null;
  }

  return <Login onLogin={onLogin} />;
}

function Router({ 
  admin, 
  onLogin, 
  onUnauthorized 
}: { 
  admin: Admin | null; 
  onLogin: (admin: Admin) => void;
  onUnauthorized: () => void;
}) {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/register" component={Register} />
      <Route path="/login">
        {() => <LoginRoute admin={admin} onLogin={onLogin} />}
      </Route>
      <Route path="/admin">
        {() => (
          <ProtectedRoute admin={admin}>
            <AdminDashboard onUnauthorized={onUnauthorized} />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/session", undefined);
        const data = await response.json();
        if (data.admin) {
          setAdmin(data.admin);
        } else {
          setAdmin(null);
        }
      } catch (error) {
        // No active session
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = (admin: Admin) => {
    setAdmin(admin);
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setAdmin(null);
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUnauthorized = () => {
    setAdmin(null);
    setLocation("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation admin={admin} onLogout={handleLogout} />
          <Router admin={admin} onLogin={handleLogin} onUnauthorized={handleUnauthorized} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
