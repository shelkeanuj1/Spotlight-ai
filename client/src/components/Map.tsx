import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { ParkingPrediction } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

// Fix Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const userIcon = createCustomIcon("#3b82f6"); // Blue
const highProbIcon = createCustomIcon("#22c55e"); // Green
const medProbIcon = createCustomIcon("#eab308"); // Yellow
const lowProbIcon = createCustomIcon("#ef4444"); // Red

interface MapProps {
  center: { lat: number; lng: number };
  spots: ParkingPrediction[];
  onSpotSelect: (spot: ParkingPrediction) => void;
  selectedSpotId?: number;
}

// Component to handle map movement
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 2 });
  }, [center, map]);
  return null;
}

export function ParkingMap({ center, spots, onSpotSelect, selectedSpotId }: MapProps) {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg border border-border/50 relative z-0">
      <MapContainer 
        center={center} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater center={center} />

        {/* User Location */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <div className="text-center font-medium">You are here</div>
          </Popup>
        </Marker>

        {/* Parking Spots */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.location.lat, spot.location.lng]}
            icon={
              spot.probability === "High" ? highProbIcon :
              spot.probability === "Medium" ? medProbIcon : lowProbIcon
            }
            eventHandlers={{
              click: () => onSpotSelect(spot),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-base">{spot.name}</h3>
                  <Badge 
                    variant={
                      spot.probability === "High" ? "default" : 
                      spot.probability === "Medium" ? "secondary" : "destructive"
                    }
                    className={
                      spot.probability === "High" ? "bg-green-500 hover:bg-green-600" : 
                      spot.probability === "Medium" ? "bg-yellow-500 hover:bg-yellow-600" : ""
                    }
                  >
                    {spot.probability}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mb-3">
                  <p>{spot.distance} away • {spot.walkingTime} walk</p>
                  <p>{spot.availableSpaces} spots available</p>
                  <p className="text-primary font-medium">{spot.legalStatus}</p>
                </div>
                <Button size="sm" className="w-full gap-2" onClick={() => onSpotSelect(spot)}>
                  <Navigation className="h-3 w-3" />
                  Navigate
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
