import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
//import Auth from './Auth';
import Layout from './Layout';
import StudentDashboard from './studentDashboard';
import AttendanceHistory from './attendanceHistory';
import Settings from './settings';

export default function App() {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* All student pages share the Layout (sidebar) */}
      <Route element={<Layout />}>
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/attendanceHistory" element={<AttendanceHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/StudentDashboard" replace />} />
    </Routes>
  );
}