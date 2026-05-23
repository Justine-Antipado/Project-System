import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminAuth from "./AdminAuth";
import Layout from "./Layout";
import Event from "./event";
import EventAttendance from "./eventAttendance";
import Officer from "./officer";
import Organization from "./organization";
import Report from "./report";
import SchoolYear from "./schoolYear";
import Semester from "./semester";
import Student from "./students";
import Dashboard from "./dashboard";
//import AttendanceHistory from './attendanceHistory';
import Settings from "./settings";
import QrScannerDashboard from "./scanner";

export default function App() {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/AdminAuth" replace />} />

      <Route path="/AdminAuth" element={<AdminAuth />} />

      {/* All admin pages share the Layout (sidebar) */}
      <Route element={<Layout />}>
        <Route path="/event" element={<Event />} />
        <Route path="/eventAttendance" element={<EventAttendance />} />
        <Route path="/officer" element={<Officer />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/report" element={<Report />} />
        <Route path="/schoolYear" element={<SchoolYear />} />
        <Route path="/semester" element={<Semester />} />
        <Route path="/student" element={<Student />} />
        <Route path="/qrScanner" element={<QrScannerDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/AdminAuth" replace />} />
    </Routes>
  );
}
