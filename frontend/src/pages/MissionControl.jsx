// D:\AegisGeoInt\frontend\src\pages\MissionControl.jsx
import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Map, 
  Play, 
  Pause, 
  StopCircle,
  Plus,
  Filter,
  Calendar,
  Clock,
  Navigation,
  Users,
  CheckCircle,
  AlertTriangle,
  Activity,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download
} from 'lucide-react';

const MissionControl = () => {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Generate mission data
    const generateMissions = () => {
      const types = ['Surveillance', 'Mapping', 'Search & Rescue', 'Patrol', 'Reconnaissance'];
      const statuses = ['active', 'active', 'planned', 'completed', 'active', 'planned', 'completed', 'cancelled'];
      
      return Array.from({ length: 8 }, (_, i) => ({
        id: `MISS-${String(i+1).padStart(3, '0')}`,
        name: `${types[i % types.length]} ${String.fromCharCode(65 + i)}`,
        type: types[i % types.length],
        status: statuses[i] || 'planned',
        priority: ['High', 'Medium', 'High', 'Low', 'Medium', 'High', 'Medium', 'Low'][i],
        location: ['Jayapura', 'Nduga', 'Yahukimo', 'Pegunungan Bintang', 'Asmat', 'Mappi', 'Boven Digoel', 'Keerom'][i],
        startDate: `2025-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
        endDate: `2025-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
        progress: Math.floor(Math.random() * 100),
        dronesAssigned: Math.floor(Math.random() * 4 + 1),
        objectives: Math.floor(Math.random() * 5 + 2),
        completedObjectives: Math.floor(Math.random() * 3 + 0),
        description: `Mission ${types[i % types.length]} operation in ${['Jayapura', 'Nduga', 'Yahukimo', 'Pegunungan Bintang', 'Asmat', 'Mappi', 'Boven Digoel', 'Keerom'][i]} area`
      }));
    };

    setMissions(generateMissions());
  }, []);

  const filteredMissions = missions.filter(m => filter === 'all' || m.status === filter);

  const getStatusConfig = (status) => {
    const config = {
      active: { icon: <Activity size={14} />, color: '#4caf50', label: 'Active' },
      planned: { icon: <Calendar size={14} />, color: '#4fc3f7', label: 'Planned' },
      completed: { icon: <CheckCircle size={14} />, color: '#8899aa', label: 'Completed' },
      cancelled: { icon: <AlertTriangle size={14} />, color: '#ef5350', label: 'Cancelled' }
    };
    return config[status] || config.planned;
  };

  const getPriorityColor = (priority) => {
    const colors = { High: '#ef5350', Medium: '#ffc107', Low: '#4caf50' };
    return colors[priority] || '#8899aa';
  };

  return (
    <div className="mission-control-page">
      {/* Header */}
      <div className="mc-header">
        <div className="header-left">
          <h1 className="page-title">
            <Target size={28} />
            Mission Control
          </h1>
          <span className="mission-count">{filteredMissions.length} Missions</span>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <Plus size={18} />
            New Mission
          </button>
          <button className="btn-secondary">
            <Upload size={18} />
            Import
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mission-stats">
        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active</span>
            <span className="stat-value">{missions.filter(m => m.status === 'active').length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Calendar size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Planned</span>
            <span className="stat-value">{missions.filter(m => m.status === 'planned').length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gray">
            <CheckCircle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{missions.filter(m => m.status === 'completed').length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Cancelled</span>
            <span className="stat-value">{missions.filter(m => m.status === 'cancelled').length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mc-filters">
        <div className="filter-group">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Missions
          </button>
          <button 
            className={`filter-btn active-filter ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            <Activity size={14} />
            Active
          </button>
          <button 
            className={`filter-btn planned-filter ${filter === 'planned' ? 'active' : ''}`}
            onClick={() => setFilter('planned')}
          >
            <Calendar size={14} />
            Planned
          </button>
          <button 
            className={`filter-btn completed-filter ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <CheckCircle size={14} />
            Completed
          </button>
        </div>
      </div>

      {/* Mission List */}
      <div className="mission-list">
        {filteredMissions.map((mission) => {
          const status = getStatusConfig(mission.status);
          return (
            <div 
              key={mission.id} 
              className={`mission-item ${selectedMission === mission.id ? 'selected' : ''}`}
              onClick={() => setSelectedMission(mission.id === selectedMission ? null : mission.id)}
            >
              <div className="mission-main">
                <div className="mission-info">
                  <div className="mission-header">
                    <h3 className="mission-name">{mission.name}</h3>
                    <span 
                      className="mission-priority"
                      style={{ color: getPriorityColor(mission.priority) }}
                    >
                      {mission.priority}
                    </span>
                  </div>
                  <div className="mission-meta">
                    <span className="mission-id">{mission.id}</span>
                    <span className="mission-type">{mission.type}</span>
                    <span className="mission-location">{mission.location}</span>
                  </div>
                </div>

                <div className="mission-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${mission.progress}%`,
                        background: mission.progress > 75 ? '#4caf50' : mission.progress > 50 ? '#ffc107' : '#4fc3f7'
                      }}
                    />
                  </div>
                  <span className="progress-text">{mission.progress}%</span>
                </div>

                <div className="mission-status">
                  <span className="status-badge" style={{ 
                    background: `${status.color}20`,
                    color: status.color
                  }}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                <div className="mission-actions">
                  <button className="action-icon" title="View Details">
                    <Eye size={18} />
                  </button>
                  <button className="action-icon" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button className="action-icon danger" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {selectedMission === mission.id && (
                <div className="mission-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Description</span>
                      <span className="detail-value">{mission.description}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Start Date</span>
                      <span className="detail-value">{mission.startDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">End Date</span>
                      <span className="detail-value">{mission.endDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Drones Assigned</span>
                      <span className="detail-value">{mission.dronesAssigned}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Objectives</span>
                      <span className="detail-value">{mission.completedObjectives}/{mission.objectives}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">{status.label}</span>
                    </div>
                  </div>
                  <div className="details-actions">
                    <button className="action-btn primary">
                      <Play size={16} />
                      Start Mission
                    </button>
                    <button className="action-btn warning">
                      <Pause size={16} />
                      Pause
                    </button>
                    <button className="action-btn danger">
                      <StopCircle size={16} />
                      Abort
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .mission-control-page {
          padding: 24px;
          background: #0a0e1a;
          min-height: 100vh;
          color: #e0e8f0;
        }

        .mc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 20px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: #e0e8f0;
        }

        .page-title svg {
          color: #4fc3f7;
        }

        .mission-count {
          font-size: 14px;
          color: #8899aa;
          background: rgba(255,255,255,0.05);
          padding: 4px 12px;
          border-radius: 12px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4fc3f7, #00bcd4);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.05);
          color: #e0e8f0;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        .mission-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.green { background: rgba(76, 175, 80, 0.15); color: #4caf50; }
        .stat-icon.blue { background: rgba(79, 195, 247, 0.15); color: #4fc3f7; }
        .stat-icon.gray { background: rgba(136, 153, 170, 0.15); color: #8899aa; }
        .stat-icon.red { background: rgba(239, 83, 80, 0.15); color: #ef5350; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 12px;
          color: #8899aa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #e0e8f0;
        }

        .mc-filters {
          margin-bottom: 24px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .filter-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
          color: #8899aa;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 13px;
        }

        .filter-btn:hover {
          background: rgba(255,255,255,0.05);
          color: #e0e8f0;
        }

        .filter-btn.active {
          background: rgba(79, 195, 247, 0.15);
          border-color: #4fc3f7;
          color: #4fc3f7;
        }

        .filter-btn.active-filter.active {
          background: rgba(76, 175, 80, 0.15);
          border-color: #4caf50;
          color: #4caf50;
        }

        .filter-btn.planned-filter.active {
          background: rgba(79, 195, 247, 0.15);
          border-color: #4fc3f7;
          color: #4fc3f7;
        }

        .filter-btn.completed-filter.active {
          background: rgba(136, 153, 170, 0.15);
          border-color: #8899aa;
          color: #8899aa;
        }

        .mission-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mission-item {
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 16px 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .mission-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(79, 195, 247, 0.2);
        }

        .mission-item.selected {
          border-color: #4fc3f7;
          box-shadow: 0 0 0 2px rgba(79, 195, 247, 0.1);
        }

        .mission-main {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .mission-info {
          flex: 1;
        }

        .mission-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .mission-name {
          font-size: 16px;
          font-weight: 600;
          color: #e0e8f0;
          margin: 0;
        }

        .mission-priority {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
        }

        .mission-meta {
          display: flex;
          gap: 12px;
          font-size: 13px;
          color: #8899aa;
        }

        .mission-id {
          font-weight: 500;
        }

        .mission-type {
          padding: 0 8px;
          border-left: 1px solid rgba(255,255,255,0.06);
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .mission-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 150px;
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 14px;
          font-weight: 600;
          color: #e0e8f0;
          min-width: 40px;
          text-align: right;
        }

        .mission-status {
          min-width: 100px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .mission-actions {
          display: flex;
          gap: 4px;
        }

        .action-icon {
          background: transparent;
          border: none;
          color: #8899aa;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-icon:hover {
          background: rgba(255,255,255,0.05);
          color: #e0e8f0;
        }

        .action-icon.danger:hover {
          background: rgba(239, 83, 80, 0.1);
          color: #ef5350;
        }

        .mission-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 11px;
          color: #8899aa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 14px;
          color: #e0e8f0;
        }

        .details-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }

        .action-btn.primary:hover {
          background: rgba(76, 175, 80, 0.3);
        }

        .action-btn.warning {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }

        .action-btn.warning:hover {
          background: rgba(255, 193, 7, 0.3);
        }

        .action-btn.danger {
          background: rgba(239, 83, 80, 0.2);
          color: #ef5350;
        }

        .action-btn.danger:hover {
          background: rgba(239, 83, 80, 0.3);
        }

        @media (max-width: 768px) {
          .mc-header {
            flex-direction: column;
            gap: 12px;
          }

          .mission-stats {
            grid-template-columns: 1fr 1fr;
          }

          .mission-main {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .mission-progress {
            min-width: unset;
          }

          .mission-status {
            min-width: unset;
          }

          .mission-actions {
            justify-content: center;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MissionControl;