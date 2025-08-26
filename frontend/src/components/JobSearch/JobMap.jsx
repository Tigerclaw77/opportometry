import React, { useEffect, useRef } from "react";

const JobMap = ({ jobs, onMarkerClick, showMap, apiKey }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerCluster = useRef(null);

  useEffect(() => {
    if (!showMap || !jobs.length) return;

    const initMap = () => {
      if (!mapRef.current) return;

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 30.1659, lng: -95.4613 },
        zoom: 9,
        mapTypeControl: false,
        streetViewControl: false,
      });

      const bounds = new window.google.maps.LatLngBounds();
      const markers = [];

      jobs.forEach((job) => {
        if (job.latitude && job.longitude) {
          const position = { lat: job.latitude, lng: job.longitude };
          bounds.extend(position);

          const marker = new window.google.maps.Marker({
            position,
            map: mapInstance.current,
            title: job.title,
          });

          marker.addListener("click", () => onMarkerClick(job));
          markers.push(marker);
        }
      });

      if (markers.length > 0) {
        mapInstance.current.fitBounds(bounds);
      }

      if (window.MarkerClusterer && markers.length > 0) {
        markerCluster.current = new window.MarkerClusterer(
          mapInstance.current,
          markers,
          {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
          }
        );
      }
    };

    if (!window.google?.maps) {
      const existingScript = document.getElementById("googleMaps");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.id = "googleMaps";
        script.async = true;
        script.defer = true;
        script.onload = () => initMap();
        document.body.appendChild(script);
      }
    } else {
      initMap();
    }
  }, [jobs, showMap, apiKey, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      style={{
        display: showMap ? "block" : "none",
        width: "100%",
        height: "300px",
        marginBottom: "20px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    />
  );
};

export default JobMap;
