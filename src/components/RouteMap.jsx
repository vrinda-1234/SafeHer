import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function RouteMap({ userLocation, routePoints, destination }) {
  const [center, setCenter] = useState([28.6139, 77.209]);

  useEffect(() => {
    if (userLocation) {
      setCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-5">
      <div className="h-[420px]">
        <MapContainer center={center} zoom={15} style={{ height: "100%" }}>
          {/* MAP LAYER */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* USER MARKER */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} />
          )}

          {/* DESTINATION */}
          {destination && (
            <Marker position={[destination.lat, destination.lng]} />
          )}

          {/* ROUTE LINE */}
          {routePoints?.length > 0 && (
            <Polyline
              positions={routePoints.map((p) => [p.lat, p.lng])}
              color="blue"
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
