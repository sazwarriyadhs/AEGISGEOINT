// D:\AegisGeoInt\frontend\src\components\AegisMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AegisMap = () => {
  const [trackedObjects, setTrackedObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari GeoServer WFS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8089/geoserver/aegisgeoint/wfs',
          {
            params: {
              service: 'WFS',
              version: '1.0.0',
              request: 'GetFeature',
              typeName: 'aegisgeoint:papua_tracked_objects',
              outputFormat: 'application/json'
            }
          }
        );
        setTrackedObjects(response.data.features || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    // Refresh setiap 10 detik
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Get color based on threat level
  const getThreatColor = (level) => {
    const colors = {
      'HIGH': '#ef4444',
      'MEDIUM': '#f59e0b',
      'LOW': '#22c55e',
      'CRITICAL': '#dc2626'
    };
    return colors[level] || '#6b7280';
  };

  // Get marker size based on threat level
  const getMarkerSize = (level) => {
    const sizes = {
      'HIGH': 16,
      'MEDIUM': 13,
      'LOW': 10,
      'CRITICAL': 20
    };
    return sizes[level] || 10;
  };

  if (loading) {
    return <div className="loading">Loading map data...</div>;
  }

  return (
    <MapContainer
      center={[-2.54, 140.71]}
      zoom={11}
      style={{ height: '80vh', width: '100%' }}
    >
      {/* Base Map */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* GeoServer WMS Layers */}
      <WMSTileLayer
        url="http://localhost:8089/geoserver/aegisgeoint/wms"
        layers="aegisgeoint:papua_restricted_zones"
        format="image/png"
        transparent={true}
        version="1.1.0"
        opacity={0.6}
      />

      <WMSTileLayer
        url="http://localhost:8089/geoserver/aegisgeoint/wms"
        layers="aegisgeoint:papua_sensors"
        format="image/png"
        transparent={true}
        version="1.1.0"
        opacity={0.8}
      />

      <WMSTileLayer
        url="http://localhost:8089/geoserver/aegisgeoint/wms"
        layers="aegisgeoint:papua_threat_events"
        format="image/png"
        transparent={true}
        version="1.1.0"
        opacity={0.9}
      />

      {/* Tracked Objects from WFS */}
      {trackedObjects.map((feature) => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        const threatLevel = props.threat_level || 'LOW';
        const color = getThreatColor(threatLevel);
        const size = getMarkerSize(threatLevel);

        return (
          <Marker
            key={props.id}
            position={[coords[1], coords[0]]}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 15px ${color}80;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                color: white;
              ">${props.object_type ? props.object_type.charAt(0) : '?'}</div>`,
              iconSize: [size, size],
              iconAnchor: [size/2, size/2]
            })}
          >
            <Popup>
              <div className="popup-content">
                <h3 style={{ color: color, margin: '0 0 8px 0' }}>
                  {props.object_id || 'Unknown'}
                </h3>
                <table style={{ fontSize: '13px', width: '100%' }}>
                  <tbody>
                    <tr><td><strong>Type:</strong></td><td>{props.object_type || 'N/A'}</td></tr>
                    <tr><td><strong>Threat:</strong></td><td style={{ color: color, fontWeight: 'bold' }}>{threatLevel}</td></tr>
                    <tr><td><strong>Speed:</strong></td><td>{props.speed || 0} km/h</td></tr>
                    <tr><td><strong>Sector:</strong></td><td>{props.sector || 'N/A'}</td></tr>
                    <tr><td><strong>Confidence:</strong></td><td>{props.confidence_score ? (props.confidence_score * 100).toFixed(0) + '%' : 'N/A'}</td></tr>
                    <tr><td><strong>Border Distance:</strong></td><td>{props.border_distance || 0} km</td></tr>
                  </tbody>
                </table>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default AegisMap;