// D:\AegisGeoInt\frontend\src\components\CommandCenter\DroneStatusCard.jsx
import React, { useState } from 'react';
import { Drone, Battery, ArrowUp, Wifi, Signal, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import ProgressBar from '../UI/ProgressBar';

const DroneStatusCard = ({ drones, selectedDrone, onSelectDrone }) => {
  const [view, setView] = useState('grid');

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'status-green';
      case 'warning': return 'status-yellow';
      case 'critical': return 'status-red';
      default: return 'status-gray';
    }
  };

  const getBatteryColor = (level) => {
    if (level > 75) return 'battery-high';
    if (level > 50) return 'battery-medium';
    if (level > 25) return 'battery-low';
    return 'battery-critical';
  };

  return (
    <div className="drone-status-card">
      <div className="card-header">
        <h3 className="card-title">
          <Drone size={18} />
          DRONE STATUS
        </h3>
        <div className="card-controls">
          <div className="view-toggle">
            <button 
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button 
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className={`drone-list ${view}`}>
        {drones?.map((drone) => (
          <div 
            key={drone.id}
            className={`drone-item ${selectedDrone === drone.id ? 'selected' : ''}`}
            onClick={() => onSelectDrone(drone.id === selectedDrone ? null : drone.id)}
          >
            <div className="drone-header">
              <div className="drone-info">
                <span className="drone-name">
                  <Drone size={16} />
                  {drone.name}
                </span>
                <span className={`drone-status-badge ${getStatusColor(drone.status)}`}>
                  {drone.status === 'active' && <CheckCircle size={12} />}
                  {drone.status === 'warning' && <AlertCircle size={12} />}
                  {drone.status}
                </span>
              </div>
              <span className="drone-id">{drone.id}</span>
            </div>

            <div className="drone-metrics">
              <div className="metric">
                <span className="metric-label">Active</span>
                <ProgressBar value={drone.active || 85} color={getBatteryColor(drone.active || 85)} />
                <span className="metric-value">{drone.active || 85}%</span>
              </div>
              
              <div className="metric-group">
                <div className="metric-mini">
                  <Battery size={14} />
                  <span>{drone.battery || 70}%</span>
                </div>
                <div className="metric-mini">
                  <ArrowUp size={14} />
                  <span>{drone.altitude || 120}m</span>
                </div>
                <div className="metric-mini">
                  <Signal size={14} />
                  <span>{drone.signal || 85}%</span>
                </div>
                <div className="metric-mini">
                  <Wifi size={14} />
                  <span>{drone.latency || 120}ms</span>
                </div>
              </div>
            </div>

            {selectedDrone === drone.id && (
              <div className="drone-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Position</span>
                    <span className="detail-value">
                      {drone.lat?.toFixed(4) || '-2.5000'}, {drone.lng?.toFixed(4) || '138.0000'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Speed</span>
                    <span className="detail-value">{drone.speed || 25} km/h</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Mission</span>
                    <span className="detail-value">{drone.mission || 'Idle'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Flight Time</span>
                    <span className="detail-value">{drone.flightTime || '2h 15m'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card-footer">
        <span className="footer-info">
          Showing {drones?.filter(d => d.status === 'active').length || 0} active drones
        </span>
        <button className="view-all-btn">View All →</button>
      </div>

      <style jsx>{`
        .drone-status-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #8899aa;
          text-transform: uppercase;
        }

        .card-title svg {
          color: #4fc3f7;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          padding: 3px;
          border-radius: 6px;
        }

        .view-btn {
          padding: 4px 12px;
          background: transparent;
          border: none;
          color: #8899aa;
          font-size: 11px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn.active {
          background: rgba(79, 195, 247, 0.2);
          color: #4fc3f7;
        }

        .view-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
        }

        .drone-list {
          padding: 16px 20px;
          max-height: 500px;
          overflow-y: auto;
        }

        .drone-list::-webkit-scrollbar {
          width: 4px;
        }

        .drone-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }

        .drone-list::-webkit-scrollbar-thumb {
          background: rgba(79, 195, 247, 0.3);
          border-radius: 2px;
        }

        .drone-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .drone-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(79, 195, 247, 0.2);
        }

        .drone-item.selected {
          background: rgba(79, 195, 247, 0.1);
          border-color: #4fc3f7;
        }

        .drone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .drone-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .drone-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 14px;
          color: #e0e8f0;
        }

        .drone-status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .status-green { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
        .status-yellow { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
        .status-red { background: rgba(239, 83, 80, 0.2); color: #ef5350; }
        .status-gray { background: rgba(136, 153, 170, 0.2); color: #8899aa; }

        .drone-id {
          font-size: 12px;
          color: #8899aa;
          font-weight: 500;
        }

        .drone-metrics {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .metric-label {
          font-size: 11px;
          color: #8899aa;
          min-width: 45px;
        }

        .metric-value {
          font-size: 12px;
          font-weight: 600;
          color: #e0e8f0;
          min-width: 40px;
          text-align: right;
        }

        .metric-group {
          display: flex;
          gap: 16px;
        }

        .metric-mini {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #8899aa;
        }

        .metric-mini svg {
          color: #4fc3f7;
        }

        .drone-details {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 10px;
          color: #8899aa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 13px;
          font-weight: 500;
          color: #e0e8f0;
        }

        .card-footer {
          padding: 12px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-info {
          font-size: 12px;
          color: #8899aa;
        }

        .view-all-btn {
          background: transparent;
          border: none;
          color: #4fc3f7;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          color: #81d4fa;
        }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DroneStatusCard;