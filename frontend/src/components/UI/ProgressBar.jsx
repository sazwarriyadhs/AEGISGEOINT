// D:\AegisGeoInt\frontend\src\components\UI\ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ value, color = 'battery-high' }) => {
  return (
    <div className="progress-bar">
      <div 
        className={`progress-fill ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
      <style jsx>{`
        .progress-bar {
          flex: 1;
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

        .progress-fill.battery-high { background: #4caf50; }
        .progress-fill.battery-medium { background: #ffc107; }
        .progress-fill.battery-low { background: #ff9800; }
        .progress-fill.battery-critical { background: #ef5350; }
      `}</style>
    </div>
  );
};

export default ProgressBar;