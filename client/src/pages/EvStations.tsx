import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { EvMap } from "@/components/EvMap";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export default function EvStations() {
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [userLocation, setUserLocation] = useState({ lat: 19.076, lng: 72.8777 });

  // ===== USER LOCATION =====
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {}
    );
  }, []);

  // ===== LOAD CITIES =====
  const { data: cities } = useQuery({
    queryKey: [api.parking.cities.path],
    queryFn: async () => {
      const res = await fetch(api.parking.cities.path);
      return res.json();
    },
  });

  // ===== LOAD EV STATIONS =====
  const { data: stations, isLoading } = useQuery({
    queryKey: [api.parking.evStations.path, selectedCityId],
    queryFn: async () => {
      const res = await fetch(`${api.parking.evStations.path}?cityId=${selectedCityId}`);
      return res.json();
    },
    enabled: selectedCityId !== null,
  });

  useEffect(() => {
    if (cities && cities.length > 0 && selectedCityId === null) {
      setSelectedCityId(cities[0].id);
    }
  }, [cities, selectedCityId]);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

        {/* ===== LEFT PANEL ===== */}
        <div className="space-y-5 overflow-y-auto pr-2">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold">
              ⚡ EV Charging Stations
            </h1>
            <p className="text-muted-foreground text-sm">
              Find and navigate to nearby EV chargers
            </p>
          </div>

          {/* CITY FILTER */}
          <div className="flex flex-wrap gap-2">
            {cities?.map((city: any) => (
              <Button
                key={city.id}
                size="sm"
                variant={selectedCityId === city.id ? "default" : "outline"}
                onClick={() => setSelectedCityId(city.id)}
              >
                {city.name}
              </Button>
            ))}
          </div>

          {/* STATIONS LIST */}
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">Loading...</div>
          ) : stations?.length ? (
            stations.map((s: any, idx: number) => {
              const active = selectedStation?.id === s.id;
              const available = s.status === "Available";

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition border rounded-xl ${
                      active ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedStation(s)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">⚡ {s.name}</h3>
                      <Badge className={available ? "bg-green-500" : "bg-red-500"}>
                        {s.status}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground mb-2">
                      Power: <span className="font-medium">{s.power_kw} kW</span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {s.lat.toFixed(3)}, {s.lng.toFixed(3)}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`,
                            "_blank"
                          )
                        }
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No EV stations found
            </div>
          )}
        </div>

        {/* ===== RIGHT MAP ===== */}
        <div className="lg:col-span-2 h-[450px] lg:h-full">
          <EvMap
            center={userLocation}
            stations={stations || []}
            selectedStation={selectedStation}
          />
        </div>

      </div>
    </Layout>
  );
}
