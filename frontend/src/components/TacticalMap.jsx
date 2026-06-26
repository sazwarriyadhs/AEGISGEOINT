// D:\AegisGeoInt\frontend\src\components\TacticalMap.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  CircleMarker,
  Polygon,
  Polyline,
  Tooltip,
  ZoomControl,
  ScaleControl,
  useMap,
  LayersControl,
  LayerGroup
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // Untuk heatmap
import { 
  RefreshCw, 
  Map as MapIcon, 
  Layers, 
  Filter, 
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Target,
  Satellite,
  Grid,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// =========================
// FIX LEAFLET DEFAULT ICONS
// =========================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// =========================
// CUSTOM ICONS
// =========================
const createDroneIcon = (status) => {
  const colors = {
    active: '#4caf50',
    warning: '#ffc107',
    critical: '#ef5350',
    idle: '#8899aa'
  };
  
  return L.divIcon({
    className: 'drone-marker',
    html: `
      <div style="
        background: ${colors[status] || '#4fc3f7'};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px ${colors[status] || '#4fc3f7'}80;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.3s ease;
      ">
        ✈
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createThreatIcon = (level) => {
  const colors = {
    high: '#ef5350',
    medium: '#ffc107',
    low: '#4caf50'
  };
  
  return L.divIcon({
    className: 'threat-marker',
    html: `
      <div style="
        background: ${colors[level] || '#8899aa'};
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 15px ${colors[level] || '#8899aa'}60;
        animation: pulse 1.5s ease-in-out infinite;
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// =========================
// ANIMATION STYLES
// =========================
const animationStyles = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
  }
  
  @keyframes drone-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  .drone-marker {
    animation: drone-float 2s ease-in-out infinite;
  }
  
  .leaflet-popup-content {
    min-width: 200px;
    max-width: 300px;
  }
  
  .leaflet-popup-content-wrapper {
    background: #1a1f33;
    color: #e0e8f0;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  
  .leaflet-popup-tip {
    background: #1a1f33;
  }
`;

// =========================
// MAP CONTROLS COMPONENT
// =========================
const MapControls = ({ layers, setLayers, onFitBounds }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="map-controls-panel">
      <div className="controls-header" onClick={() => setIsExpanded(!isExpanded)}>
        <Layers size={18} />
        <span>Map Controls</span>
        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </div>
      
      {isExpanded && (
        <div className="controls-body">
          <div className="control-group">
            <label className="control-label">Base Maps</label>
            <div className="control-item">
              <input
                type="radio"
                name="basemap"
                id="osm"
                checked={layers.basemap === 'osm'}
                onChange={() => setLayers({...layers, basemap: 'osm'})}
              />
              <label htmlFor="osm">OpenStreetMap</label>
            </div>
            <div className="control-item">
              <input
                type="radio"
                name="basemap"
                id="satellite"
                checked={layers.basemap === 'satellite'}
                onChange={() => setLayers({...layers, basemap: 'satellite'})}
              />
              <label htmlFor="satellite">Satellite</label>
            </div>
            <div className="control-item">
              <input
                type="radio"
                name="basemap"
                id="dark"
                checked={layers.basemap === 'dark'}
                onChange={() => setLayers({...layers, basemap: 'dark'})}
              />
              <label htmlFor="dark">Dark Mode</label>
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Overlays</label>
            <div className="control-item">
              <input
                type="checkbox"
                id="showHeatmap"
                checked={layers.heatmap}
                onChange={() => setLayers({...layers, heatmap: !layers.heatmap})}
              />
              <label htmlFor="showHeatmap">Heatmap</label>
            </div>
            <div className="control-item">
              <input
                type="checkbox"
                id="showGeofence"
                checked={layers.geofence}
                onChange={() => setLayers({...layers, geofence: !layers.geofence})}
              />
              <label htmlFor="showGeofence">Geofence</label>
            </div>
            <div className="control-item">
              <input
                type="checkbox"
                id="showGrid"
                checked={layers.grid}
                onChange={() => setLayers({...layers, grid: !layers.grid})}
              />
              <label htmlFor="showGrid">Grid</label>
            </div>
            <div className="control-item">
              <input
                type="checkbox"
                id="showLabels"
                checked={layers.labels}
                onChange={() => setLayers({...layers, labels: !layers.labels})}
              />
              <label htmlFor="showLabels">Labels</label>
            </div>
          </div>
          
          <div className="control-group">
            <button className="fit-bounds-btn" onClick={onFitBounds}>
              <Target size={16} />
              Fit All Objects
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .map-controls-panel {
          position: absolute;
          top: 80px;
          right: 20px;
          z-index: 1000;
          background: rgba(26, 31, 51, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          min-width: 200px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        
        .controls-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          cursor: pointer;
          color: #e0e8f0;
          font-weight: 500;
          user-select: none;
        }
        
        .controls-header svg {
          color: #4fc3f7;
        }
        
        .controls-header span {
          flex: 1;
        }
        
        .controls-body {
          padding: 0 16px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        
        .control-group {
          margin-top: 12px;
        }
        
        .control-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #8899aa;
          margin-bottom: 6px;
        }
        
        .control-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
        }
        
        .control-item input[type="radio"],
        .control-item input[type="checkbox"] {
          accent-color: #4fc3f7;
          cursor: pointer;
        }
        
        .control-item label {
          font-size: 13px;
          color: #e0e8f0;
          cursor: pointer;
        }
        
        .fit-bounds-btn {
          width: 100%;
          padding: 8px;
          background: rgba(79, 195, 247, 0.15);
          border: 1px solid rgba(79, 195, 247, 0.2);
          border-radius: 6px;
          color: #4fc3f7;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        .fit-bounds-btn:hover {
          background: rgba(79, 195, 247, 0.25);
        }
      `}</style>
    </div>
  );
};

// =========================
// LEGEND COMPONENT
// =========================
const MapLegend = ({ threats, drones }) => {
  return (
    <div className="map-legend">
      <div className="legend-title">Legend</div>
      
      <div className="legend-item">
        <span className="legend-dot threat-high"></span>
        <span>High Threat</span>
      </div>
      <div className="legend-item">
        <span className="legend-dot threat-medium"></span>
        <span>Medium Threat</span>
      </div>
      <div className="legend-item">
        <span className="legend-dot threat-low"></span>
        <span>Low Threat</span>
      </div>
      <div className="legend-item">
        <span className="legend-dot drone-active"></span>
        <span>Active Drone</span>
      </div>
      <div className="legend-item">
        <span className="legend-dot drone-warning"></span>
        <span>Warning Drone</span>
      </div>
      <div className="legend-item">
        <span className="legend-dot geofence"></span>
        <span>Geofence Zone</span>
      </div>
      
      <style jsx>{`
        .map-legend {
          position: absolute;
          bottom: 30px;
          left: 20px;
          z-index: 1000;
          background: rgba(26, 31, 51, 0.95);
          backdrop-filter: blur(10px);
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          min-width: 140px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        
        .legend-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #8899aa;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 3px 0;
          font-size: 12px;
          color: #e0e8f0;
        }
        
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .legend-dot.threat-high { background: #ef5350; }
        .legend-dot.threat-medium { background: #ffc107; }
        .legend-dot.threat-low { background: #4caf50; }
        .legend-dot.drone-active { background: #4caf50; }
        .legend-dot.drone-warning { background: #ffc107; }
        .legend-dot.geofence { 
          background: transparent;
          border: 2px solid #ef5350;
          border-style: dashed;
        }
      `}</style>
    </div>
  );
};

// =========================
// GRID LAYER COMPONENT
// =========================
const GridLayer = () => {
  const map = useMap();
  
  useEffect(() => {
    const grid = L.gridLayer({
      opacity: 0.1,
      color: '#4fc3f7',
      weight: 1,
      interactive: false
    });
    
    grid.addTo(map);
    
    return () => {
      grid.remove();
    };
  }, [map]);
  
  return null;
};

// =========================
// MAIN TACTICAL MAP COMPONENT
// =========================
export default function TacticalMap() {
  const [objects, setObjects] = useState([]);
  const [drones, setDrones] = useState([]);
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [layers, setLayers] = useState({
    basemap: 'dark',
    heatmap: false,
    geofence: true,
    grid: false,
    labels: true
  });
  const [objectFilter, setObjectFilter] = useState('all');
  const [heatmapData, setHeatmapData] = useState([]);
  const mapRef = useRef(null);
  const wsRef = useRef(null);
  const heatmapLayerRef = useRef(null);

  // =========================
  // FETCH DATA FROM BACKEND
  // =========================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch telemetry data
      const telemetryRes = await fetch('http://localhost:5000/api/telemetry');
      if (!telemetryRes.ok) throw new Error('Failed to fetch telemetry');
      const telemetryData = await telemetryRes.json();

      // Parse telemetry
      const parsedObjects = telemetryData.map((item) => {
        let coords = [0, 0];
        let geometry = null;

        try {
          if (item.geometry) {
            geometry = typeof item.geometry === 'string' 
              ? JSON.parse(item.geometry) 
              : item.geometry;
            
            if (geometry.type === 'Point') {
              coords = [geometry.coordinates[1], geometry.coordinates[0]];
            } else if (geometry.type === 'LineString') {
              coords = geometry.coordinates.map(c => [c[1], c[0]]);
            } else if (geometry.type === 'Polygon') {
              coords = geometry.coordinates[0].map(c => [c[1], c[0]]);
            }
          }
        } catch (e) {
          console.warn('Error parsing geometry:', e);
        }

        const threatLevel = item.threat_level || item.threat || 'low';
        const threatScore = { high: 3, medium: 2, low: 1 }[threatLevel] || 1;

        return {
          id: item.object_id || item.id || `obj-${Math.random()}`,
          position: coords,
          threat: threatLevel,
          threatScore: threatScore,
          type: item.object_type || item.type || 'Unknown',
          name: item.name || item.id || 'Object',
          status: item.status || 'active',
          geometry: geometry,
          speed: item.speed || Math.floor(Math.random() * 50),
          altitude: item.altitude || Math.floor(Math.random() * 1000),
          heading: item.heading || Math.floor(Math.random() * 360),
          timestamp: item.timestamp || new Date().toISOString()
        };
      });

      setObjects(parsedObjects);

      // Extract drones
      const droneData = parsedObjects.filter(obj => 
        obj.type.toLowerCase().includes('drone') || 
        obj.type.toLowerCase().includes('uav')
      );
      setDrones(droneData);

      // Generate heatmap data
      const heatPoints = parsedObjects
        .filter(obj => obj.position[0] !== 0 && obj.position[1] !== 0)
        .map(obj => [obj.position[0], obj.position[1], obj.threatScore]);
      setHeatmapData(heatPoints);

      // Fetch geofences
      try {
        const geofenceRes = await fetch('http://localhost:5000/api/geofences');
        if (geofenceRes.ok) {
          const geofenceData = await geofenceRes.json();
          setGeofences(geofenceData);
        }
      } catch (e) {
        // Geofence not critical, use sample data
        setGeofences([
          {
            id: 'gf-1',
            name: 'Restricted Zone',
            coordinates: [
              [-2.5, 139.5],
              [-2.5, 140.5],
              [-3.5, 140.5],
              [-3.5, 139.5]
            ],
            color: '#ef5350',
            type: 'restricted'
          },
          {
            id: 'gf-2',
            name: 'No-Fly Zone',
            coordinates: [
              [-4.0, 140.0],
              [-4.0, 141.0],
              [-5.0, 141.0],
              [-5.0, 140.0]
            ],
            color: '#ffc107',
            type: 'no-fly'
          }
        ]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      
      // Fallback to sample data
      setObjects(generateSampleObjects());
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // GENERATE SAMPLE DATA
  // =========================
  const generateSampleObjects = () => {
    const types = ['Drone', 'UAV', 'Vehicle', 'Personnel', 'Station'];
    const threats = ['high', 'medium', 'low'];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `obj-${String(i+1).padStart(3, '0')}`,
      position: [
        -2.5 + Math.random() * 5,
        138 + Math.random() * 5
      ],
      threat: threats[Math.floor(Math.random() * threats.length)],
      threatScore: Math.floor(Math.random() * 3) + 1,
      type: types[Math.floor(Math.random() * types.length)],
      name: `Object ${String.fromCharCode(65 + i)}`,
      status: Math.random() > 0.2 ? 'active' : 'warning',
      speed: Math.floor(Math.random() * 50),
      altitude: Math.floor(Math.random() * 1000),
      heading: Math.floor(Math.random() * 360),
      timestamp: new Date().toISOString()
    }));
  };

  // =========================
  // WEBSOCKET CONNECTION FOR REAL-TIME
  // =========================
  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:5000/ws');
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'telemetry') {
              // Update object position
              setObjects(prev => {
                const index = prev.findIndex(obj => obj.id === data.id);
                if (index >= 0) {
                  const updated = [...prev];
                  updated[index] = {
                    ...updated[index],
                    position: [data.lat, data.lng],
                    speed: data.speed,
                    altitude: data.altitude,
                    heading: data.heading,
                    timestamp: data.timestamp
                  };
                  return updated;
                }
                return prev;
              });
            }
          } catch (e) {
            console.warn('Error parsing WebSocket message:', e);
          }
        };
        
        wsRef.current.onerror = (error) => {
          console.warn('WebSocket error:', error);
        };
        
        wsRef.current.onclose = () => {
          // Reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
      } catch (e) {
        console.warn('WebSocket not available:', e);
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // =========================
  // INITIAL DATA LOAD
  // =========================
  useEffect(() => {
    fetchData();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  // =========================
  // FIT BOUNDS
  // =========================
  const fitBounds = useCallback(() => {
    if (!mapRef.current || objects.length === 0) return;
    
    const bounds = L.latLngBounds(
      objects
        .filter(obj => obj.position && obj.position[0] !== 0 && obj.position[1] !== 0)
        .map(obj => [obj.position[0], obj.position[1]])
    );
    
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [objects]);

  // =========================
  // GET MARKER ICON
  // =========================
  const getMarkerIcon = (obj) => {
    if (obj.type.toLowerCase().includes('drone') || obj.type.toLowerCase().includes('uav')) {
      const status = obj.threat === 'high' ? 'critical' : obj.threat === 'medium' ? 'warning' : 'active';
      return createDroneIcon(status);
    }
    return createThreatIcon(obj.threat);
  };

  // =========================
  // RENDER LOADING
  // =========================
  if (loading) {
    return (
      <div className="map-loading">
        <div className="loading-content">
          <RefreshCw className="spinning" size={40} />
          <h3>Loading Tactical Map...</h3>
          <p>Connecting to GEOINT server</p>
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .map-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            background: #0a0e1a;
            color: #e0e8f0;
          }
          
          .loading-content {
            text-align: center;
          }
          
          .spinning {
            animation: spin 1s linear infinite;
            color: #4fc3f7;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .loading-content h3 {
            margin: 16px 0 8px;
            font-size: 20px;
          }
          
          .loading-content p {
            color: #8899aa;
            font-size: 14px;
          }
          
          .loading-progress {
            margin-top: 20px;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .progress-bar {
            height: 4px;
            background: rgba(255,255,255,0.06);
            border-radius: 2px;
            overflow: hidden;
          }
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4fc3f7, #00bcd4);
            border-radius: 2px;
            transition: width 0.5s ease;
          }
        `}</style>
      </div>
    );
  }

  // =========================
  // RENDER ERROR
  // =========================
  if (error) {
    return (
      <div className="map-error">
        <div className="error-content">
          <AlertTriangle size={48} className="text-red" />
          <h3>Error Loading Map</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchData}>
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
        
        <style jsx>{`
          .map-error {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            background: #0a0e1a;
            color: #e0e8f0;
          }
          
          .error-content {
            text-align: center;
          }
          
          .text-red {
            color: #ef5350;
          }
          
          .error-content h3 {
            margin: 16px 0 8px;
            font-size: 20px;
          }
          
          .error-content p {
            color: #8899aa;
            font-size: 14px;
            margin-bottom: 16px;
          }
          
          .retry-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 20px;
            background: rgba(79, 195, 247, 0.15);
            border: 1px solid rgba(79, 195, 247, 0.2);
            border-radius: 6px;
            color: #4fc3f7;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .retry-btn:hover {
            background: rgba(79, 195, 247, 0.25);
          }
        `}</style>
      </div>
    );
  }

  // =========================
  // MAIN RENDER
  // =========================
  return (
    <div className="tactical-map-container">
      <style>{animationStyles}</style>
      
      {/* Map Header */}
      <div className="map-header">
        <div className="header-left">
          <h2 className="map-title">
            <MapIcon size={20} />
            🛰 Tactical GEOINT Map
          </h2>
          <div className="map-stats">
            <span className="stat">
              <Target size={14} />
              {objects.length} Objects
            </span>
            <span className="stat">
              <AlertTriangle size={14} />
              {objects.filter(o => o.threat === 'high').length} High Threats
            </span>
            <span className="stat online">
              <CheckCircle size={14} />
              Online
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="filter-group">
            <button 
              className={`filter-btn ${objectFilter === 'all' ? 'active' : ''}`}
              onClick={() => setObjectFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${objectFilter === 'drone' ? 'active' : ''}`}
              onClick={() => setObjectFilter('drone')}
            >
              Drones
            </button>
            <button 
              className={`filter-btn ${objectFilter === 'threat' ? 'active' : ''}`}
              onClick={() => setObjectFilter('threat')}
            >
              Threats
            </button>
          </div>
          
          <button className="refresh-btn" onClick={fetchData}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Map */}
      <MapContainer
        ref={mapRef}
        center={[-2.5, 139.5]}
        zoom={7}
        style={{ height: 'calc(80vh - 60px)', width: '100%' }}
        zoomControl={false}
        className="map-container"
      >
        {/* Zoom Controls */}
        <ZoomControl position="topright" />
        
        {/* Scale Control */}
        <ScaleControl position="bottomright" />
        
        {/* Base Map Layers */}
        {layers.basemap === 'osm' && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
        )}
        
        {layers.basemap === 'satellite' && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; ESRI'
          />
        )}
        
        {layers.basemap === 'dark' && (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CartoDB'
          />
        )}
        
        {/* Grid Layer */}
        {layers.grid && <GridLayer />}
        
        {/* Geofence Polygons */}
        {layers.geofence && geofences.map((gf) => (
          <Polygon
            key={gf.id}
            positions={gf.coordinates}
            color={gf.color || '#ef5350'}
            weight={2}
            opacity={0.8}
            fillColor={gf.color || '#ef5350'}
            fillOpacity={0.1}
            dashArray="10, 10"
          >
            <Popup>
              <strong>{gf.name}</strong>
              <br />
              Type: {gf.type}
            </Popup>
            <Tooltip>{gf.name}</Tooltip>
          </Polygon>
        ))}
        
        {/* Objects */}
        {objects
          .filter(obj => {
            if (objectFilter === 'drone') {
              return obj.type.toLowerCase().includes('drone') || obj.type.toLowerCase().includes('uav');
            }
            if (objectFilter === 'threat') {
              return obj.threat === 'high' || obj.threat === 'medium';
            }
            return true;
          })
          .map((obj) => {
            // Skip invalid positions
            if (!obj.position || (obj.position[0] === 0 && obj.position[1] === 0)) {
              return null;
            }
            
            return (
              <Marker
                key={obj.id}
                position={obj.position}
                icon={getMarkerIcon(obj)}
                eventHandlers={{
                  click: () => setSelectedObject(obj)
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <div className="popup-header">
                      <strong>{obj.name || obj.id}</strong>
                      <span className={`threat-badge ${obj.threat}`}>
                        {obj.threat}
                      </span>
                    </div>
                    <div className="popup-body">
                      <p><strong>Type:</strong> {obj.type}</p>
                      <p><strong>Status:</strong> {obj.status}</p>
                      <p><strong>Speed:</strong> {obj.speed} km/h</p>
                      <p><strong>Altitude:</strong> {obj.altitude} m</p>
                      <p><strong>Heading:</strong> {obj.heading}°</p>
                      <p><strong>Position:</strong> {obj.position[0].toFixed(4)}, {obj.position[1].toFixed(4)}</p>
                      <p><strong>Last Update:</strong> {new Date(obj.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="popup-actions">
                      <button className="popup-btn focus">Focus</button>
                      <button className="popup-btn track">Track</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        
        {/* Map Controls */}
        <MapControls 
          layers={layers} 
          setLayers={setLayers}
          onFitBounds={fitBounds}
        />
        
        {/* Legend */}
        <MapLegend threats={objects} drones={drones} />
        
      </MapContainer>
      
      {/* Selected Object Panel */}
      {selectedObject && (
        <div className="selected-panel">
          <div className="panel-header">
            <h4>{selectedObject.name}</h4>
            <button className="close-btn" onClick={() => setSelectedObject(null)}>
              ✕
            </button>
          </div>
          <div className="panel-body">
            <div className="info-row">
              <span>Type</span>
              <span>{selectedObject.type}</span>
            </div>
            <div className="info-row">
              <span>Threat</span>
              <span className={`threat-text ${selectedObject.threat}`}>
                {selectedObject.threat.toUpperCase()}
              </span>
            </div>
            <div className="info-row">
              <span>Speed</span>
              <span>{selectedObject.speed} km/h</span>
            </div>
            <div className="info-row">
              <span>Altitude</span>
              <span>{selectedObject.altitude} m</span>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .tactical-map-container {
          background: #0a0e1a;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          position: relative;
        }
        
        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .map-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #e0e8f0;
          margin: 0;
        }
        
        .map-stats {
          display: flex;
          gap: 16px;
        }
        
        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #8899aa;
        }
        
        .stat svg {
          color: #4fc3f7;
        }
        
        .stat.online {
          color: #4caf50;
        }
        
        .stat.online svg {
          color: #4caf50;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .filter-group {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.03);
          padding: 3px;
          border-radius: 6px;
        }
        
        .filter-btn {
          padding: 4px 12px;
          background: transparent;
          border: none;
          border-radius: 4px;
          color: #8899aa;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-btn.active {
          background: rgba(79, 195, 247, 0.15);
          color: #4fc3f7;
        }
        
        .filter-btn:hover:not(.active) {
          background: rgba(255,255,255,0.05);
          color: #e0e8f0;
        }
        
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(79, 195, 247, 0.1);
          border: 1px solid rgba(79, 195, 247, 0.2);
          border-radius: 4px;
          color: #4fc3f7;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
          background: rgba(79, 195, 247, 0.2);
        }
        
        .map-container {
          position: relative;
        }
        
        /* Popup styles */
        .popup-content {
          padding: 4px;
        }
        
        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        
        .popup-header strong {
          font-size: 14px;
          color: #e0e8f0;
        }
        
        .threat-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .threat-badge.high {
          background: rgba(239, 83, 80, 0.2);
          color: #ef5350;
        }
        
        .threat-badge.medium {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        
        .threat-badge.low {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }
        
        .popup-body p {
          margin: 4px 0;
          font-size: 12px;
          color: #e0e8f0;
        }
        
        .popup-body p strong {
          color: #8899aa;
          font-weight: 600;
        }
        
        .popup-actions {
          display: flex;
          gap: 6px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        
        .popup-btn {
          flex: 1;
          padding: 4px;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .popup-btn.focus {
          background: rgba(79, 195, 247, 0.15);
          color: #4fc3f7;
        }
        
        .popup-btn.focus:hover {
          background: rgba(79, 195, 247, 0.25);
        }
        
        .popup-btn.track {
          background: rgba(76, 175, 80, 0.15);
          color: #4caf50;
        }
        
        .popup-btn.track:hover {
          background: rgba(76, 175, 80, 0.25);
        }
        
        /* Selected Panel */
        .selected-panel {
          position: absolute;
          bottom: 80px;
          right: 20px;
          z-index: 1000;
          background: rgba(26, 31, 51, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          min-width: 200px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .panel-header h4 {
          font-size: 14px;
          font-weight: 600;
          color: #e0e8f0;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: #8899aa;
          cursor: pointer;
          font-size: 18px;
          padding: 0 4px;
        }
        
        .panel-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #e0e8f0;
        }
        
        .info-row span:first-child {
          color: #8899aa;
        }
        
        .threat-text.high {
          color: #ef5350;
          font-weight: 600;
        }
        
        .threat-text.medium {
          color: #ffc107;
          font-weight: 600;
        }
        
        .threat-text.low {
          color: #4caf50;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .map-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .header-left {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .map-stats {
            flex-wrap: wrap;
          }
          
          .header-right {
            flex-wrap: wrap;
          }
          
          .selected-panel {
            bottom: 100px;
            right: 10px;
            left: 10px;
          }
        }
      `}</style>
    </div>
  );
}