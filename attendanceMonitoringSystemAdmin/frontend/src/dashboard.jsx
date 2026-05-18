import React, { useState, useRef, useEffect } from 'react';
import './dashboard.css';

export default function Dashboard() {
  // Sample static data para sa mga cards at logs
  const DEPARTMENTS = [
    { name: 'BSIT', count: 5 },
    { name: 'BEED', count: 10 },
    { name: 'BSOA', count: 4 },
  ];

  const RECENT_LOGS = [
    { id: 1, name: 'Juan Dela Cruz', dept: 'BSIT', action: 'Scanned In', time: '10:15 AM', type: 'scan' },
    { id: 2, name: 'Maria Clara', dept: 'BEED', action: 'Scanned In', time: '10:12 AM', type: 'scan' },
    { id: 3, name: 'Ricardo Dalisay', dept: 'BSOA', action: 'Registered', time: '09:45 AM', type: 'reg' },
  ];

  return (
    <>
    <div className="dashboard-view fade-in">
      
      {/* ── HEADER SECTION ── */}
      <header className="welcome-header flex-header">
        <div className="header-titles">
          <p className="sub-text">Welcome back! Ricardo 👋</p>
          <h1 className="main-title">DASHBOARD</h1>
        </div>
      </header>

      {/* ── MAIN BENTO WRAPPER ── */}
      <div className="main-bento-container">
        
        {/* ── TOP STATS GRID ── */}
        <div className="stats-cards-grid">
          
          {/* Card 1: Total Registered Students */}
          <div className="bento-card stat-card interactive-card">
            <h3 className="card-title-centered">
              Total Registered<br />Students
            </h3>
            <div className="card-body-row">
              <span className="card-icon text-blue">🎓</span>
              <div className="badge-value-box">250</div>
            </div>
          </div>

          {/* Card 2: Events Scheduled Today */}
          <div className="bento-card stat-card interactive-card">
            <h3 className="card-title-centered">
              Events Scheduled<br />Today
            </h3>
            <div className="card-body-row">
              <span className="card-icon text-yellow">📅</span>
              <div className="badge-value-box">1</div>
            </div>
          </div>

          {/* Card 3: Ongoing Attendance */}
          <div className="bento-card stat-card interactive-card">
            <h3 className="card-title-centered">
              Ongoing<br />Attendance
            </h3>
            <div className="card-body-row">
              <span className="card-icon text-sky">📋</span>
              <div className="badge-value-box">10</div>
            </div>
          </div>

          {/* Card 4: System Health */}
          <div className="bento-card stat-card interactive-card">
            <h3 className="card-title-centered">
              System<br />Health
            </h3>
            <div className="card-body-row">
              <span className="card-icon text-green">⚙️</span>
              <div className="badge-status-box connected">Connected</div>
            </div>
          </div>

        </div>

        {/* ── QUICK ACTIONS BAR ── */}
        <div className="bento-card quick-actions-card">
          <h2 className="section-mini-label">Quick Actions</h2>
          <div className="actions-btn-group">
            <button className="btn-action btn-dark">
              <span>➕ Add Student</span>
            </button>
            <button className="btn-action btn-blue">
              <span>📅 Create Event</span>
            </button>
          </div>
        </div>

        {/* ── LOWER CONTENT GRID ── */}
        <div className="lower-dashboard-grid">
          
          {/* Departmental Participation */}
          <div className="bento-card primary-content-card">
            <h2 className="card-section-title">Departmental Participation</h2>
            
            <div className="departments-inner-grid">
              {DEPARTMENTS.map((dept, index) => (
                <div key={index} className="department-badge-card">
                  <span className="dept-name">{dept.name}</span>
                  <span className="dept-avatar-icon">🎓</span>
                  <span className="dept-participant-count">
                    Total Participant: {dept.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Logs */}
          <div className="bento-card side-content-card flex-col-justify">
            <div className="logs-wrapper">
              <h2 className="card-section-title">Recent Activity</h2>
              <div className="logs-list">
                {RECENT_LOGS.map((log) => (
                  <div key={log.id} className="log-item-row">
                    <div className="log-details">
                      <p className="log-user-name">{log.name}</p>
                      <p className="log-sub-info">
                        {log.dept} • {log.time}
                      </p>
                    </div>
                    <span className={`log-badge-action ${log.type}`}>
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-footer-action">
              <span>View All Logs →</span>
            </div>
          </div>

        </div>

      </div>
    </div>
    </>
  );
}