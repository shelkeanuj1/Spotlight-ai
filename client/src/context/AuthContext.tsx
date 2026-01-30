import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("spotlight-user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  // ✅ LOGIN (REAL BACKEND)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return false;
      }

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
      };

      setUser(userData);
      localStorage.setItem("spotlight-user", JSON.stringify(userData));
      localStorage.setItem("spotlight-token", data.token);

      return true;
    } catch (err) {
      alert("Server error. Try again.");
      return false;
    }
  };

  // ✅ SIGNUP
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return false;
      }

      alert("✅ Account created successfully! Please login.");
      return true;
    } catch (err) {
      alert("Server error. Try again.");
      return false;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("spotlight-user");
    localStorage.removeItem("spotlight-token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
