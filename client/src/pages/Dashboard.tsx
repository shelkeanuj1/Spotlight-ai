import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ParkingMap } from "@/components/Map";
import { SpotCard } from "@/components/SpotCard";
import { useParkingSearch } from "@/hooks/use-parking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { ParkingPrediction } from "@shared/schema";
import { Card } from "@/components/ui/card";

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Find Parking</h1>
            <p className="text-muted-foreground mt-1">Real-time availability and smart predictions</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Where are you going?" 
              className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Left Column: List & Insights */}
          <div className="flex flex-col gap-6 lg:h-full lg:overflow-hidden">
            
            {/* Insights Panel */}
            {parkingData?.insights && (
              <Card className="p-5 bg-gradient-to-br from-primary/5 to-transparent border-primary/10 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary fill-primary" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
                    <p className="font-medium text-foreground">{parkingData.insights.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Avg. Probability
                      </p>
                      <p className="text-xl font-bold text-green-600">{parkingData.insights.averageProbability}%</p>
                    </div>
                    <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Best Spot
                      </p>
                      <p className="text-xl font-bold text-primary">
                        #{parkingData.insights.bestSpotId}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Spots List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-xl space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))
              ) : parkingData?.spots?.length ? (
                parkingData.spots.map((spot) => (
                  <SpotCard 
                    key={spot.id} 
                    spot={spot} 
                    isSelected={selectedSpotId === spot.id}
                    onClick={() => handleSpotSelect(spot)}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>No parking spots found nearby.</p>
                  <p className="text-sm">Try searching for a different location.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="lg:col-span-2 h-[500px] lg:h-full min-h-[400px]">
            {userLocation && (
              <ParkingMap 
                center={userLocation}
                spots={parkingData?.spots || []}
                onSpotSelect={handleSpotSelect}
                selectedSpotId={selectedSpotId || undefined}
              />
            )}
            {!userLocation && (
              <div className="h-full w-full rounded-2xl bg-muted animate-pulse flex items-center justify-center">
                <span className="text-muted-foreground font-medium">Locating you...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
