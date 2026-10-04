import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRegions } from '../../services/regionService';
import { getDrainages } from '../../services/masterDataService';
import { io } from 'socket.io-client';

const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const RegionMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [drainages, setDrainages] = useState([]);

  useEffect(() => {
    // Fetch regions from API
    getRegions()
      .then(res => {
        if (res && res.success) {
          setGeoData(res.data);
        }
      })
      .catch(err => console.error("Error fetching regions:", err));

    // Fetch drainages from API
    getDrainages()
      .then(res => {
        if (res && res.success) {
          setDrainages(res.data);
        }
      })
      .catch(err => console.error("Error fetching drainages:", err));

    // Listen for realtime updates
    const socketUrl = import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000");
    const socket = io(socketUrl, { transports: ['websocket'] });

    socket.on("new_report", (data) => {
      setDrainages(prev => prev.map(d => 
        d.id === data.drainageId 
          ? { ...d, current_pin_color: data.pinColor || "#DC3545", current_condition_status: data.statusResult }
          : d
      ));
    });

    return () => socket.disconnect();
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
      fillColor: feature.properties.risk_color || '#3b82f6',
      weight: 2,
      opacity: 1,
      color: feature.properties.risk_color || '#94a3b8',
      dashArray: '3',
      fillOpacity: 0.15
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
        zoom={13} 
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
        {drainages.map((d) => (
          <Marker
            key={`${d.id}-${d.current_pin_color}`}
            position={[d.latitude, d.longitude]}
            icon={createCustomIcon(d.current_pin_color || "#6C757D")}
          >
            <Popup>
              <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
                <b style={{ color: '#1f2937', display: 'block', marginBottom: '4px' }}>{d.name}</b>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '2px 8px', 
                  borderRadius: '9999px', 
                  color: 'white', 
                  display: 'inline-block', 
                  backgroundColor: d.current_condition_status === 'Danger' ? '#DC3545' : d.current_condition_status === 'Warning' ? '#FFC107' : '#28A745' 
                }}>
                  Status: {d.current_condition_status || 'Clear'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RegionMap;