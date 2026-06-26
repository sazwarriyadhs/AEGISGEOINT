// D:\AegisGeoInt\frontend\src\pages\Dashboard.jsx
import React, { useState } from 'react';
import useDroneData from '../hooks/useDroneData';
import SituationalOverview from '../components/CommandCenter/SituationalOverview';
import DroneStatusCard from '../components/CommandCenter/DroneStatusCard';
import WeatherPanel from '../components/CommandCenter/WeatherPanel';
import LiveDroneFeed from '../components/CommandCenter/LiveDroneFeed';
import EventsAlerts from '../components/CommandCenter/EventsAlerts';
import AegisMap from "../components/CommandCenter/AegisMap";
import logoUrl from '/logo.png';

const Dashboard = () => {
  const { drones, events, stats } = useDroneData();
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [showMap, setShowMap] = useState(true);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <img 
            src={logoUrl} 
            alt="AegisGEOINT" 
            className="header-logo"
            style={{ 
              height: '50px', 
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <h1 className="dashboard-title">Command Center</h1>
        </div>
        <div className="header-controls">
          <button 
            className={`toggle-btn ${showMap ? 'active' : ''}`}
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}
          </button>
          <button className="toggle-btn">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Row 1: Overview */}
        <div className="grid-row">
          <SituationalOverview stats={stats} />
        </div>

        {/* Row 2: MAP */}
        {showMap && (
          <div className="grid-row full-width">
            <div className="map-wrapper">
              <AegisMap />
            </div>
          </div>
        )}

        {/* Row 3: Drone Status + Weather */}
        <div className="grid-row two-col">
          <div className="col-left">
            <DroneStatusCard 
              drones={drones} 
              selectedDrone={selectedDrone}
              onSelectDrone={setSelectedDrone}
            />
          </div>
          <div className="col-right">
            <WeatherPanel />
          </div>
        </div>

        {/* Row 4: Live Feed + Events */}
        <div className="grid-row two-col">
          <div className="col-left">
            <LiveDroneFeed 
              drones={drones} 
              isLive={isLive}
              setIsLive={setIsLive}
            />
          </div>
          <div className="col-right">
            <EventsAlerts events={events} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 24px;
          background: #0a0e1a;
          min-height: 100vh;
          color: #e0e8f0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px 24px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-logo {
          height: 50px;
          width: auto;
          object-fit: contain;
        }

        .dashboard-title {
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #4fc3f7, #00bcd4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .header-controls {
          display: flex;
          gap: 12px;
        }

        .toggle-btn {
          padding: 8px 16px;
          background: rgba(79, 195, 247, 0.15);
          border: 1px solid rgba(79, 195, 247, 0.2);
          border-radius: 8px;
          color: #4fc3f7;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          font-size: 13px;
        }

        .toggle-btn:hover {
          background: rgba(79, 195, 247, 0.25);
          transform: translateY(-1px);
        }

        .toggle-btn.active {
          background: rgba(79, 195, 247, 0.3);
          border-color: #4fc3f7;
          box-shadow: 0 0 20px rgba(79, 195, 247, 0.1);
        }

        .dashboard-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .grid-row {
          display: grid;
          gap: 20px;
        }

        .grid-row.two-col {
          grid-template-columns: 1fr 1fr;
        }

        .grid-row.full-width {
          grid-template-columns: 1fr;
        }

        .map-wrapper {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          padding: 4px;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(79, 195, 247, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 195, 247, 0.5);
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 12px;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
            padding: 12px 16px;
          }

          .header-left {
            justify-content: center;
          }

          .header-logo {
            height: 40px;
          }

          .dashboard-title {
            font-size: 18px;
          }

          .header-controls {
            justify-content: center;
            flex-wrap: wrap;
          }

          .grid-row.two-col {
            grid-template-columns: 1fr;
          }

          .map-wrapper {
            padding: 2px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header {
            flex-direction: column;
            gap: 8px;
          }

          .header-left {
            flex-direction: column;
            gap: 4px;
          }

          .header-logo {
            height: 35px;
          }

          .dashboard-title {
            font-size: 16px;
          }

          .toggle-btn {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
