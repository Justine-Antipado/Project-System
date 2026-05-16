import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, CalendarCheck, TrendingUp, Maximize2, X } from 'lucide-react';
//import './dashboard.css';
//import './style.css';
import './studentDashboard.css';


// Student data would normally come from a context/store/API.
// For now we keep a local default matching the original mockup.
const STUDENT = {
  lastName: 'Santiago',
  firstName: 'Ricardo',
  idNumber: '24-1-03962',
  program: 'BSIT',
  year: '1st Year',
  totalEvents: 12,
  attendanceRate: 95,
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <div className="dashboard-view fade-in">
      {/* ── QR FULLSCREEN MODAL ── */}
      {showQRModal && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowQRModal(false)}>
              <X />
            </button>
            <h2 style={{ marginBottom: '1rem', color: 'white' }}>
              Student QR Code
            </h2>
            <img src="/qr-placeholder.png" alt="Full QR" className="qr-large" />
            <p style={{ marginTop: '1rem', fontWeight: '600' }}>{STUDENT.idNumber}</p>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="welcome-header">
        <p className="sub-text">Welcome back! 👋</p>
        <h1 className="main-title">DASHBOARD</h1>
      </header>

      {/* ── BENTO GRID ── */}
      <div className="bento-grid">
        {/* Student Information */}
        <div className="bento-card profile-info-card interactive-card accent-blue">
          <div className="card-header">
            <Info size={18} className="icon-muted" />
            <span>Student Information</span>
          </div>
          <div className="profile-details">
            <h2 className="student-name">
              {STUDENT.lastName}, <br />
              {STUDENT.firstName}
            </h2>
            <div className="detail-group">
              <label>ID Number</label>
              <p>{STUDENT.idNumber}</p>
            </div>
            <div className="detail-group">
              <label>Program</label>
              <p>{STUDENT.program}</p>
            </div>
            <div className="detail-group">
              <label>Year Level</label>
              <p>{STUDENT.year}</p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bento-card qr-card interactive-card accent-yellow">
          <div className="qr-wrapper">
            <div className="qr-container">
              <img src="/qr-placeholder.png" alt="Student QR Code" className="qr-image" />
              <div className="qr-scan-line"></div>
            </div>
          </div>
          <p className="qr-hint">Scan for Attendance</p>
          <button className="btn-action-small" onClick={() => setShowQRModal(true)}>
            <Maximize2 size={14} style={{ marginRight: '5px' }} /> View Fullscreen
          </button>
        </div>

        {/* Total Events Attended */}
        <div
          className="bento-card stats-card interactive-card accent-sky"
          
        >
          <div className="card-header">
            <CalendarCheck size={18} className="icon-blue" />
            <span>Total Events Attended</span>
          </div>
          <div className="stats-content">
            <h2 className="stats-value">{STUDENT.totalEvents}</h2>
            <p className="stats-label">Events</p>
          </div>
          <div className="card-footer-info" onClick={() => navigate('/attendanceHistory')}>Go to History →</div>
        </div>

        {/* Attendance Rating */}
        <div className="bento-card stats-card interactive-card accent-green">
          <div className="card-header">
            <TrendingUp size={18} className="icon-green" />
            <span>Attendance Rating</span>
          </div>
          <div className="stats-content">
            <h2 className="stats-value">{STUDENT.attendanceRate}%</h2>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${STUDENT.attendanceRate}%` }}
              ></div>
            </div>
            <p className="stats-label rating-excellent">— Excellent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

