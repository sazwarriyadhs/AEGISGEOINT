import React, { useState, useEffect } from 'react';
import { Video, Play, Pause, Wifi, Signal, Maximize2, MapPin, Activity, AlertTriangle } from 'lucide-react';

const LiveDroneFeed = ({ drones = [], isLive = true, setIsLive = () => {} }) => {
  const [activeFeed, setActiveFeed] = useState(0);
  const [feedQuality, setFeedQuality] = useState('1080p');
  const [detections, setDetections] = useState([]);

  const liveDrones = drones.filter(d => d.status === 'active' || d.status === 'warning');
  const currentDrone = liveDrones[activeFeed] || liveDrones[0] || { name: 'No Active Drone', signal: 0 };

  // Simulasi AI detections
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const types = ['Person', 'Vehicle', 'Boat', 'Drone', 'Animal'];
      const newDetection = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        confidence: (0.7 + Math.random() * 0.25).toFixed(2),
        timestamp: new Date().toLocaleTimeString()
      };
      setDetections(prev => [newDetection, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const feedStats = {
    fps: 30,
    bitrate: '5.2 Mbps',
    latency: '120ms',
    resolution: '1080p'
  };

  return (
    <div className="live-drone-feed">
      <div className="card-header">
        <div className="card-title">
          <Video size={18} />
          LIVE DRONE FEED
        </div>
        <div className="feed-controls">
          <button 
            className={`live-toggle ${isLive ? 'live' : ''}`}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause size={16} /> : <Play size={16} />}
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
          <div className="quality-selector">
            <select value={feedQuality} onChange={(e) => setFeedQuality(e.target.value)}>
              <option value="4k">4K</option>
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
            </select>
          </div>
        </div>
      </div>

      <div className="feed-container">
        <div className="feed-video">
          <div className="video-placeholder">
            <div className="video-overlay">
              <div className="drone-cam-info">
                <span className="cam-drone-name">{currentDrone.name}</span>
                <span className="cam-status">
                  <Signal size={12} />
                  {currentDrone.signal || 85}%
                </span>
              </div>
              <div className="cam-timestamp">
                {new Date().toLocaleTimeString('id-ID')}
              </div>
              <div className="cam-position">
                <MapPin size={12} />
                {currentDrone.lat?.toFixed(4) || '-2.5000'}, {currentDrone.lng?.toFixed(4) || '138.0000'}
              </div>
              
              {/* AI Detections Overlay */}
              <div className="ai-detections">
                {detections.map((det, i) => (
                  <div key={det.id} className="detection-item">
                    <span className="detection-type">{det.type}</span>
                    <span className="detection-confidence">{Math.round(det.confidence * 100)}%</span>
                  </div>
                ))}
              </div>

              <div className="cam-stats">
                <div className="stat">
                  <Wifi size={12} />
                  <span>{feedStats.bitrate}</span>
                </div>
                <div className="stat">
                  <span>{feedStats.fps} FPS</span>
                </div>
                <div className="stat">
                  <span>{feedStats.resolution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="feed-thumbnails">
          {liveDrones.map((drone, index) => (
            <button
              key={drone.id}
              className={`feed-thumbnail ${activeFeed === index ? 'active' : ''}`}
              onClick={() => setActiveFeed(index)}
            >
              <div className="thumbnail-preview">
                <Video size={16} />
              </div>
              <div className="thumbnail-info">
                <span className="thumb-drone">{drone.name}</span>
                <span className="thumb-status live">LIVE</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="feed-stats">
        <div className="stat-item">
          <span className="stat-label">FPS</span>
          <span className="stat-value">{feedStats.fps}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Bitrate</span>
          <span className="stat-value">{feedStats.bitrate}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Latency</span>
          <span className="stat-value">{feedStats.latency}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Resolution</span>
          <span className="stat-value">{feedStats.resolution}</span>
        </div>
      </div>

      <style jsx>{`
        .live-drone-feed {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #8899aa;
          text-transform: uppercase;
        }

        .card-title svg {
          color: #4fc3f7;
        }

        .feed-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .live-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(76,175,80,0.2);
          border: 1px solid rgba(76,175,80,0.3);
          border-radius: 4px;
          color: #4caf50;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .live-toggle:not(.live) {
          background: rgba(255,193,7,0.2);
          border-color: rgba(255,193,7,0.3);
          color: #ffc107;
        }

        .quality-selector select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #e0e8f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .feed-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 12px 16px;
          gap: 10px;
        }

        .feed-video {
          flex: 1;
          min-height: 180px;
          background: rgba(0,0,0,0.6);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0a0e1a, #1a1f33);
          position: relative;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .drone-cam-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cam-drone-name {
          font-size: 13px;
          font-weight: 600;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .cam-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #4caf50;
          background: rgba(0,0,0,0.5);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .cam-timestamp {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          text-align: center;
        }

        .cam-position {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .ai-detections {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detection-item {
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(79,195,247,0.3);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 11px;
          color: white;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          min-width: 80px;
        }

        .detection-type {
          color: #4fc3f7;
        }

        .detection-confidence {
          color: #22c55e;
        }

        .cam-stats {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .cam-stats .stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: rgba(255,255,255,0.6);
          background: rgba(0,0,0,0.5);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .feed-thumbnails {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 4px 0;
        }

        .feed-thumbnails::-webkit-scrollbar {
          height: 2px;
        }

        .feed-thumbnails::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 1px;
        }

        .feed-thumbnails::-webkit-scrollbar-thumb {
          background: rgba(79,195,247,0.3);
          border-radius: 1px;
        }

        .feed-thumbnail {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 80px;
        }

        .feed-thumbnail:hover {
          background: rgba(255,255,255,0.06);
        }

        .feed-thumbnail.active {
          background: rgba(79,195,247,0.15);
          border-color: #4fc3f7;
        }

        .thumbnail-preview {
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4fc3f7;
          font-size: 12px;
        }

        .thumbnail-info {
          display: flex;
          flex-direction: column;
        }

        .thumb-drone {
          font-size: 10px;
          font-weight: 500;
          color: #e0e8f0;
        }

        .thumb-status {
          font-size: 8px;
          font-weight: 600;
          color: #4caf50;
        }

        .feed-stats {
          display: flex;
          gap: 16px;
          padding: 8px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
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
          font-size: 12px;
          font-weight: 600;
          color: #e0e8f0;
        }
      `}</style>
    </div>
  );
};

export default LiveDroneFeed;
