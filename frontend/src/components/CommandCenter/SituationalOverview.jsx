// D:\AegisGeoInt\frontend\src\components\CommandCenter\SituationalOverview.jsx
import React from 'react';
import { Drone, Target, Calendar, Bell, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import StatCard from '../UI/StatCard';

const SituationalOverview = ({ stats }) => {
  const { 
    totalDrones = 20, 
    activeDrones = 12, 
    totalMissions = 15, 
    activeMissions = 8, 
    events = 23, 
    alerts = 7,
    criticalAlerts = 2,
    highAlerts = 5
  } = stats;

  return (
    <div className="situational-overview">
      <div className="section-header">
        <h2 className="section-title">
          <Activity size={20} />
          SITUATIONAL OVERVIEW
        </h2>
        <div className="section-actions">
          <button className="refresh-btn">
            <Activity size={16} className="spinning" />
            Auto-refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          icon={<Drone size={24} />}
          label="DRONES ACTIVE"
          value={`${activeDrones} / ${totalDrones}`}
          color="blue"
          progress={(activeDrones / totalDrones) * 100}
        />
        
        <StatCard 
          icon={<Target size={24} />}
          label="MISSIONS ACTIVE"
          value={`${activeMissions} / ${totalMissions}`}
          color="green"
          progress={(activeMissions / totalMissions) * 100}
        />
        
        <StatCard 
          icon={<Calendar size={24} />}
          label="EVENTS TODAY"
          value={events}
          color="orange"
          trend="+12%"
          trendUp={true}
        />
        
        <StatCard 
          icon={<Bell size={24} />}
          label="ALERTS"
          value={alerts}
          color="red"
          badge={
            <>
              <span className="badge-critical">Critical: {criticalAlerts}</span>
              <span className="badge-high">High: {highAlerts}</span>
            </>
          }
        />
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <CheckCircle size={16} className="text-green" />
          <span>System Status: <strong>Operational</strong></span>
        </div>
        <div className="quick-stat">
          <AlertTriangle size={16} className="text-yellow" />
          <span>Last Incident: <strong>10:21:35</strong></span>
        </div>
      </div>

      <style jsx>{`
        .situational-overview {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 600;
          color: #e0e8f0;
        }

        .section-title svg {
          color: #4fc3f7;
        }

        .section-actions {
          display: flex;
          gap: 12px;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(79, 195, 247, 0.1);
          border: 1px solid rgba(79, 195, 247, 0.2);
          color: #4fc3f7;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          background: rgba(79, 195, 247, 0.2);
        }

        .spinning {
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 20px 24px;
        }

        .quick-stats {
          display: flex;
          gap: 24px;
          padding: 12px 24px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .quick-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #8899aa;
        }

        .text-green { color: #4caf50; }
        .text-yellow { color: #ffc107; }
        .text-red { color: #ef5350; }

        .badge-critical {
          background: rgba(239, 83, 80, 0.2);
          color: #ef5350;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          margin-right: 4px;
        }

        .badge-high {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SituationalOverview;