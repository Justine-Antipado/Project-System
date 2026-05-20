import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Check,
  Trash2,
  QrCode,
  SquarePen,
  AlertTriangle,
} from "lucide-react";

export default function EventAttendance() {
  // ── STATE DECLARATIONS ──
  const [search, setSearch] = useState("");
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Mga kinakailangang state para gumana ang Delete Modal nang maayos
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ── REFS & CONSTANTS ──
  const monthDropdownRef = useRef(null);
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

  // Dummy State para sa Attendance Mock Data na tugma sa iyong Headers
  const [filteredEvents, setFilteredEvents] = useState([
    {
      id: "EA-1001",
      eventId: "EVT-01",
      studentId: "24-1-0396",
      scannedBy: "Admin Juan",
      timestamp: "2026-05-19 08:30 AM",
      status: "ongoing",
    },
    {
      id: "EA-1002",
      eventId: "EVT-03",
      studentId: "24-1-0844",
      scannedBy: "Admin Maria",
      timestamp: "2026-05-19 09:15 AM",
      status: "completed",
    },
  ]);

  // ── HANDLER HOOKS ──
  const handleOpenDeleteModal = (event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Tatanggalin ang record sa listahan gamit ang napiling event id
    setFilteredEvents((prev) =>
      prev.filter((item) => item.id !== selectedEvent.id),
    );
    setIsDeleteModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="event-view fade-in">
        <header className="event-header">
          <h1>EVENT ATTENDANCE</h1>
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
          <div className="custom-dropdown-event" ref={monthDropdownRef}>
            <div
              className={`dropdown-trigger-event ${isMonthOpen ? "active" : ""}`}
              onClick={() => setIsMonthOpen(!isMonthOpen)}
            >
              <Calendar size={18} className="icon-left" />
              <span>{selectedMonth || "Select Month"}</span>
              <ChevronDown
                size={16}
                className={`arrow ${isMonthOpen ? "rotate" : ""}`}
              />
            </div>

            {isMonthOpen && (
              <div className="dropdown-menu fade-in-up">
                <div
                  className={`dropdown-item ${selectedMonth === "" ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedMonth("");
                    setIsMonthOpen(false);
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
                      setIsMonthOpen(false);
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

        {/* ── ATTENDANCE DATA ARCHITECTURE ── */}
        <div className="event-attendance-table-container">
          {/* Isinara ng maayos ang structural block ng header wrapper */}
          <div className="table-grid-header">
            <span>Event Attendance ID</span>
            <span>Event ID</span>
            <span>Student ID</span>
            <span>Scanned By</span>
            <span>Timestamp</span>
            <span className="text-left-aligned">Action</span>
          </div>

          <div className="event-list">
            {filteredEvents.map((event) => {
              const isOngoing = event.status.toLowerCase() === "ongoing";
              return (
                <div key={event.id} className="evt-table-grid-row">
                  <span className="evt-id-text">{event.id}</span>
                  <span className="evt-highlight-text">{event.eventId}</span>
                  <span>{event.studentId}</span>
                  <span>{event.scannedBy}</span>
                  <span className="evt-sem-text">{event.timestamp}</span>

                  <div className="evt-action-buttons-group">
                    <button
                      className="evt-action-btn delete"
                      title="Delete Event"
                      onClick={() => handleOpenDeleteModal(event)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="evt-no-records">
                No entries matched your filter parameters.
              </div>
            )}
          </div>
        </div>

        {/* MODAL 2: Delete Secure Confirmation Panel */}
        {isDeleteModalOpen && (
          <div
            className="evt-modal-overlay"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <div
              className="evt-confirm-modal-card animate-pop-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="evt-confirm-icon-wrapper">
                <AlertTriangle size={28} className="warn-icon" />
              </div>
              <h4>Confirm Deletion</h4>
              <p>
                Are you sure you want to permanently remove{" "}
                <strong>{selectedEvent?.id}</strong>? This action cannot be
                reverted.
              </p>
              <div className="evt-confirm-actions">
                <button
                  className="evt-btn-cancel"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="evt-btn-danger-confirm"
                  onClick={handleConfirmDelete}
                >
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
