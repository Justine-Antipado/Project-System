import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  UserCheck,
  Users,
  FileText,
  CalendarDays,
  Layers,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";

// I-import dito ang iyong logo file
import omscLogo from "./assets/omsc.logo.png";
import "./layout.css";
import "./style.css";

export default function Layout() {
  const navigate = useNavigate();

  const currentUser = {
    name: "Ricardo Santiago",
    id: "24-1-03962 - BSIT",
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
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

          {/* Eto na ang pinalitang Nav Menu para sa mga Admin Routes */}
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
              to="/eventAttendance"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <CheckSquare size={20} />
              <span>Event Attendance</span>
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
              <p className="user-name">{currentUser.name}</p>
              <p className="user-id">{currentUser.id}</p>
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
