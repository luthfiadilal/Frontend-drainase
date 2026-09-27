import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getRegions } from '../../services/regionService';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const LocationPickerMap = ({ onLocationSelected }) => {
  const [position, setPosition] = useState(null);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    getRegions()
      .then(res => {
        if (res && res.success) {
          setGeoData(res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const outlineStyle = {
    fillColor: 'transparent',
    weight: 2,
    opacity: 1,
    color: '#3b82f6', // blue-500
    dashArray: '3',
    fillOpacity: 0
  };

  const coordsToLatLng = (coords) => {
    return new L.LatLng(coords[0], coords[1]);
  };

  const handlePositionChange = (pos, regionId = '', regionName = '') => {
    setPosition(pos);
    if (onLocationSelected) {
      onLocationSelected(pos.lat, pos.lng, regionId, regionName);
    }
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        L.DomEvent.stopPropagation(e); // Stop click from propagating to map
        const regionId = feature.properties.id;
        const regionName = feature.properties.name;
        handlePositionChange(e.latlng, regionId, regionName);
      }
    });
  };

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-300 relative z-0">
      <MapContainer
        center={[-7.3274, 108.2232]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={outlineStyle}
            coordsToLatLng={coordsToLatLng}
            onEachFeature={onEachFeature}
          />
        )}
        <LocationMarker position={position} setPosition={handlePositionChange} />
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
