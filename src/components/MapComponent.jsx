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

// Barrackpore coordinates
const center = {
  lat: 22.6708,
  lng: 88.3789,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
};

const MapComponent = ({ selectedCriminal }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC7BsqYETAovxlED4k57RZ7bUSWHF0E0As", // Replace with your key
  });

  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = React.useState(null);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (selectedCriminal && map) {
      map.panTo({
        lat: parseFloat(selectedCriminal.latitude),
        lng: parseFloat(selectedCriminal.longitude),
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
      {/* Selected Criminal Marker */}
      {selectedCriminal && (
        <Marker
          position={{
            lat: parseFloat(selectedCriminal.latitude),
            lng: parseFloat(selectedCriminal.longitude),
          }}
          onClick={() => setActiveMarker(selectedCriminal)}
        >
          {activeMarker && (
            <InfoWindow
              onCloseClick={() => setActiveMarker(null)}
              position={{
                lat: parseFloat(selectedCriminal.latitude),
                lng: parseFloat(selectedCriminal.longitude),
              }}
            >
              <div>
                <strong>{selectedCriminal.name}</strong>
                <br />
                {selectedCriminal.crime}
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