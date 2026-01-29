import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ParkingMap } from "@/components/Map";
import { SpotCard } from "@/components/SpotCard";
import { useParkingSearch } from "@/hooks/use-parking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Zap, TrendingUp, AlertCircle, Navigation, Info } from "lucide-react";
import { ParkingPrediction } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Mumbai if blocked/error
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
        }
      );
    } else {
      setUserLocation({ lat: 19.0760, lng: 72.8777 });
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 2) setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch parking data
  const { data: parkingData, isLoading, isError } = useParkingSearch(
    userLocation ? {
      lat: userLocation.lat,
      lng: userLocation.lng,
      query: debouncedSearch || undefined
    } : null
  );

  const handleSpotSelect = (spot: ParkingPrediction) => {
    setSelectedSpotId(spot.id);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full gap-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
              Smart <span className="text-primary">Parking</span>
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Real-time AI predictions active in your area
            </p>
          </div>
          
          <div className="relative w-full md:w-[400px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search destination, area or landmark..." 
              className="pl-12 h-14 rounded-2xl bg-card border-border/60 shadow-lg hover:border-primary/30 transition-all focus:ring-4 focus:ring-primary/10 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Left Column: List & Insights */}
          <div className="flex flex-col gap-6 lg:h-full lg:overflow-hidden order-2 lg:order-1">
            
            {/* Insights Panel */}
            <AnimatePresence mode="wait">
              {parkingData?.insights && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap className="h-16 w-16 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                      <Zap className="h-5 w-5 fill-primary" />
                      AI Prediction Summary
                    </h3>
                    <div className="space-y-4 relative z-10">
                      <div className="p-3 bg-background/40 backdrop-blur-sm rounded-xl border border-primary/10">
                        <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Info className="h-3 w-3" /> System Recommendation
                        </p>
                        <p className="font-medium text-foreground leading-snug">
                          {parkingData.insights.summary}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background/60 backdrop-blur-sm p-3 rounded-xl border border-border/50 shadow-inner">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> Prob.
                          </p>
                          <p className="text-2xl font-black text-green-600">{parkingData.insights.averageProbability}%</p>
                        </div>
                        <div className="bg-background/60 backdrop-blur-sm p-3 rounded-xl border border-border/50 shadow-inner">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Navigation className="h-3 w-3" /> Optimal
                          </p>
                          <p className="text-2xl font-black text-primary">
                            #{parkingData.insights.bestSpotId}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spots List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide custom-scrollbar">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                      </div>
                      <Skeleton className="h-8 w-20 rounded-full" />
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="h-9 w-24 rounded-xl" />
                      <Skeleton className="h-9 w-24 rounded-xl" />
                    </div>
                  </div>
                ))
              ) : parkingData?.spots?.length ? (
                <AnimatePresence>
                  {parkingData.spots.map((spot, idx) => (
                    <motion.div
                      key={spot.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <SpotCard 
                        spot={spot} 
                        isSelected={selectedSpotId === spot.id}
                        onClick={() => handleSpotSelect(spot)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-border/50 bg-muted/30"
                >
                  <MapPin className="h-14 w-14 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="font-semibold text-foreground">No spots detected</p>
                  <p className="text-sm text-muted-foreground mt-1">Adjust your search or location to scan for available parking.</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column: Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 h-[450px] lg:h-full min-h-[400px] order-1 lg:order-2"
          >
            <Card className="h-full w-full overflow-hidden border-border/40 shadow-2xl relative ring-1 ring-primary/5">
              {userLocation ? (
                <ParkingMap 
                  center={userLocation}
                  spots={parkingData?.spots || []}
                  onSpotSelect={handleSpotSelect}
                  selectedSpotId={selectedSpotId || undefined}
                />
              ) : (
                <div className="h-full w-full bg-muted/30 flex flex-col items-center justify-center gap-4">
                  <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <span className="text-muted-foreground font-semibold tracking-wide uppercase text-xs">Calibrating Location...</span>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
