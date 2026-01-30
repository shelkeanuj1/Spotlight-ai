import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import "leaflet-routing-machine";

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
const evIcon = createIcon("#0ea5e9", "⚡");
const selectedIcon = createIcon("#000000", "★");

// ===== MAP MOVE =====
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);

  return null;
}

// ===== ROUTE LINE =====
function RouteLayer({ from, to }: { from: any; to: any }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      draggableWaypoints: false,
      addWaypoints: false,
      show: false,
      lineOptions: {
        styles: [{ color: "#0ea5e9", weight: 5 }],
      },
    }).addTo(map);

    return () => map.removeControl(control);
  }, [from, to, map]);

  return null;
}

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
  const navigateTo = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-xl border border-border/50">
      <MapContainer center={center} zoom={14} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater center={selectedStation || center} />

        {/* USER */}
        <Marker position={center} icon={userIcon}>
          <Popup>📍 You are here</Popup>
        </Marker>

        {/* ROUTE */}
        {selectedStation && <RouteLayer from={center} to={selectedStation} />}

        {/* EV STATIONS */}
        {stations.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={selectedStation?.id === s.id ? selectedIcon : evIcon}
          >
            <Popup>
              <div className="space-y-2">
                <h4 className="font-bold text-blue-600">⚡ {s.name}</h4>
                <p>Power: {s.power_kw} kW</p>
                <p className={s.status === "Available" ? "text-green-600" : "text-red-600"}>
                  {s.status}
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => navigateTo(s.lat, s.lng)}
                >
                  <Navigation className="h-3 w-3 mr-1" />
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
