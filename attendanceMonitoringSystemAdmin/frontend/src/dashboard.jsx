import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

export default function Dashboard() {
  const navigate = useNavigate();

  // ── STATE ──
  const [stats, setStats] = useState({
    totalStudents: 0,
    eventsTodayCount: 0,
    ongoingAttendance: 0,
  });
  const [departments, setDepartments] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [adminName, setAdminName] = useState("Officer");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── FETCH DASHBOARD DATA ──
  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API}/getDashboardStats.php`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setStats({
            totalStudents: res.data.totalStudents,
            eventsTodayCount: res.data.eventsTodayCount,
            ongoingAttendance: res.data.ongoingAttendance,
          });
          setDepartments(res.data.departments);
          setRecentLogs(res.data.recentLogs);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    // ── FETCH LOGGED-IN ADMIN NAME ──
    const fetchAdminName = async () => {
      try {
        const res = await axios.get(`${API}/adminProfile.php`, {
          withCredentials: true,
        });
        if (res.data && res.data.user) {
          setAdminName(res.data.user.FirstName || "Officer");
        }
      } catch (err) {
        console.error("Failed to fetch admin name:", err);
      }
    };

    fetchDashboard();
    fetchAdminName();
  }, []);

  if (isLoading)
    return (
      <div className="dashboard-view fade-in">
        <p>Loading dashboard data...</p>
      </div>
    );

  if (error)
    return (
      <div className="dashboard-view fade-in">
        <p style={{ color: "#e63946" }}>{error}</p>
      </div>
    );

  return (
    <>
      <div className="dashboard-view fade-in">
        {/* ── HEADER SECTION ── */}
        <header className="welcome-header flex-header">
          <div className="header-titles">
            <p className="sub-text">Welcome back, {adminName}! 👋</p>
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
                Total Registered
                <br />
                Students
              </h3>
              <div className="card-body-row">
                <span className="card-icon text-blue">🎓</span>
                <div className="badge-value-box">{stats.totalStudents}</div>
              </div>
            </div>

            {/* Card 2: Events Scheduled Today */}
            <div className="bento-card stat-card interactive-card">
              <h3 className="card-title-centered">
                Events Scheduled
                <br />
                Today
              </h3>
              <div className="card-body-row">
                <span className="card-icon text-yellow">📅</span>
                <div className="badge-value-box">{stats.eventsTodayCount}</div>
              </div>
            </div>

            {/* Card 3: Ongoing Attendance */}
            <div className="bento-card stat-card interactive-card">
              <h3 className="card-title-centered">
                Ongoing
                <br />
                Attendance
              </h3>
              <div className="card-body-row">
                <span className="card-icon text-sky">📋</span>
                <div className="badge-value-box">{stats.ongoingAttendance}</div>
              </div>
            </div>

            {/* Card 4: System Health */}
            <div className="bento-card stat-card interactive-card">
              <h3 className="card-title-centered">
                System
                <br />
                Health
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
              <button
                className="btn-action btn-dark"
                title="View Student"
                onClick={() => navigate("/student")}
              >
                <span>👁️ View Student</span>
              </button>
              <button
                className="btn-action btn-blue"
                title="View Event"
                onClick={() => navigate("/event")}
              >
                <span>👁️ View Event</span>
              </button>
            </div>
          </div>

          {/* ── LOWER CONTENT GRID ── */}
          <div className="lower-dashboard-grid">
            {/* Departmental Participation */}
            <div className="bento-card primary-content-card">
              <h2 className="card-section-title">Departmental Participation</h2>
              <div className="departments-inner-grid">
                {departments.length === 0 ? (
                  <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
                    No attendance data yet.
                  </p>
                ) : (
                  departments.map((dept, index) => (
                    <div key={index} className="department-badge-card">
                      <span className="dept-name">{dept.Program}</span>
                      <span className="dept-avatar-icon">🎓</span>
                      <span className="dept-participant-count">
                        Total Participant: {dept.count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity Logs */}
            <div className="bento-card side-content-card flex-col-justify">
              <div className="logs-wrapper">
                <h2 className="card-section-title">Recent Activity</h2>
                <div className="logs-list">
                  {recentLogs.length === 0 ? (
                    <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
                      No recent activity.
                    </p>
                  ) : (
                    recentLogs.map((log, index) => (
                      <div key={index} className="log-item-row">
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
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
