import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
export default function RouteMap({
  routePoints,
  currentLocation,
  destination,
}) {
  if (!currentLocation) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-5 mb-5">
        Waiting for GPS...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-5">

      <MapContainer
        center={[
          currentLocation.lat,
          currentLocation.lng,
        ]}
        zoom={14}
        style={{
          height: "300px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Planned Route */}
        {routePoints?.length > 0 && (
          <Polyline
            positions={routePoints.map((p) => [
              p.lat,
              p.lng,
            ])}
          />
        )}

        {/* Current User */}
        <Marker
          position={[
            currentLocation.lat,
            currentLocation.lng,
          ]}
        >
          <Popup>Your Location</Popup>
        </Marker>

        {/* Destination */}
        {destination && (
          <Marker
            position={[
              destination.lat,
              destination.lng,
            ]}
          >
            <Popup>Destination</Popup>
          </Marker>
        )}
      </MapContainer>

    </div>
  );
}