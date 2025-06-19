import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 22.6708,
  lng: 88.3789,
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

const MapPicker = ({ coordinates, setCoordinates }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC7BsqYETAovxlED4k57RZ7bUSWHF0E0As", // Replace with your key
  });

  const [markerPosition, setMarkerPosition] = useState(
    coordinates[0] && coordinates[1]
      ? { lat: coordinates[1], lng: coordinates[0] }
      : center
  );

  const onMapClick = (event) => {
    const newCoords = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newCoords);
    setCoordinates([newCoords.lng, newCoords.lat]);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition}
      zoom={13}
      onClick={onMapClick}
      options={options}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  ) : (
    <div>Loading map...</div>
  );
};

export default MapPicker;