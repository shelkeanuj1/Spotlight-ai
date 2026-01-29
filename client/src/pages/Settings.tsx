import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Car, Moon, CreditCard } from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your preferences and account details</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile Information
            </h2>
            <Card className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="john.doe@example.com" type="email" />
              </div>
              <Button>Save Changes</Button>
            </Card>
          </section>

          {/* Preferences */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" /> Parking Preferences
            </h2>
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Prioritize Covered Parking</Label>
                  <p className="text-sm text-muted-foreground">Prefer garages over street parking</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Walking Distance Limit</Label>
                  <p className="text-sm text-muted-foreground">Alert if spot is &gt; 500m away</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Price Sensitivity</Label>
                  <p className="text-sm text-muted-foreground">Show cheapest spots first</p>
                </div>
                <Switch />
              </div>
            </Card>
          </section>

          {/* Notifications */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </h2>
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts about parking availability</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Weekly summary of your parking history</p>
                </div>
                <Switch />
              </div>
            </Card>
          </section>

          <Button variant="destructive" className="w-full sm:w-auto">
            Log Out
          </Button>
        </div>
      </div>
    </Layout>
  );
}
