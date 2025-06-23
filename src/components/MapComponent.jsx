import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

// Styles
const containerStyle = {
  width: "100%",
  height: "500px",
};

// Default Barrackpore Police Station location
const center = {
  lat: 22.6708,
  lng: 88.3789,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
};

const MapComponent = ({ selectedCriminal, criminals = [] }) => {
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC7BsqYETAovxlED4k57RZ7bUSWHF0E0As", // Replace with real key
  });

  // Pan to selected criminal when clicked
  useEffect(() => {
    if (!map || !selectedCriminal) return;

    const coords = selectedCriminal.location?.coordinates;
    if (!coords || coords.length < 2) return;

    const lat = parseFloat(coords[1]);
    const lng = parseFloat(coords[0]);

    if (isNaN(lat) || isNaN(lng)) return;

    map.panTo({ lat, lng });
    map.setZoom(15);
    setActiveMarker(selectedCriminal);
  }, [selectedCriminal, map]);

  // Render all criminal markers
  const renderMarkers = () => {
    return criminals.map((criminal) => {
      const coords = criminal.location?.coordinates;
      if (!coords || coords.length < 2) return null;

      const lat = parseFloat(coords[1]);
      const lng = parseFloat(coords[0]);

      if (isNaN(lat) || isNaN(lng)) return null;

      return (
        <Marker
          key={criminal._id}
          position={{ lat, lng }}
          onClick={() => setActiveMarker(criminal)}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", 
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        >
          {activeMarker?._id === criminal._id && (
            <InfoWindow
              onCloseClick={() => setActiveMarker(null)}
              position={{ lat, lng }}
            >
              <div className="p-2">
                <strong>{criminal.name}</strong>
                <br />
                Crime Type: {criminal.crimeType}
                <br />
                Status: {criminal.status}
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    });
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={(map) => setMap(map)}
      onUnmount={() => setMap(null)}
      options={mapOptions}
    >
      {/* Render all criminal markers */}
      {renderMarkers()}

      {/* Selected Criminal Marker (Optional duplicate or same as above) */}
      {selectedCriminal && (
        <Marker
          position={{
            lat: parseFloat(selectedCriminal.location?.coordinates[1]),
            lng: parseFloat(selectedCriminal.location?.coordinates[0]),
          }}
          title={selectedCriminal.name}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", 
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          onClick={() => setActiveMarker(selectedCriminal)}
        >
          {activeMarker && (
            <InfoWindow
              onCloseClick={() => setActiveMarker(null)}
              position={{
                lat: parseFloat(selectedCriminal.location?.coordinates[1]),
                lng: parseFloat(selectedCriminal.location?.coordinates[0]),
              }}
            >
              <div className="p-2">
                <strong>{selectedCriminal.name}</strong>
                <br />
                <small>Crime: {selectedCriminal.crimeType}</small>
              </div>
            </InfoWindow>
          )}
        </Marker>
      )}
    </GoogleMap>
  ) : (
    <div>Loading map...</div>
  );
};

export default MapComponent;