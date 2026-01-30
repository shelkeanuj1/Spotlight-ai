import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      setLocation("/"); // ✅ redirect ONLY if login success
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-[380px] p-8 space-y-6 shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center">
          SpotLight <span className="text-primary">AI</span>
        </h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full" disabled={loading} onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <span
            className="text-primary cursor-pointer font-semibold"
            onClick={() => setLocation("/signup")}
          >
            Sign up
          </span>
        </p>
      </Card>
    </div>
  );
}
