// MapboxMap.js
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapBoxToken } from 'utils/firebase';
import './Mapbox.scss'

mapboxgl.accessToken = mapBoxToken;

const MapboxMap = ({ setLatitude, setLongitude, onClose }) => {
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [123.88037053743659, 10.29551334740033], // Default center
        zoom: 17, // Default zoom
      });

      mapInstance.on('load', () => {
        setMap(mapInstance); // Set the map instance when it's loaded
      });

      // Clean up when unmounting
      return () => {
        if (mapInstance) {
          mapInstance.remove();
        }
      };
    };

    initializeMap();
  }, []); // Only run this effect once

  useEffect(() => {
    // Add a click event listener to the map
    if (map) {
      map.on('click', handleMapClick);
    }

    // Clean up the event listener when unmounting
    return () => {
      if (map) {
        map.off('click', handleMapClick);
      }
    };
  }, [map]);

  const handleMapClick = (e) => {
    if (map) {
      const { lng, lat } = e.lngLat;

      // Remove the active marker if it exists
      if (activeMarker) {
        activeMarker.remove();
      }

      // Create a new marker instance and add it to the map
      const newMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

      // Update the activeMarker state
      setActiveMarker(newMarker);

      // Set latitude and longitude
      setLatitude(lat);
      setLongitude(lng);
    }
  };

  return (
    <div className="map-container">
      <button className="map-close-button" onClick={onClose}>
        Close
      </button>
      <div id="map" style={{ width: '100%', height: '300px' }} />
    </div>
  );
};

export default MapboxMap;
