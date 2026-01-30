import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { ParkingPrediction } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";

// ===== ICONS =====
const createIcon = (color: string, label: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background:${color};
        width:30px;
        height:30px;
        border-radius:50%;
        border:3px solid white;
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-weight:bold;
        font-size:13px;
        box-shadow:0 6px 12px rgba(0,0,0,0.35);
      ">
        ${label}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

const userIcon = createIcon("#2563eb", "U");
const highIcon = createIcon("#22c55e", "P");
const medIcon = createIcon("#facc15", "P");
const lowIcon = createIcon("#ef4444", "P");
const selectedIcon = createIcon("#000000", "★");

// ===== TYPES =====
interface MapProps {
  center: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number } | null;
  targetLocation?: { lat: number; lng: number } | null;
  spots: ParkingPrediction[];
  selectedSpot?: ParkingPrediction | null;
  onSpotSelect: (spot: ParkingPrediction) => void;
}

// ===== MAP CAMERA UPDATE =====
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([center.lat, center.lng], 15, { duration: 1.2 });
  }, [center.lat, center.lng]);

  return null;
}

export function ParkingMap({
  center,
  userLocation,
  targetLocation,
  spots,
  selectedSpot,
  onSpotSelect,
}: MapProps) {
  // ✅ DEBUG: check spots from backend
  useEffect(() => {
    console.log("🅿️ Spots received:", spots);
  }, [spots]);

  const routePoints =
    selectedSpot && center
      ? [
          [center.lat, center.lng],
          [
            Number(selectedSpot.location.lat),
            Number(selectedSpot.location.lng),
          ],
        ]
      : [];

  const navigateTo = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-border/50 shadow-xl">
      {/* 🔥 IMPORTANT: key forces map refresh when spots change */}
      <MapContainer
        key={JSON.stringify(spots)}
        center={[center.lat, center.lng]}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapUpdater center={center} />

        {/* 👤 USER LOCATION */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>📍 You are here</Popup>
            </Marker>

            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={700}
              pathOptions={{ color: "#2563eb", fillOpacity: 0.08 }}
            />
          </>
        )}

        {/* 🎯 DESTINATION */}
        {targetLocation && (
          <Marker position={[targetLocation.lat, targetLocation.lng]}>
            <Popup>🎯 Destination</Popup>
          </Marker>
        )}

        {/* 🛣️ ROUTE LINE */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints as any}
            pathOptions={{ color: "#2563eb", weight: 5 }}
          />
        )}

        {/* 🅿️ PARKING SPOTS */}
        {spots.map((spot) => {
          const lat = Number(spot.location.lat);
          const lng = Number(spot.location.lng);

          console.log("📍 Marker:", lat, lng, spot.name); // DEBUG

          return (
            <Marker
              key={spot.id}
              position={[lat, lng]}
              icon={
                selectedSpot?.id === spot.id
                  ? selectedIcon
                  : spot.probability === "High"
                  ? highIcon
                  : spot.probability === "Medium"
                  ? medIcon
                  : lowIcon
              }
              eventHandlers={{
                click: () => onSpotSelect(spot),
              }}
            >
              <Popup>
                <div className="space-y-2 min-w-[200px]">
                  <h3 className="font-bold">{spot.name}</h3>
                  <p className="text-sm">
                    {spot.distance} • {spot.walkingTime}
                  </p>
                  <p className="text-sm">
                    🅿️ Spaces: {spot.availableSpaces}
                  </p>
                  <p className="text-sm">⭐ Score: {spot.score}</p>

                  <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => navigateTo(lat, lng)}
                  >
                    <Navigation className="h-3 w-3" />
                    Navigate
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
