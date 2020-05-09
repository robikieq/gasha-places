import React, { useEffect, useRef, useState } from "react";

export default function Map({
  zoom = 10,
  center,
  height = 500,
  width = "100%",
  locations = [],
}) {
  const mapElRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`;
    googleMapScript.addEventListener("load", () => {
      const googleMap = new window.google.maps.Map(mapElRef.current, {
        zoom,
        center,
      });
      setGoogleMap(googleMap);
    });
    window.document.body.appendChild(googleMapScript);
  }, [zoom, center]);
  useEffect(() => {
    if (!googleMap) {
      return;
    }
    const markers = [];
    locations.forEach((location) => {
      const lat = parseFloat(location.latitude, 10);
      const lng = parseFloat(location.longitude, 10);
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: googleMap,
      });
      markers.push(marker);
    });
    return () => {
      markers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [locations, googleMap]);
  return <div id="google-map" ref={mapElRef} style={{ height, width }} />;
}
