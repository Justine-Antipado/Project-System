import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info, CalendarCheck, TrendingUp, Maximize2, X } from "lucide-react";
import axios from "axios";
import "./studentDashboard.css";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystem/backend";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hakbang 1: Tsek kung may active session
    axios
      .get(`${API}/get_session.php`, { withCredentials: true })
      .then((res) => {
        if (res.data.authenticated) {
          // Hakbang 2: Kung authenticated, kunin ang kumpletong info at analytics
          return axios.get(`${API}/get_info.php`, { withCredentials: true });
        } else {
          navigate("/");
        }
      })
      .then((res) => {
        if (res && res.data) {
          setStudent(res.data); // Dito nakapaloob ang profile + totalEvents + attendanceRate
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard data fetch failed:", err);
        navigate("/"); // Ibalik sa login kapag may error o expired ang session
      });
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading Dashboard...
      </div>
    );
  }

  // Pag-generate ng QR gamit ang StudentQRCode column mula sa get_info.php
  const qrValue = student?.StudentQRCode || student?.SchoolIDNo || "No QR Data";
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrValue)}&size=300&margin=2`;

  const totalEvents = student?.totalEvents || 0;
  const attendanceRate = student?.attendanceRate || 0;

  return (
    <>
      <div className="dashboard-view fade-in">
        {/* ── QR FULLSCREEN MODAL ── */}
        {showQRModal && (
          <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
            <div
              className="modal-content fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setShowQRModal(false)}
              >
                <X />
              </button>
              <h2 style={{ marginBottom: "1rem", color: "white" }}>
                Student QR Code
              </h2>
              <img
                src={qrCodeUrl}
                alt="Full QR"
                className="qr-large"
                style={{
                  background: "white",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              />
              <p style={{ marginTop: "1rem", fontWeight: "600" }}>
                {student?.StudentQRCode}
              </p>
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
          {/* Student Information Card */}
          <div className="bento-card profile-info-card interactive-card accent-blue">
            <div className="card-header">
              <Info size={18} className="icon-muted" />
              <span>Student Information</span>
            </div>
            <div className="profile-details">
              <h2 className="student-name">
                {student?.LastName}, <br />
                {student?.FirstName}
              </h2>
              <div className="detail-group">
                <label>ID Number</label>
                <p>{student?.SchoolIDNo}</p>
              </div>
              <div className="detail-group">
                <label>Program</label>
                <p>{student?.Program}</p>
              </div>
              <div className="detail-group">
                <label>Year Level</label>
                <p>{student?.YearLevel} Year</p>
              </div>
            </div>
          </div>

          {/* Dynamic QR Code Card */}
          <div className="bento-card qr-card interactive-card accent-yellow">
            <div className="qr-wrapper">
              <div
                className="qr-container"
                style={{
                  background: "white",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={qrCodeUrl}
                  alt="Student QR Code"
                  className="qr-image"
                />
                <div className="qr-scan-line"></div>
              </div>
            </div>
            <p className="qr-hint">Scan for Attendance</p>
            <button
              className="btn-action-small"
              onClick={() => setShowQRModal(true)}
            >
              <Maximize2 size={14} style={{ marginRight: "5px" }} /> View
              Fullscreen
            </button>
          </div>

          {/* Total Events Attended Card */}
          <div className="bento-card stats-card interactive-card accent-sky">
            <div className="card-header">
              <CalendarCheck size={18} className="icon-blue" />
              <span>Total Events Attended</span>
            </div>
            <div className="stats-content">
              <h2 className="stats-value">{totalEvents}</h2>
              <p className="stats-label">Events</p>
            </div>
            <div
              className="card-footer-info"
              onClick={() => navigate("/attendanceHistory")}
            >
              Go to History →
            </div>
          </div>

          {/* Attendance Rating Card */}
          <div className="bento-card stats-card interactive-card accent-green">
            <div className="card-header">
              <TrendingUp size={18} className="icon-green" />
              <span>Attendance Rating</span>
            </div>
            <div className="stats-content">
              <h2 className="stats-value">{attendanceRate}%</h2>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
              <p className="stats-label rating-excellent">— Excellent</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
