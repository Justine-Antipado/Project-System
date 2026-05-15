import React, { useState } from 'react';
import { User, Info } from 'lucide-react';
//import './dashboard.css';
import './style.css';


// Mock data — replace with API call later
const ATTENDANCE_RECORDS = [
  {
    id: 1,
    date: 'September 02, 2025',
    event: 'Student General Assembly',
    venue: 'OMSC Gymnasium',
    timeIn: '07 : 55 AM',
    accent: 'accent-blue',
  },
  {
    id: 2,
    date: 'January 24, 2026',
    event: 'Meeting',
    venue: 'OMSC Gymnasium',
    timeIn: '08 : 00 AM',
    accent: 'accent-yellow',
  },
  {
    id: 3,
    date: 'February 18, 2026',
    event: 'Meeting',
    venue: 'OMSC Gymnasium',
    timeIn: '08 : 00 AM',
    accent: 'accent-green',
  },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AttendanceHistory() {
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const filtered = ATTENDANCE_RECORDS.filter(r => {
    const matchesSearch =
      r.event.toLowerCase().includes(search.toLowerCase()) ||
      r.venue.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = selectedMonth
      ? r.date.startsWith(selectedMonth)
      : true;
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="history-view fade-in">
      {/* ── HEADER ── */}
      <header className="history-header">
        <h1 className="main-title">ATTENDANCE HISTORY</h1>
      </header>

      {/* ── FILTERS ── */}
      <div className="filter-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search event..."
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="search-icon-box">
            <Info size={18} style={{ transform: 'rotate(180deg)' }} />
          </div>
        </div>

        <div className="dropdown-wrapper">
          <select
            className="month-dropdown"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <option value="">Month</option>
            {MONTHS.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="history-table-container">
        <div className="table-header-grid">
          <span>Date</span>
          <span>Event Name</span>
          <span>Venue</span>
          <span>Time In</span>
        </div>

        <div className="history-list">
          {filtered.length === 0 ? (
            <p style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              No records found.
            </p>
          ) : (
            filtered.map(r => (
              <div key={r.id} className={`history-row ${r.accent}`}>
                <span className="row-date">{r.date}</span>
                <span className="row-event">{r.event}</span>
                <span className="row-venue">{r.venue}</span>
                <span className="row-time">{r.timeIn}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}