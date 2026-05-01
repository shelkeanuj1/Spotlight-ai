import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps, isGoogleMapsLoaded, createGoogleMap, getRoute } from "@/lib/google-maps";
import { ParkingPrediction } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Navigation, Loader2 } from "lucide-react";

interface GoogleParkingMapProps {
  center: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number } | null;
  spots: ParkingPrediction[];
  selectedSpot?: ParkingPrediction | null;
  onSpotSelect: (spot: ParkingPrediction) => void;
}

export function GoogleParkingMap({
  center,
  userLocation,
  spots,
  selectedSpot,
  onSpotSelect,
}: GoogleParkingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routePath, setRoutePath] = useState<any[]>([]);

  // Load Google Maps on mount
  useEffect(() => {
    async function initMap() {
      try {
        await loadGoogleMaps();
        if (isGoogleMapsLoaded() && mapRef.current) {
          mapInstanceRef.current = createGoogleMap(mapRef.current, {
            center: { lat: center.lat, lng: center.lng },
            zoom: 14,
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: false,
          });

          // Add user marker
          if (userLocation) {
            userMarkerRef.current = new window.google.maps.Marker({
              position: userLocation,
              map: mapInstanceRef.current,
              title: "You are here",
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#2563eb",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
            });
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
        setIsLoading(false);
      }
    }

    initMap();
  }, []);

  // Update markers when spots change
  useEffect(() => {
    if (!mapInstanceRef.current || !isGoogleMapsLoaded()) return;

    // Clear existing markers
    markersRef.current.forEach((marker: any) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    spots.forEach((spot) => {
      const position = {
        lat: Number(spot.location.lat),
        lng: Number(spot.location.lng),
      };

      let color = "#ef4444"; // red - low
      if (spot.probability === "High") color = "#22c55e"; // green
      else if (spot.probability === "Medium") color = "#facc15"; // yellow

      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: spot.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // Info window on click
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${spot.name}</h3>
            <p style="font-size: 12px;">${spot.distance} • ${spot.walkingTime}</p>
            <p style="font-size: 12px;">Spaces: ${spot.availableSpaces}</p>
            <p style="font-size: 12px;">Score: ${spot.score}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker);
        onSpotSelect(spot);
      });

      markersRef.current.push(marker);
    });

    // Pan to center
    mapInstanceRef.current.panTo({ lat: center.lat, lng: center.lng });
  }, [spots, center]);

  // Draw route to selected spot
  useEffect(() => {
    if (!selectedSpot || !userLocation || !mapInstanceRef.current || !isGoogleMapsLoaded()) return;
    const currentUserLocation = userLocation;
    const currentSelectedSpot = selectedSpot;

    async function drawRoute() {
      const route = await getRoute(
        { lat: currentUserLocation.lat, lng: currentUserLocation.lng },
        {
          lat: Number(currentSelectedSpot.location.lat),
          lng: Number(currentSelectedSpot.location.lng),
        }
      );

      if (route && route.routes && route.routes[0]) {
        const routePath = route.routes[0].overview_path;
        setRoutePath(routePath);
      }
    }

    drawRoute();
  }, [selectedSpot, userLocation]);

  // Render route polyline
  useEffect(() => {
    if (!mapInstanceRef.current || routePath.length === 0) return;

    const routeLine = new window.google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: "#2563eb",
      strokeOpacity: 0.8,
      strokeWeight: 5,
    });

    routeLine.setMap(mapInstanceRef.current);

    return () => routeLine.setMap(null);
  }, [routePath]);

  // Navigate button handler
  const navigateTo = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}

      <div ref={mapRef} className="h-full w-full" />

      {/* Bottom spot info */}
      {selectedSpot && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur rounded-2xl shadow-xl p-4 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{selectedSpot.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedSpot.distance} • {selectedSpot.walkingTime}
              </p>
            </div>
            <Button onClick={() => navigateTo(
              Number(selectedSpot.location.lat),
              Number(selectedSpot.location.lng)
            )}>
              <Navigation className="h-4 w-4 mr-2" />
              Navigate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleParkingMap;
