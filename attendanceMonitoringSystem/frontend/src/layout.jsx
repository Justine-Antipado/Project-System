//import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, History, Settings, LogOut } from "lucide-react";
// I-import dito ang iyong logo file
import omscLogo from "./assets/omsc.logo.png";
import "./layout.css";
import "./style.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Layout() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  axios
    .get("http://localhost/Attendance%20Project%20System/attendanceMonitoringSystem/backend/get_session.php", {
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.authenticated) {
        setCurrentUser(res.data.user);
      }
    })
    .catch(() => {
      navigate("/Auth"); // walang session → balik login
    });
}, []);

  const handleLogout = async () => {
  await axios.get(
    "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystem/backend/logout.php",
    { withCredentials: true }
  );

  navigate("/Auth");
};

  return (
    <>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-top">
            {/* Header Section with Image Logo */}
            <div className="sidebar-header">
              <div className="logo-box">
                {/* Pinalitan ang Icon ng <img> tag */}
                <img
                  src={omscLogo}
                  alt="OMSC Logo"
                  className="sidebar-logo-img"
                />
              </div>
              <div className="header-text">
                <h2 className="system-name">Events Attendance</h2>
                <p className="sub-name">OMSC EasyLog</p>
              </div>
            </div>

            <nav className="nav-menu">
              <p className="menu-label">MAIN MENU</p>

              <NavLink
                to="/studentDashboard"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/attendanceHistory"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <History size={20} />
                <span>Attendance History</span>
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <div className="user-profile-card">
              <div className="user-icon-bg">
                <span className="user-icon-placeholder">👤</span>
              </div>
              <div className="user-details">
                <p className="user-name">
  {currentUser
    ? `${currentUser.FirstName} ${currentUser.LastName}`
    : "Loading..."}
</p>

<p className="user-id">
  {currentUser
    ? `${currentUser.SchoolIDNo} - ${currentUser.Program}`
    : ""}
</p>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={20} className="logout-icon" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
