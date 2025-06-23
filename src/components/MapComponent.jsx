import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

// Barrackpore Police Station
const center = {
  lat: 22.6708,
  lng: 88.3789,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
};

const MapComponent = ({ selectedCriminal, criminals = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC7BsqYETAovxlED4k57RZ7bUSWHF0E0As",
  });

  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  // Pan to selected criminal
  useEffect(() => {
    if (selectedCriminal && map) {
      map.panTo({
        lat: parseFloat(selectedCriminal.location?.coordinates[1]),
        lng: parseFloat(selectedCriminal.location?.coordinates[0]),
      });
      map.setZoom(15);
      setActiveMarker(selectedCriminal);
    }
  }, [selectedCriminal, map]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={(map) => setMap(map)}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {/* Police Station Marker */}
      <Marker
        position={center}
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", 
        }}
        title="Barrackpore Police Station"
      />

      {/* All Criminal Markers */}
      {criminals.map((criminal) => (
        <Marker
          key={criminal._id}
          position={{
            lat: parseFloat(criminal.location?.coordinates[1]),
            lng: parseFloat(criminal.location?.coordinates[0]),
          }}
          onClick={() => setActiveMarker(criminal)}
        >
          {activeMarker?._id === criminal._id && (
            <InfoWindow
              onCloseClick={() => setActiveMarker(null)}
              position={{
                lat: parseFloat(criminal.location?.coordinates[1]),
                lng: parseFloat(criminal.location?.coordinates[0]),
              }}
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
      ))}
    </GoogleMap>
  ) : (
    <div>Loading map...</div>
  );
};

export default MapComponent;