import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, MapPin, Navigation, Info, Power, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export default function EvStations() {
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  const { data: cities } = useQuery({
    queryKey: [api.parking.cities.path],
    queryFn: async () => {
      const res = await fetch(api.parking.cities.path);
      return res.json();
    }
  });

  const { data: stations, isLoading } = useQuery({
    queryKey: [api.parking.evStations.path, selectedCityId],
    queryFn: async () => {
      const res = await fetch(`${api.parking.evStations.path}?cityId=${selectedCityId}`);
      return res.json();
    },
    enabled: selectedCityId !== null
  });

  useEffect(() => {
    if (cities && cities.length > 0 && selectedCityId === null) {
      setSelectedCityId(cities[0].id);
    }
  }, [cities, selectedCityId]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
              EV <span className="text-primary">Charging</span> Stations
            </h1>
            <p className="text-muted-foreground mt-1">Locate and navigate to the nearest chargers</p>
          </div>

          <div className="flex items-center gap-2">
            {cities?.map((city: any) => (
              <Button
                key={city.id}
                variant={selectedCityId === city.id ? "default" : "outline"}
                onClick={() => setSelectedCityId(city.id)}
                className="rounded-xl"
              >
                {city.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
            ) : stations?.length > 0 ? (
              <AnimatePresence>
                {stations.map((station: any, idx: number) => (
                  <motion.div
                    key={station.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="p-5 hover:border-primary/30 transition-all group border-2 border-transparent hover:bg-primary/[0.02]">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-xl font-display group-hover:text-primary transition-colors">
                            {station.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-full px-3">
                              {station.chargerType.toUpperCase()}
                            </Badge>
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                              {station.powerRating}kW Power
                            </span>
                          </div>
                        </div>
                        <Badge 
                          className={station.available ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                        >
                          {station.available ? "Available" : "Occupied"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-muted/40 rounded-xl p-3 flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Power className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Type</span>
                          </div>
                          <span className="text-sm font-bold">{station.chargerType === 'fast' ? 'DC Fast' : 'AC Standard'}</span>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3 flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Wait Time</span>
                          </div>
                          <span className="text-sm font-bold">{station.available ? 'None' : '15-20 min'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/40">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {station.latitude}, {station.longitude}
                        </p>
                        <Button size="sm" className="rounded-xl font-bold gap-2">
                          <Navigation className="h-4 w-4" /> Navigate
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
                <p className="text-muted-foreground">No stations found in this city</p>
              </div>
            )}
          </div>

          <Card className="h-full min-h-[400px] bg-muted/20 border-border/40 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-xl">Interactive Map Preview</h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Stations are visualized on the global map with specialized power indicators.
                </p>
              </div>
              <Button variant="outline" className="rounded-xl" asChild>
                <a href="/map">Open Map View</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
