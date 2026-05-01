import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps, isGoogleMapsLoaded, createGoogleMap, getRoute } from "@/lib/google-maps";
import { Button } from "@/components/ui/button";
import { Navigation, Loader2 } from "lucide-react";

// ===== MAIN MAP =====
export function EvMap({
  center,
  stations,
  selectedStation,
}: {
  center: { lat: number; lng: number };
  stations: any[];
  selectedStation: any;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routePath, setRoutePath] = useState<any[]>([]);

  useEffect(() => {
    async function initMap() {
      try {
        await loadGoogleMaps();
        if (isGoogleMapsLoaded() && mapRef.current) {
          mapInstanceRef.current = createGoogleMap(mapRef.current, {
            center,
            zoom: 14,
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: false,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
        setIsLoading(false);
      }
    }

    initMap();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !isGoogleMapsLoaded()) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    userMarkerRef.current = new window.google.maps.Marker({
      position: center,
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

    mapInstanceRef.current.panTo(center);
  }, [center]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isGoogleMapsLoaded()) return;

    markersRef.current.forEach((marker: any) => marker.setMap(null));
    markersRef.current = [];

    stations.forEach((station: any) => {
      const marker = new window.google.maps.Marker({
        position: { lat: Number(station.lat), lng: Number(station.lng) },
        map: mapInstanceRef.current,
        title: station.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: selectedStation?.id === station.id ? "#000000" : "#0ea5e9",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding:8px; min-width:180px;">
            <h3 style="font-weight:700; margin-bottom:4px;">⚡ ${station.name}</h3>
            <p style="font-size:12px; margin:2px 0;">Power: ${station.power_kw} kW</p>
            <p style="font-size:12px; margin:2px 0;">Status: ${station.status}</p>
          </div>
        `,
      });

      marker.addListener("click", () => infoWindow.open(mapInstanceRef.current, marker));
      markersRef.current.push(marker);
    });
  }, [stations, selectedStation]);

  useEffect(() => {
    if (!selectedStation || !isGoogleMapsLoaded()) {
      setRoutePath([]);
      return;
    }

    async function drawRoute() {
      const route = await getRoute(center, {
        lat: Number(selectedStation.lat),
        lng: Number(selectedStation.lng),
      });

      if (route?.routes?.[0]?.overview_path) {
        setRoutePath(route.routes[0].overview_path);
      } else {
        setRoutePath([]);
      }
    }

    drawRoute();
  }, [selectedStation, center]);

  useEffect(() => {
    if (!mapInstanceRef.current || routePath.length === 0 || !isGoogleMapsLoaded()) return;

    const routeLine = new window.google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: "#0ea5e9",
      strokeOpacity: 0.8,
      strokeWeight: 5,
    });
    routeLine.setMap(mapInstanceRef.current);
    return () => routeLine.setMap(null);
  }, [routePath]);

  const navigateTo = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-xl border border-border/50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
      {selectedStation && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur rounded-2xl shadow-xl p-4 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">⚡ {selectedStation.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedStation.power_kw} kW • {selectedStation.status}
              </p>
            </div>
            <Button onClick={() => navigateTo(Number(selectedStation.lat), Number(selectedStation.lng))}>
              <Navigation className="h-4 w-4 mr-2" />
              Navigate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
