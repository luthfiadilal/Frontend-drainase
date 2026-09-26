import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axiosInstance from '../../api/axiosInstance';

const RegionMap = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch regions from API
    axiosInstance.get('/regions')
      .then(res => {
        if (res.data.success) {
          setGeoData(res.data.data);
        }
      })
      .catch(err => console.error("Error fetching regions:", err));
  }, []);

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`<b>${feature.properties.name}</b>`);
    }
  };

  // Center near Purwakarta/Bungursari based on typical coordinates
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner relative z-0">
      <MapContainer 
        center={[-6.5387, 107.4463]} 
        zoom={12} 
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
            style={{
              color: '#3b82f6',
              weight: 2,
              opacity: 0.8,
              fillColor: '#60a5fa',
              fillOpacity: 0.2
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RegionMap;