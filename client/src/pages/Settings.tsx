import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { User, Bell, Shield, Car, Brain, CreditCard, LogOut } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [trafficEnabled, setTrafficEnabled] = useState(true);
  const [coveredParking, setCoveredParking] = useState(true);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10 pb-10">

        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and AI preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* PROFILE */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="text-primary" /> Profile
            </h2>

            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.[0] || "G"}
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || "Not logged in"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={user?.name || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
              </div>
            </Card>
          </section>

          {/* AI & THEME */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="text-primary" /> AI & Theme
            </h2>

            <Card className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span>Dark Mode</span>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex justify-between items-center">
                <span>AI Predictions</span>
                <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
              </div>

              <div className="flex justify-between items-center">
                <span>Traffic Optimization</span>
                <Switch checked={trafficEnabled} onCheckedChange={setTrafficEnabled} />
              </div>
            </Card>
          </section>

          {/* PARKING */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Car className="text-primary" /> Parking Preferences
            </h2>

            <Card className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span>Covered Parking Priority</span>
                <Switch checked={coveredParking} onCheckedChange={setCoveredParking} />
              </div>
            </Card>
          </section>

          {/* SECURITY */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="text-primary" /> Security
            </h2>

            <Card className="p-6 space-y-4">
              <Button variant="outline">Change Password</Button>
            </Card>
          </section>

          {/* SUBSCRIPTION */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="text-primary" /> Subscription
            </h2>

            <Card className="p-6 flex justify-between items-center">
              <div>
                <p className="font-semibold">Premium Plan</p>
                <p className="text-sm text-muted-foreground">
                  Unlimited AI features
                </p>
              </div>
              <Button variant="outline">Manage</Button>
            </Card>
          </section>

        </div>

        {/* LOGOUT */}
        {user && (
          <Button
            variant="destructive"
            className="flex gap-2"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}

      </div>
    </Layout>
  );
}
