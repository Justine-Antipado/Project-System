import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  Users,
  FileText,
  CalendarDays,
  Layers,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "axios";
import omscLogo from "./assets/omsc.logo.png";
import "./layout.css";
import "./style.css";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

export default function Layout() {
  const navigate = useNavigate();
  // Update initial state
  const [currentUser, setCurrentUser] = useState({
    name: "",
    id: "",
    program: "",
    position: "",
  });

  // ── LOAD USER FROM PHP SESSION ──
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/get_admin_profile.php`, {
          withCredentials: true,
        });
        const user = res.data.user;
        setCurrentUser({
          name: `${user.FirstName} ${user.LastName}`,
          id: `${user.SchoolIDNo}`,
          program: user.Program || "",
          position: user.Position || "",
        });
      } catch {
        // Session expired or not logged in — redirect to login
        navigate("/Auth");
      }
    };
    fetchUser();
  }, []);

  // ── LOGOUT ──
  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/admin_logout.php`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch {
      // even if it fails, redirect
    }
    navigate("/Auth");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <div className="logo-box">
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
            <p className="menu-label">ADMIN MENU</p>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/event"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Calendar size={20} />
              <span>Events</span>
            </NavLink>
            <NavLink
              to="/officer"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <UserCheck size={20} />
              <span>Officers</span>
            </NavLink>
            <NavLink
              to="/organization"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Users size={20} />
              <span>Organizations</span>
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <FileText size={20} />
              <span>Reports</span>
            </NavLink>
            <NavLink
              to="/schoolYear"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <CalendarDays size={20} />
              <span>School Year</span>
            </NavLink>
            <NavLink
              to="/semester"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Layers size={20} />
              <span>Semester</span>
            </NavLink>
            <NavLink
              to="/student"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <GraduationCap size={20} />
              <span>Students</span>
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
              <p className="user-name">{currentUser.name || "Loading..."}</p>
              <p className="user-id">{currentUser.id || ""}</p>
              {currentUser.program && currentUser.position && (
                <p className="user-id">
                  {currentUser.program} — {currentUser.position}
                </p>
              )}
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
  );
}
