import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from './Auth';
import Layout from "./Layout";
import StudentDashboard from "./studentDashboard";
import AttendanceHistory from "./attendanceHistory";
import Settings from "./settings";

export default function App() {
  return (
    <>
      <Routes>
        {/* Redirect root path to the authentication screen */}
        <Route path="/" element={<Navigate to="/Auth" replace />} />

        {/* 1. Explicit Route for your Login/Signup Component */}
        <Route path="/Auth" element={<Auth />} />

        {/* All student pages share the Layout (sidebar navigation) */}
        <Route element={<Layout />}>
          <Route path="/studentDashboard" element={<StudentDashboard />} />
          <Route path="/attendanceHistory" element={<AttendanceHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Catch-all fallback if someone types an invalid URL path */}
        <Route path="*" element={<Navigate to="/Auth" replace />} />
      </Routes>
    </>
  );
}