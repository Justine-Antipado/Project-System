import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Check } from 'lucide-react';
import './attendanceHistory.css';

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
  {
    id: 4,
    date: 'September 02, 2025',
    event: 'Student General Assembly',
    venue: 'OMSC Gymnasium',
    timeIn: '07 : 55 AM',
    accent: 'accent-blue',
  },
  {
    id: 5,
    date: 'September 02, 2025',
    event: 'Student General Assembly',
    venue: 'OMSC Gymnasium',
    timeIn: '07 : 55 AM',
    accent: 'accent-blue',
  },
  {
    id: 6,
    date: 'September 02, 2025',
    event: 'Student General Assembly',
    venue: 'OMSC Gymnasium',
    timeIn: '07 : 55 AM',
    accent: 'accent-blue',
  },
  {
    id: 7,
    date: 'September 02, 2025',
    event: 'Student General Assembly',
    venue: 'OMSC Gymnasium',
    timeIn: '07 : 55 AM',
    accent: 'accent-blue',
  },
  {
    id: 8,
    date: 'September 02, 2025',
    event: 'Student General Assembly',
    venue: 'OMSC Gymnasium',
    timeIn: '07 : 55 AM',
    accent: 'accent-blue',
  }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AttendanceHistory() {
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown pag nag-click sa labas
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = ATTENDANCE_RECORDS.filter(r => {
    const matchesSearch = r.event.toLowerCase().includes(search.toLowerCase()) || 
                          r.venue.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = selectedMonth ? r.date.startsWith(selectedMonth) : true;
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="history-view fade-in">
      <header className="history-header">
        <h1 className="main-title">ATTENDANCE HISTORY</h1>
      </header>

      <div className="filter-container">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search event..."
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── CUSTOM DROPDOWN ── */}
        <div className="custom-dropdown-history" ref={dropdownRef}>
          <div 
            className={`dropdown-trigger-history ${isOpen ? 'active' : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
          >
            <Calendar size={18} className="icon-left" />
            <span>{selectedMonth || 'Select Month'}</span>
            <ChevronDown size={16} className={`arrow ${isOpen ? 'rotate' : ''}`} />
          </div>

          {isOpen && (
            <div className="dropdown-menu fade-in-up">
              <div 
                className={`dropdown-item ${selectedMonth === '' ? 'selected' : ''}`}
                onClick={() => { setSelectedMonth(''); setIsOpen(false); }}
              >
                All Months
              </div>
              {MONTHS.map(m => (
                <div 
                  key={m} 
                  className={`dropdown-item ${selectedMonth === m ? 'selected' : ''}`}
                  onClick={() => { setSelectedMonth(m); setIsOpen(false); }}
                >
                  {m}
                  {selectedMonth === m && <Check size={14} className="check-icon" />}
                </div>
              ))}
            </div>
          )}
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