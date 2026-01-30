import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);

    if (success) {
      setLocation("/login"); // ✅ redirect to login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <Card className="w-[400px] p-8 space-y-6 shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center">Create Account</h1>

        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <Button className="w-full" disabled={loading} onClick={handleSignup}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer font-semibold"
            onClick={() => setLocation("/login")}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
