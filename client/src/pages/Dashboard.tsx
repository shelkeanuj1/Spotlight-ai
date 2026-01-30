import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useParkingSearch } from "@/hooks/use-parking";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Zap, TrendingUp, Car, BatteryCharging, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { AiAssistant } from "@/components/AiAssistant";

export default function Dashboard() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [aiOpen, setAiOpen] = useState(false); // ✅ FIXED: moved here

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserLocation({ lat: 19.076, lng: 72.8777 })
    );
  }, []);

  const { data: parkingData, isLoading } = useParkingSearch(
    userLocation
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : null
  );

  const spots = parkingData?.spots || [];
  const insights = parkingData?.insights;
  const bestSpot = spots[0];
  const avgScore = insights?.averageProbability || 0;

  return (
    <Layout>
      <div className="space-y-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold">
            SpotLight <span className="text-primary">AI Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time smart parking analytics near you
          </p>
        </motion.div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Nearby Spots"
            value={spots.length}
            icon={<MapPin />}
            color="bg-blue-500/10 text-blue-600"
          />

          <MetricCard
            title="Best Probability"
            value={`${avgScore}%`}
            icon={<TrendingUp />}
            color="bg-green-500/10 text-green-600"
          />

          <MetricCard
            title="Traffic Level"
            value={bestSpot?.trafficDensity || "Moderate"}
            icon={<Car />}
            color="bg-yellow-500/10 text-yellow-600"
          />

          <MetricCard
            title="EV Stations"
            value="12+"
            icon={<BatteryCharging />}
            color="bg-purple-500/10 text-purple-600"
          />
        </div>

        {/* AI INSIGHTS + ASSISTANT INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* AI RECOMMENDATION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-primary/15 to-transparent border-primary/30 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-primary h-6 w-6" />
                <h3 className="text-xl font-bold">AI Recommendation</h3>
              </div>

              {isLoading ? (
                <Skeleton className="h-6 w-2/3" />
              ) : (
                <p className="text-muted-foreground text-lg">
                  {insights?.summary ||
                    "AI is analyzing traffic, demand, and parking availability in your area..."}
                </p>
              )}
            </Card>
          </motion.div>

          {/* AI ASSISTANT PREVIEW */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-6 rounded-2xl shadow-lg border border-border/60">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">SpotLight AI Assistant</h3>
              </div>

              {isLoading ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>🤖 Hello! Here is what I found:</p>
                  <p>• {spots.length} parking zones detected near you.</p>
                  <p>• Best success probability: {avgScore}%.</p>
                  <p>👉 Click the AI button to chat with me.</p>
                </div>
              )}
            </Card>
          </motion.div>

        </div>
      </div>

      {/* 🤖 FLOATING AI BUTTON */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 z-[999] bg-primary text-white p-4 rounded-full shadow-xl hover:scale-105 transition"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* 🤖 AI CHAT PANEL */}
      <AiAssistant open={aiOpen} onClose={() => setAiOpen(false)} />

    </Layout>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="p-5 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
