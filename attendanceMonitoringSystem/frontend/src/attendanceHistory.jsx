import React, { useState, useRef, useEffect } from "react";
import { Search, Calendar, ChevronDown, Check, Loader2 } from "lucide-react";
import axios from "axios";
import "./attendanceHistory.css";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystem/backend";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AttendanceHistory() {
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Dynamic state para sa records
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 1. KUNIN ANG DATA MULA SA PHP BACKEND
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/get_attendance_history.php`, {
          withCredentials: true, // Importante para gumana ang PHP session
        });
        setAttendanceRecords(res.data);
      } catch (err) {
        console.error("Error fetching attendance records:", err);
        setErrorMsg(
          err.response?.data?.message || "Failed to load attendance history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Close dropdown kapag nag-click sa labas
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. FILTER LOGIC
  const filtered = attendanceRecords.filter((r) => {
    const matchesSearch =
      r.event.toLowerCase().includes(search.toLowerCase()) ||
      r.venue.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = selectedMonth
      ? r.date.startsWith(selectedMonth)
      : true;
    return matchesSearch && matchesMonth;
  });

  return (
    <>
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ── CUSTOM DROPDOWN ── */}
          <div className="custom-dropdown-history" ref={dropdownRef}>
            <div
              className={`dropdown-trigger-history ${isOpen ? "active" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Calendar size={18} className="icon-left" />
              <span>{selectedMonth || "Select Month"}</span>
              <ChevronDown
                size={16}
                className={`arrow ${isOpen ? "rotate" : ""}`}
              />
            </div>

            {isOpen && (
              <div className="dropdown-menu fade-in-up">
                <div
                  className={`dropdown-item ${selectedMonth === "" ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedMonth("");
                    setIsOpen(false);
                  }}
                >
                  All Months
                </div>
                {MONTHS.map((m) => (
                  <div
                    key={m}
                    className={`dropdown-item ${selectedMonth === m ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedMonth(m);
                      setIsOpen(false);
                    }}
                  >
                    {m}
                    {selectedMonth === m && (
                      <Check size={14} className="check-icon" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── TABLE VIEW WITH LOADING & ERROR STATES ── */}
        <div className="history-table-container">
          <div className="table-header-grid">
            <span>Date</span>
            <span>Event Name</span>
            <span>Venue</span>
            <span>Time In</span>
          </div>

          <div className="history-list">
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-muted)",
                }}
              >
                <Loader2
                  className="animate-spin"
                  style={{ margin: "0 auto 10px" }}
                  size={24}
                />
                <p>Loading records...</p>
              </div>
            ) : errorMsg ? (
              <p
                style={{
                  padding: "2rem",
                  color: "#e63946",
                  textAlign: "center",
                }}
              >
                {errorMsg}
              </p>
            ) : filtered.length === 0 ? (
              <p
                style={{
                  padding: "2rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                }}
              >
                No records found.
              </p>
            ) : (
              filtered.map((r) => (
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
    </>
  );
}
