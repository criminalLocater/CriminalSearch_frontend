import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
import markerIcon from "leaflet/dist/images/marker-icon.png?url";
import markerShadow from "leaflet/dist/images/marker-shadow.png?url";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = ({ selectedCriminal }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([22.6708, 88.3789], 13); // Barrackpore coordinates
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",  {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', 
      }).addTo(map);
      mapRef.current = map;
    }

    // Clear existing markers
    if (mapRef.current._layers) {
      Object.values(mapRef.current._layers).forEach((layer) => {
        if (layer instanceof L.Marker) {
          layer.removeFrom(mapRef.current);
        }
      });
    }

    // Add selected criminal's location
    if (selectedCriminal && selectedCriminal.latitude && selectedCriminal.longitude) {
      const marker = L.marker([
        selectedCriminal.latitude,
        selectedCriminal.longitude,
      ])
        .addTo(mapRef.current)
        .bindPopup(`<b>${selectedCriminal.name}</b><br>${selectedCriminal.crime}`);
      marker.openPopup();
    }

  }, [selectedCriminal]);

  return <div id="map" style={{ height: "500px" }}></div>;
};

export default MapComponent;