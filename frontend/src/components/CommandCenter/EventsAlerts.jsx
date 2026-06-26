// D:\AegisGeoInt\frontend\src\components\CommandCenter\EventsAlerts.jsx
import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Bell, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const EventsAlerts = ({ events = [] }) => {
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState('all');

  const getEventIcon = (type) => {
    switch(type) {
      case 'critical': return <AlertTriangle size={16} className="text-red" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow" />;
      case 'success': return <CheckCircle size={16} className="text-green" />;
      default: return <Bell size={16} className="text-blue" />;
    }
  };

  const getEventClass = (type) => {
    switch(type) {
      case 'critical': return 'event-critical';
      case 'warning': return 'event-warning';
      case 'success': return 'event-success';
      default: return 'event-info';
    }
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  return (
    <div className="events-alerts">
      <div className="card-header">
        <h3 className="card-title">
          <Bell size={18} />
          EVENTS & ALERTS
        </h3>
        <div className="card-controls">
          <select 
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      <div className="events-list">
        {filteredEvents.map((event, index) => (
          <div 
            key={index}
            className={`event-item ${getEventClass(event.type)}`}
          >
            <div className="event-header">
              <div className="event-time">
                <Clock size={14} />
                <span>{event.time}</span>
              </div>
              <div className="event-type">
                {getEventIcon(event.type)}
                <span>{event.type?.toUpperCase()}</span>
              </div>
            </div>

            <div className="event-content">
              <div className="event-title">{event.title}</div>
              <div className="event-location">
                <MapPin size={14} />
                <span>Area: {event.area}</span>
              </div>
            </div>

            <button 
              className="event-toggle"
              onClick={() => setExpanded({...expanded, [index]: !expanded[index]})}
            >
              {expanded[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expanded[index] && (
              <div className="event-details">
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span>{event.description}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Priority:</span>
                  <span className={`priority-${event.priority || 'medium'}`}>
                    {event.priority || 'Medium'}
                  </span>
                </div>
                <button className="resolve-btn">Mark as Resolved</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card-footer">
        <span className="footer-info">
          Showing {filteredEvents.length} events
        </span>
        <button className="view-all-btn">View All →</button>
      </div>

      <style jsx>{`
        .events-alerts {
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

        .filter-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #e0e8f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .events-list {
          padding: 12px 20px;
          max-height: 300px;
          overflow-y: auto;
        }

        .events-list::-webkit-scrollbar {
          width: 4px;
        }

        .events-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }

        .events-list::-webkit-scrollbar-thumb {
          background: rgba(79, 195, 247, 0.3);
          border-radius: 2px;
        }

        .event-item {
          padding: 10px 12px;
          border-radius: 6px;
          margin-bottom: 6px;
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .event-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .event-item.event-critical {
          border-left-color: #ef5350;
          background: rgba(239, 83, 80, 0.05);
        }

        .event-item.event-warning {
          border-left-color: #ffc107;
          background: rgba(255, 193, 7, 0.05);
        }

        .event-item.event-success {
          border-left-color: #4caf50;
          background: rgba(76, 175, 80, 0.05);
        }

        .event-item.event-info {
          border-left-color: #4fc3f7;
          background: rgba(79, 195, 247, 0.05);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .event-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #8899aa;
        }

        .event-type {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .text-red { color: #ef5350; }
        .text-yellow { color: #ffc107; }
        .text-green { color: #4caf50; }
        .text-blue { color: #4fc3f7; }

        .event-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .event-title {
          font-size: 14px;
          font-weight: 500;
          color: #e0e8f0;
        }

        .event-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #8899aa;
        }

        .event-toggle {
          margin-top: 4px;
          background: none;
          border: none;
          color: #8899aa;
          cursor: pointer;
          padding: 2px;
        }

        .event-details {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .detail-row {
          display: flex;
          gap: 8px;
          font-size: 12px;
          padding: 2px 0;
        }

        .detail-row .detail-label {
          color: #8899aa;
          min-width: 80px;
        }

        .priority-high {
          color: #ef5350;
          font-weight: 600;
        }

        .priority-medium {
          color: #ffc107;
          font-weight: 600;
        }

        .priority-low {
          color: #4caf50;
          font-weight: 600;
        }

        .resolve-btn {
          margin-top: 8px;
          padding: 4px 12px;
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #4caf50;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .resolve-btn:hover {
          background: rgba(76, 175, 80, 0.3);
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
      `}</style>
    </div>
  );
};

export default EventsAlerts;