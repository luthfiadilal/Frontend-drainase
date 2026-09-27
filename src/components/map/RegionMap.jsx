import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRegions } from '../../services/regionService';

const RegionMap = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch regions from API
    getRegions()
      .then(res => {
        if (res && res.success) {
          setGeoData(res.data);
        }
      })
      .catch(err => console.error("Error fetching regions:", err));
  }, []);

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <div style="text-align: center; font-family: sans-serif;">
          <b style="color: #1f2937; display: block; margin-bottom: 4px;">${feature.properties.name}</b>
          <span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 9999px; color: white; display: inline-block; background-color: ${feature.properties.risk_color || '#28A745'}">
            Status: ${feature.properties.risk_status || 'Clear'}
          </span>
        </div>
      `);
    }
  };

  const style = (feature) => {
    return {
      fillColor: feature.properties.risk_color || '#28A745',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5
    };
  };

  const coordsToLatLng = (coords) => {
    // MySQL ST_AsGeoJSON outputs [lat, lng] instead of the standard GeoJSON [lng, lat]
    // We reverse it back here so Leaflet renders it in the correct location
    return new L.LatLng(coords[0], coords[1]);
  };

  // Center near Tasikmalaya
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner relative z-0">
      <MapContainer 
        center={[-7.3274, 108.2232]} 
        zoom={11} 
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON 
            data={geoData} 
            onEachFeature={onEachFeature}
            style={style}
            coordsToLatLng={coordsToLatLng}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RegionMap;