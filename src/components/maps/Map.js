import React, { useEffect, useRef, useState } from "react";
import format from "date-fns/format";
import red from "@material-ui/core/colors/red";
import { makeStyles } from "@material-ui/core";
import MarkerClusterer from "@google/markerclustererplus";

const useStyles = makeStyles((theme) => ({
  infoRoot: {
    minWidth: 200,
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px 0px",
  },
  infoRowTitle: {
    fontWeight: "bold",
  },
}));

function addScript(src, onLoad) {
  const script = document.createElement("script");
  script.src = src;
  script.addEventListener("load", onLoad);
  window.document.body.appendChild(script);
}

export default function Map({
  zoom = 10,
  center,
  height = 500,
  width = "100%",
  locations = [],
}) {
  const classes = useStyles();
  const mapElRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  useEffect(() => {
    addScript(
      `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`,
      () => {
        const googleMap = new window.google.maps.Map(mapElRef.current, {
          zoom,
          center,
        });
        setGoogleMap(googleMap);
      }
    );
  }, [zoom, center]);
  useEffect(() => {
    if (!googleMap) {
      return;
    }
    const markers = [];
    locations.forEach((location, index) => {
      const lat = parseFloat(location.latitude, 10);
      const lng = parseFloat(location.longitude, 10);
      const infoContent = `<div class="${
        classes.infoRoot
      }"><h3 id="firstHeading">${format(
        new Date(location.time),
        "h:mm a"
      )}</h3><div class="${classes.infoRow}"><span class="${
        classes.infoRowTitle
      }">Index</span><span>${index + 1}</span></div><div class="${
        classes.infoRow
      }"><span class="${
        classes.infoRowTitle
      }">Longitude</span><span>${lng}</span></div><div class="${
        classes.infoRow
      }"><span class="${
        classes.infoRowTitle
      }">Latitude</span><span>${lat}</span></div></div>`;
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      });
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
      });
      marker.addListener("click", function () {
        infoWindow.open(googleMap, marker);
      });
      markers.push(marker);
    });
    const markerClusterer = new MarkerClusterer(googleMap, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
    const travelPath = new window.google.maps.Polyline({
      path: markers.map((marker) => ({
        lat: marker.position.lat(),
        lng: marker.position.lng(),
      })),
      geodesic: true,
      strokeColor: red[500],
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    travelPath.setMap(googleMap);
    return () => {
      markerClusterer.setMap(null);
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      travelPath.setMap(null);
    };
  }, [
    locations,
    googleMap,
    classes.infoRow,
    classes.infoRowTitle,
    classes.infoRoot,
  ]);
  return <div id="google-map" ref={mapElRef} style={{ height, width }} />;
}
