import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) return null;

  if (!user) {
    setLocation("/login");
    return null;
  }

  return <>{children}</>;
}
