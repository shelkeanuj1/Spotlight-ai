import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { GoogleParkingMap } from "@/components/GoogleParkingMap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useParkingSearch } from "@/hooks/use-parking";
import { ParkingPrediction } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function MapView() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState("");
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingPrediction | null>(null);

  // ✅ NEW: radius state (meters)
  const [radius, setRadius] = useState(10000); // 10km default

  // ✅ Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserLocation({ lat: 19.076, lng: 72.8777 }) // fallback Mumbai
    );
  }, []);

  // ✅ Search destination → lat/lng
  const searchDestination = async () => {
    if (!destination) return;
    try {
      const res = await fetch(
        `/api/google/geocode?address=${encodeURIComponent(destination)}`
      );
      const data = await res.json();

      if (!res.ok || !data?.location) {
        alert("Location not found");
        return;
      }

      setTargetLocation({
        lat: Number(data.location.lat),
        lng: Number(data.location.lng),
      });
      setSelectedSpot(null);
    } catch (error) {
      console.error("Failed to geocode destination:", error);
      alert("Unable to search location right now");
    }
  };

  // ✅ Determine search center (destination > user location)
  const searchCenter = targetLocation || userLocation;

  // ✅ Fetch parking spots
  const { data: parkingData, isLoading } = useParkingSearch(
    searchCenter
      ? {
          lat: searchCenter.lat,
          lng: searchCenter.lng,
          radius: radius, // ✅ dynamic radius
        }
      : null
  );

  const spots = parkingData?.spots || [];

  const handleSpotSelect = (spot: ParkingPrediction) => {
    setSelectedSpot(spot);
  };

  return (
    <Layout>
      <div className="relative h-[calc(100vh-64px)] w-full">

        {/* 🔍 SEARCH BAR */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-xl">
          <Card className="p-2 flex gap-2 shadow-xl rounded-2xl bg-background/95 backdrop-blur">
            <Search className="text-muted-foreground mt-2 ml-2" />
            <Input
              placeholder="Search destination (e.g. Pune Railway Station)..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border-none focus:ring-0 text-base"
            />
            <Button onClick={searchDestination} className="rounded-xl">
              Go
            </Button>
          </Card>

          {/* ✅ Radius Controller */}
          <div className="mt-2 bg-background/90 p-2 rounded-xl shadow text-sm">
            <span className="font-semibold">Search Radius:</span>{" "}
            {(radius / 1000).toFixed(1)} km
            <input
              type="range"
              min={1000}
              max={50000}
              step={1000}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </div>

        {/* 🗺️ MAP */}
        <div className="absolute inset-0 z-0">
          {searchCenter && (
            <GoogleParkingMap
              center={searchCenter}
              userLocation={userLocation}
              spots={spots}
              selectedSpot={selectedSpot}
              onSpotSelect={handleSpotSelect}
            />
          )}
        </div>

        {/* 📍 BOTTOM SHEET */}
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="absolute bottom-0 left-0 right-0 z-[1000]"
        >
          <div className="bg-background border-t rounded-t-3xl shadow-2xl p-4 max-h-[40vh] overflow-y-auto">

            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3" />

            <h3 className="font-bold text-lg mb-3">
              Nearby Parking Spots ({spots.length})
            </h3>

            {isLoading && <p>Loading spots...</p>}

            {spots.length > 0 ? (
              spots.map((spot) => (
                <div
                  key={spot.id}
                  className={`p-3 rounded-xl border mb-2 flex justify-between items-center cursor-pointer transition
                    ${selectedSpot?.id === spot.id ? "bg-primary/10 border-primary" : "hover:bg-muted"}
                  `}
                  onClick={() => handleSpotSelect(spot)}
                >
                  <div>
                    <p className="font-semibold">{spot.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {spot.distance} • {spot.walkingTime}
                    </p>
                  </div>

                  <Button size="sm" variant="outline">
                    Navigate
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No parking spots found near this location.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
