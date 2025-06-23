import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

// Styles
const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 22.6708,
  lng: 88.3789,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const MapPicker = ({ onSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC7BsqYETAovxlED4k57RZ7bUSWHF0E0As", // Replace with real key
    libraries: ["places", "maps", "marker"],
  });

  const [markerPosition, setMarkerPosition] = useState(center);

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMarkerPosition({ lat, lng });
    onSelect({ lat, lng }); // Send back to parent form
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onClick={onMapClick}
      options={options}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  ) : (
    <div>Loading map...</div>
  );
};

export default MapPicker;