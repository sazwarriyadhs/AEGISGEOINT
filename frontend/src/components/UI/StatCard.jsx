// D:\AegisGeoInt\frontend\src\components\UI\StatCard.jsx
import React from 'react';

const StatCard = ({ icon, label, value, color, progress, trend, trendUp, badge }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <span className="stat-label">{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={`stat-trend ${trendUp ? 'up' : 'down'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      {progress !== undefined && (
        <div className="progress-bar" style={{ marginTop: '8px' }}>
          <div 
            className={`progress-fill battery-${color}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {badge && <div className="stat-badge">{badge}</div>}

      <style jsx>{`
        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 16px 20px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-2px);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .stat-card.blue .stat-icon {
          background: rgba(79, 195, 247, 0.2);
          color: #4fc3f7;
        }

        .stat-card.green .stat-icon {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }

        .stat-card.orange .stat-icon {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }

        .stat-card.red .stat-icon {
          background: rgba(239, 83, 80, 0.2);
          color: #ef5350;
        }

        .stat-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #8899aa;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #e0e8f0;
        }

        .stat-trend {
          font-size: 12px;
          margin-left: 8px;
        }

        .stat-trend.up {
          color: #4caf50;
        }

        .stat-trend.down {
          color: #ef5350;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .progress-fill.battery-blue { background: #4fc3f7; }
        .progress-fill.battery-green { background: #4caf50; }
        .progress-fill.battery-orange { background: #ffc107; }
        .progress-fill.battery-red { background: #ef5350; }

        .stat-badge {
          margin-top: 8px;
          display: flex;
          gap: 8px;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
};

export default StatCard;