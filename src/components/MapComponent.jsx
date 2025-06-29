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

// 🔁 Map crimeType to icon URL
const getMarkerIcon = (crimeType) => {
  const icons = {
    thief: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png ",
    assault: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png ",
    robbery: "https://maps.google.com/mapfiles/ms/icons/green-dot.png ",
    murder: "https://maps.google.com/mapfiles/ms/icons/red-dot.png ",
    kidnapper: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png ",
    fraud: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png ",
    extortion: "https://maps.google.com/mapfiles/ms/icons/pink-dot.png ",
    default: "https://maps.google.com/mapfiles/ms/icons/grey-dot.png ",
  };

  return {
    url: icons[crimeType.toLowerCase()] || icons.default,
    scaledSize: new window.google.maps.Size(30, 30),
  };
};


const MapComponent = ({ selectedCriminal, criminals = [] }) => {
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [markers, setMarkers] = useState([]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC7BsqYETAovxlED4k57RZ7bUSWHF0E0As", // Replace with real key
    libraries: ["places", "maps", "marker"],
  });
// Load marker clusterer after map load
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Create new markers
    const newMarkers = criminals
      .filter(c => c.location?.coordinates?.length >= 2)
      .map((criminal) => {
        const lat = parseFloat(criminal.location.coordinates[1]);
        const lng = parseFloat(criminal.location.coordinates[0]);

        if (isNaN(lat) || isNaN(lng)) return null;

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          title: criminal.name,
          icon: {
            url: getMarkerIcon(criminal.crimeType),
            scaledSize: new window.google.maps.Size(30, 30),
          },
        });

        marker.addListener("click", () => {
          setActiveMarker(criminal);
        });

        return marker;
      }).filter(Boolean);

    // Initialize MarkerClusterer
    if (newMarkers.length > 0 && window.MarkerClusterer !== undefined) {
      const markerCluster = new window.MarkerClusterer({ map });
      markerCluster.addMarkers(newMarkers);
      setMarkers(markerCluster);
    }else if (newMarkers.length > 0) {
      // Fallback: Add normal markers if clusterer not available
      newMarkers.forEach((marker) => marker.setMap(map));
      setMarkers(newMarkers);
    }

    // Cleanup on unmount
    return () => {
      if (markers && markers.clearMarkers) {
        markers.clearMarkers();
      }else if (Array.isArray(markers)) {
        markers.forEach((m) => m.setMap(null));
      }
    };
  }, [map, isLoaded, criminals, markers]);

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
            url: getMarkerIcon(criminal.crimeType).url,
            scaledSize: getMarkerIcon(criminal.crimeType).scaledSize,
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
            url: getMarkerIcon(selectedCriminal.crimeType).url,
            scaledSize: getMarkerIcon(selectedCriminal.crimeType).scaledSize,
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