// D:\AegisGeoInt\frontend\src\components\DroneFeed.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Play, Pause, Wifi, Signal, Maximize2,
  Camera, Eye, Target, MapPin, Clock, Shield, Zap, Image
} from 'lucide-react';
import { droneFeedImages } from '../data/realEvents';

const DroneFeed = ({ drone = null, isLive = true, onToggleLive = () => {} }) => {
  const [detections, setDetections] = useState([]);
  const [recording, setRecording] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [fps, setFps] = useState(30);
  const [currentImage, setCurrentImage] = useState(droneFeedImages[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [sensorMode, setSensorMode] = useState('EO');
  const [zoomLevel, setZoomLevel] = useState('1x');
  const [stats, setStats] = useState({
    bitrate: '5.2 Mbps',
    latency: '120ms',
    resolution: '1080p'
  });
  const canvasRef = useRef(null);

  // Rotate drone feed images
  useEffect(() => {
    if (!isLive) return;

    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % droneFeedImages.length);
      setCurrentImage(droneFeedImages[imageIndex]);
    }, 8000);

    return () => clearInterval(imageInterval);
  }, [isLive, imageIndex]);

  // AI Detection simulation
  useEffect(() => {
    if (!isLive) return;

    const types = ['PERSON', 'VEHICLE', 'BOAT', 'DRONE', 'TRUCK', 'HELICOPTER'];
    const threats = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    
    const detectionInterval = setInterval(() => {
      const newDetection = {
        id: `OBJ-${Date.now()}-${Math.floor(Math.random() * 999)}`,
        type: types[Math.floor(Math.random() * types.length)],
        threat: threats[Math.floor(Math.random() * threats.length)],
        icon: ['👤', '🚗', '🚤', '🚁', '🚛', '🚁'][Math.floor(Math.random() * 6)],
        confidence: 0.6 + Math.random() * 0.38,
        bbox: {
          x: Math.floor(Math.random() * 600 + 100),
          y: Math.floor(Math.random() * 400 + 50),
          w: Math.floor(Math.random() * 80 + 40),
          h: Math.floor(Math.random() * 80 + 40)
        },
        timestamp: new Date().toLocaleTimeString(),
        tracking: true
      };
      
      setDetections(prev => {
        const newList = [newDetection, ...prev];
        return newList.slice(0, 8);
      });
    }, 3000);

    const fpsInterval = setInterval(() => {
      setFps(prev => Math.floor(28 + Math.random() * 4));
    }, 1000);

    return () => {
      clearInterval(detectionInterval);
      clearInterval(fpsInterval);
    };
  }, [isLive]);

  // Draw bounding boxes on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLive) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(det => {
      let color = '#22c55e';
      if (det.confidence > 0.85) color = '#22c55e';
      else if (det.confidence > 0.7) color = '#f59e0b';
      else color = '#ef4444';

      let borderColor = color;
      if (det.threat === 'CRITICAL') borderColor = '#ef4444';
      else if (det.threat === 'HIGH') borderColor = '#f97316';
      else if (det.threat === 'MEDIUM') borderColor = '#f59e0b';
      else borderColor = '#22c55e';

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = borderColor + '40';
      ctx.shadowBlur = 10;
      ctx.strokeRect(det.bbox.x, det.bbox.y, det.bbox.w, det.bbox.h);
      ctx.shadowBlur = 0;

      const label = `${det.icon} ${det.type} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      const metrics = ctx.measureText(label);
      const pad = 8;
      ctx.fillRect(det.bbox.x, det.bbox.y - 28, metrics.width + pad * 2, 24);

      ctx.fillStyle = borderColor;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(label, det.bbox.x + pad, det.bbox.y - 10);

      if (det.threat === 'CRITICAL' || det.threat === 'HIGH') {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('⚠ ' + det.threat, det.bbox.x + det.bbox.w - 60, det.bbox.y - 10);
      }

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '9px monospace';
      ctx.fillText(det.id, det.bbox.x, det.bbox.y + det.bbox.h + 14);
    });
  }, [detections, isLive]);

  const droneInfo = drone || {
    name: 'DRONE 01 - ALPHA',
    id: 'DRN-001',
    status: 'active',
    signal: 92,
    lat: -2.5489,
    lng: 140.7181,
    altitude: 120,
    speed: 25,
    mission: 'BORDER_PATROL'
  };

  return (
    <div className="drone-feed">
      {/* Header */}
      <div className="feed-header">
        <div className="feed-title">
          <Video size={18} />
          <span>LIVE DRONE FEED</span>
          <span className={'live-badge ' + (isLive ? 'live' : 'paused')}>
            {isLive ? '● LIVE' : '⏸ PAUSED'}
          </span>
        </div>
        <div className="feed-controls">
          <select className="sensor-select" value={sensorMode} onChange={(e) => setSensorMode(e.target.value)}>
            <option value="EO">📷 EO</option>
            <option value="IR">🌡 IR</option>
            <option value="THERMAL">🔥 THERMAL</option>
            <option value="SAR">📡 SAR</option>
          </select>
          
          <select className="sensor-select" value={zoomLevel} onChange={(e) => setZoomLevel(e.target.value)}>
            <option value="1x">1x</option>
            <option value="2x">2x</option>
            <option value="4x">4x</option>
            <option value="8x">8x</option>
            <option value="16x">16x</option>
          </select>
          
          <button className={'control-btn ' + (recording ? 'recording' : '')} onClick={() => setRecording(!recording)}>
            <Camera size={16} />
            {recording ? 'REC' : 'REC'}
          </button>
          
          <button className="control-btn" onClick={onToggleLive}>
            {isLive ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <select className="quality-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="4k">4K</option>
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
          </select>
          
          <button className="control-btn"><Maximize2 size={16} /></button>
        </div>
      </div>

      {/* Video Container */}
      <div className="video-container">
        <div className="video-wrapper">
          <canvas ref={canvasRef} className="video-canvas" width={800} height={450} />
          
          <div className="video-placeholder">
            {/* Real Image Background */}
            <img 
              src={currentImage} 
              alt="Drone Feed" 
              className="feed-background"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%231a1f33'/%3E%3Ctext x='400' y='225' font-family='Arial' font-size='24' fill='%238899aa' text-anchor='middle'%3ENo Feed Available%3C/text%3E%3C/svg%3E";
              }}
            />
            
            {/* Video Grid */}
            <div className="video-grid">
              {[...Array(12)].map((_, i) => <div key={i} className="grid-cell" />)}
            </div>
            
            {/* Sensor Mode Overlay */}
            <div className="sensor-overlay">
              <span className="sensor-badge">
                <Shield size={12} />
                {sensorMode} | ZOOM {zoomLevel} | IMAGE
              </span>
            </div>
            
            <div className="video-overlay">
              <div className="overlay-top">
                <div className="drone-info">
                  <span className="drone-name">{droneInfo.name}</span>
                  <span className="drone-id">{droneInfo.id}</span>
                </div>
                <div className="signal-info">
                  <Signal size={14} />
                  <span>{droneInfo.signal}%</span>
                  <span className="status-dot online" />
                </div>
              </div>

              <div className="overlay-center">
                <div className="crosshair">
                  <div className="crosshair-h" />
                  <div className="crosshair-v" />
                  <div className="crosshair-dot" />
                </div>
              </div>

              <div className="overlay-bottom">
                <div className="telemetry-info">
                  <div className="telemetry-item">
                    <MapPin size={12} />
                    <span>{droneInfo.lat.toFixed(4)}, {droneInfo.lng.toFixed(4)}</span>
                  </div>
                  <div className="telemetry-item">
                    <span>ALT: {droneInfo.altitude}m</span>
                  </div>
                  <div className="telemetry-item">
                    <span>SPD: {droneInfo.speed} km/h</span>
                  </div>
                  <div className="telemetry-item">
                    <span>MISSION: {droneInfo.mission}</span>
                  </div>
                </div>
                <div className="timestamp">
                  <Clock size={12} />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {/* AI Detections Overlay */}
              <div className="ai-detections-overlay">
                {detections.slice(0, 4).map((det) => {
                  const color = det.confidence > 0.85 ? '#22c55e' : det.confidence > 0.7 ? '#f59e0b' : '#ef4444';
                  const threatColor = det.threat === 'CRITICAL' ? '#ef4444' : det.threat === 'HIGH' ? '#f97316' : det.threat === 'MEDIUM' ? '#f59e0b' : '#22c55e';
                  return (
                    <div key={det.id} className="ai-detection-item" style={{ borderColor: threatColor }}>
                      <span className="detection-type">{det.icon} {det.type}</span>
                      <span className="detection-conf" style={{ color }}>{(det.confidence * 100).toFixed(0)}%</span>
                      <span className="detection-threat" style={{ color: threatColor }}>{det.threat}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Feed Stats */}
        <div className="feed-stats">
          <div className="stat-item"><span className="stat-label">FPS</span><span className="stat-value">{fps}</span></div>
          <div className="stat-item"><span className="stat-label">Bitrate</span><span className="stat-value">{stats.bitrate}</span></div>
          <div className="stat-item"><span className="stat-label">Latency</span><span className="stat-value">{stats.latency}</span></div>
          <div className="stat-item"><span className="stat-label">Resolution</span><span className="stat-value">{stats.resolution}</span></div>
          <div className="stat-item"><span className="stat-label">Detections</span><span className="stat-value">{detections.length}</span></div>
        </div>
      </div>

      {/* Detections List */}
      <div className="detections-list">
        <div className="detections-header">
          <span className="detections-title"><Eye size={14} /> AI DETECTIONS</span>
          <span className="detections-count">{detections.length} active</span>
        </div>
        <div className="detections-scroll">
          {detections.length === 0 ? (
            <div className="no-detections"><Target size={20} /><span>No objects detected</span></div>
          ) : (
            detections.map((det) => {
              const color = det.confidence > 0.85 ? '#22c55e' : det.confidence > 0.7 ? '#f59e0b' : '#ef4444';
              return (
                <div key={det.id} className="detection-row">
                  <span className="detection-index">#{detections.indexOf(det) + 1}</span>
                  <span className="detection-id">{det.id}</span>
                  <span className="detection-type-label">{det.icon} {det.type}</span>
                  <div className="detection-confidence-bar">
                    <div className="confidence-fill" style={{ width: (det.confidence * 100) + '%', background: color }} />
                  </div>
                  <span className="detection-confidence-label" style={{ color }}>{(det.confidence * 100).toFixed(0)}%</span>
                  <span className="detection-threat-badge" style={{ background: det.threat === 'CRITICAL' ? '#ef4444' : det.threat === 'HIGH' ? '#f97316' : det.threat === 'MEDIUM' ? '#f59e0b' : '#22c55e' }}>{det.threat}</span>
                  <span className="detection-time">{det.timestamp}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        .drone-feed {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background: rgba(0,0,0,0.4);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
          gap: 8px;
        }
        .feed-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #8899aa;
          text-transform: uppercase;
        }
        .feed-title svg { color: #4fc3f7; }
        .live-badge {
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
        }
        .live-badge.live { background: rgba(76,175,80,0.2); color: #4caf50; }
        .live-badge.paused { background: rgba(255,193,7,0.2); color: #ffc107; }
        .feed-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .sensor-select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          color: #e0e8f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
        }
        .sensor-select:hover { background: rgba(255,255,255,0.1); }
        .control-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          color: #e0e8f0;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }
        .control-btn:hover { background: rgba(255,255,255,0.1); }
        .control-btn.recording {
          background: rgba(239,83,80,0.2);
          border-color: rgba(239,83,80,0.3);
          color: #ef5350;
          animation: blink 1s infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .quality-select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          color: #e0e8f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
        }
        .video-container { padding: 12px 16px; }
        .video-wrapper {
          position: relative;
          background: rgba(0,0,0,0.6);
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 16/9;
        }
        .feed-background {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }
        .video-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }
        .video-placeholder {
          width: 100%;
          height: 100%;
          position: relative;
          background: linear-gradient(135deg, #0a0e1a, #1a1f33);
        }
        .video-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          opacity: 0.05;
          z-index: 1;
        }
        .grid-cell { border: 1px solid rgba(255,255,255,0.1); }
        .sensor-overlay {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          background: rgba(0,0,0,0.7);
          padding: 4px 14px;
          border-radius: 12px;
          border: 1px solid rgba(79,195,247,0.2);
        }
        .sensor-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #4fc3f7;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: none;
          z-index: 3;
        }
        .overlay-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drone-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .drone-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .drone-id {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .signal-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .status-dot.online { background: #4caf50; }
        .overlay-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .crosshair {
          position: relative;
          width: 40px;
          height: 40px;
        }
        .crosshair-h, .crosshair-v {
          position: absolute;
          background: rgba(255,255,255,0.3);
        }
        .crosshair-h {
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          transform: translateY(-50%);
        }
        .crosshair-v {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
        }
        .crosshair-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          background: #ef5350;
          border-radius: 50%;
        }
        .overlay-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .telemetry-info {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .telemetry-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .timestamp {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .ai-detections-overlay {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 4;
        }
        .ai-detection-item {
          background: rgba(0,0,0,0.8);
          border: 1px solid;
          border-radius: 4px;
          padding: 4px 10px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 11px;
          color: white;
          min-width: 100px;
          backdrop-filter: blur(4px);
        }
        .detection-type { color: #4fc3f7; font-weight: 500; }
        .detection-conf { font-weight: 600; }
        .detection-threat { font-weight: 600; font-size: 9px; }
        .feed-stats {
          display: flex;
          gap: 20px;
          padding: 8px 0 0 0;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .stat-label {
          font-size: 9px;
          color: #8899aa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          font-size: 13px;
          font-weight: 600;
          color: #e0e8f0;
        }
        .detections-list {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 8px 16px 12px;
        }
        .detections-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .detections-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #8899aa;
          text-transform: uppercase;
        }
        .detections-count { font-size: 11px; color: #8899aa; }
        .detections-scroll { max-height: 120px; overflow-y: auto; }
        .detections-scroll::-webkit-scrollbar { width: 3px; }
        .detections-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 2px; }
        .detections-scroll::-webkit-scrollbar-thumb { background: rgba(79,195,247,0.3); border-radius: 2px; }
        .no-detections {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          color: #8899aa;
          font-size: 13px;
        }
        .no-detections svg { color: #4fc3f7; }
        .detection-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          font-size: 12px;
          flex-wrap: wrap;
        }
        .detection-row:last-child { border-bottom: none; }
        .detection-index {
          color: #8899aa;
          font-size: 10px;
          min-width: 24px;
        }
        .detection-id {
          color: #4fc3f7;
          font-size: 10px;
          font-weight: 600;
          min-width: 50px;
        }
        .detection-type-label {
          font-weight: 500;
          color: #e0e8f0;
          min-width: 70px;
        }
        .detection-confidence-bar {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
          min-width: 60px;
        }
        .confidence-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }
        .detection-confidence-label {
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }
        .detection-threat-badge {
          font-size: 9px;
          font-weight: 700;
          padding: 1px 8px;
          border-radius: 8px;
          color: white;
          min-width: 50px;
          text-align: center;
        }
        .detection-time {
          font-size: 10px;
          color: #8899aa;
          min-width: 60px;
          text-align: right;
        }
        @media (max-width: 768px) {
          .feed-header { flex-direction: column; align-items: stretch; }
          .feed-controls { justify-content: center; }
          .telemetry-info { flex-wrap: wrap; gap: 8px; }
          .ai-detections-overlay { right: 8px; }
          .detection-row { font-size: 11px; }
        }
      `}</style>
    </div>
  );
};

export default DroneFeed;