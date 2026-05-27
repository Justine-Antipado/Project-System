import React, { useState, useRef, useEffect } from "react";
import PrintableReport from "./PrintableReport";
import axios from "axios";
import {
  BookOpen,
  GraduationCap,
  Layers,
  Calendar,
  Check,
  ChevronDown,
  Printer,
  CalendarDays,
} from "lucide-react";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

const PROGRAMS = ["BSIT", "BEED", "BSOA", "BSBA"];
const YEAR_LEVELS = [1, 2, 3, 4];
const SECTIONS = ["A", "B", "C", "D"];

export default function Report() {
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const reportColumns = "0.8fr 2.5fr 1.2fr 1.2fr 1fr 1fr 1.5fr";

  // ── 1. STATE PARA SA EVENTS DROPDOWN ──
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isEventOpen, setIsEventOpen] = useState(false);
  const eventDropdownRef = useRef(null);

  // ── 2. STATE PARA SA PROGRAM DROPDOWN ──
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const programDropdownRef = useRef(null);

  // ── 3. STATE PARA SA YEAR LEVEL DROPDOWN ──
  const [selectedYear, setSelectedYear] = useState("");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearDropdownRef = useRef(null);

  // ── 4. STATE PARA SA SECTION DROPDOWN ──
  const [selectedSection, setSelectedSection] = useState("");
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const sectionDropdownRef = useRef(null);

  // ── 5. STATE PARA SA SEMESTER DROPDOWN ──
  // selectedSemester holds the full event object { semesterId, semester (label) }
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);
  const semesterDropdownRef = useRef(null);

  // ── 🔃 LOAD EVENTS ON MOUNT ──
  useEffect(() => {
    axios
      .get(`${API}/events.php`)
      .then((res) => {
        if (res.data.success) setEvents(res.data.data);
      })
      .catch((err) => console.error("Failed to load events:", err));
  }, []);

  // ── 🔃 FETCH ATTENDANCE ON FILTER CHANGE ──
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/get_attendance.php`, {
        params: {
          ...(selectedEvent              && { event:      selectedEvent }),
          ...(selectedProgram            && { program:    selectedProgram }),
          ...(selectedYear               && { year:       selectedYear }),
          ...(selectedSection            && { section:    selectedSection }),
          ...(selectedSemester           && { semesterId: selectedSemester.semesterId }),
        },
      })
      .then((res) => {
        if (res.data.success) setStudents(res.data.data);
      })
      .catch((err) => console.error("Failed to load attendance:", err))
      .finally(() => setLoading(false));
  }, [selectedEvent, selectedProgram, selectedYear, selectedSection, selectedSemester]);

  // ── Derive unique semesters from loaded events ──
  const semesterOptions = events.reduce((acc, evt) => {
    if (!acc.find((s) => s.semesterId === evt.semesterId)) {
      acc.push({ semesterId: evt.semesterId, semester: evt.semester });
    }
    return acc;
  }, []);

  // ── CLICK OUTSIDE TO CLOSE DROP DOWNS ──
  useEffect(() => {
    function handleClickOutside(event) {
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target))
        setIsEventOpen(false);
      if (programDropdownRef.current && !programDropdownRef.current.contains(event.target))
        setIsProgramOpen(false);
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target))
        setIsYearOpen(false);
      if (sectionDropdownRef.current && !sectionDropdownRef.current.contains(event.target))
        setIsSectionOpen(false);
      if (semesterDropdownRef.current && !semesterDropdownRef.current.contains(event.target))
        setIsSemesterOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">REPORT</h1>
        </header>

        <div className="filter-container">
          <div className="filter-row">
            {/* ── 1. CUSTOM EVENTS DROPDOWN ── */}
            <div className="custom-dropdown-uni" ref={eventDropdownRef}>
              <div
                className={`dropdown-trigger-uni ${isEventOpen ? "active" : ""}`}
                onClick={() => setIsEventOpen(!isEventOpen)}
              >
                <Calendar size={18} className="icon-left" />
                <span>{selectedEvent || "Select Event"}</span>
                <ChevronDown
                  size={16}
                  className={`arrow ${isEventOpen ? "rotate" : ""}`}
                />
              </div>

              {isEventOpen && (
                <div className="dropdown-menu fade-in-up">
                  <div
                    className={`dropdown-item ${selectedEvent === "" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedEvent("");
                      setIsEventOpen(false);
                    }}
                  >
                    All Events
                  </div>
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className={`dropdown-item ${selectedEvent === evt.name ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedEvent(evt.name);
                        setIsEventOpen(false);
                      }}
                    >
                      {evt.name}
                      {selectedEvent === evt.name && (
                        <Check size={14} className="check-icon" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 2. CUSTOM PROGRAM DROPDOWN ── */}
            <div className="custom-dropdown-uni" ref={programDropdownRef}>
              <div
                className={`dropdown-trigger-uni ${isProgramOpen ? "active" : ""}`}
                onClick={() => setIsProgramOpen(!isProgramOpen)}
              >
                <BookOpen size={18} className="icon-left" />
                <span>{selectedProgram || "Select Prog"}</span>
                <ChevronDown
                  size={16}
                  className={`arrow ${isProgramOpen ? "rotate" : ""}`}
                />
              </div>

              {isProgramOpen && (
                <div className="dropdown-menu fade-in-up">
                  <div
                    className={`dropdown-item ${selectedProgram === "" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedProgram("");
                      setIsProgramOpen(false);
                    }}
                  >
                    All Programs
                  </div>
                  {PROGRAMS.map((prog) => (
                    <div
                      key={prog}
                      className={`dropdown-item ${selectedProgram === prog ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedProgram(prog);
                        setIsProgramOpen(false);
                      }}
                    >
                      {prog}
                      {selectedProgram === prog && (
                        <Check size={14} className="check-icon" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 3. CUSTOM YEAR LEVEL DROPDOWN ── */}
            <div className="custom-dropdown-uni" ref={yearDropdownRef}>
              <div
                className={`dropdown-trigger-uni ${isYearOpen ? "active" : ""}`}
                onClick={() => setIsYearOpen(!isYearOpen)}
              >
                <GraduationCap size={18} className="icon-left" />
                <span>
                  {selectedYear ? `Year ${selectedYear}` : "Select Year"}
                </span>
                <ChevronDown
                  size={16}
                  className={`arrow ${isYearOpen ? "rotate" : ""}`}
                />
              </div>

              {isYearOpen && (
                <div className="dropdown-menu fade-in-up">
                  <div
                    className={`dropdown-item ${selectedYear === "" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedYear("");
                      setIsYearOpen(false);
                    }}
                  >
                    All Year Levels
                  </div>
                  {YEAR_LEVELS.map((yr) => (
                    <div
                      key={yr}
                      className={`dropdown-item ${selectedYear === yr ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedYear(yr);
                        setIsYearOpen(false);
                      }}
                    >
                      Year {yr}
                      {selectedYear === yr && (
                        <Check size={14} className="check-icon" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 4. CUSTOM SECTION DROPDOWN ── */}
            <div className="custom-dropdown-uni" ref={sectionDropdownRef}>
              <div
                className={`dropdown-trigger-uni ${isSectionOpen ? "active" : ""}`}
                onClick={() => setIsSectionOpen(!isSectionOpen)}
              >
                <Layers size={18} className="icon-left" />
                <span>
                  {selectedSection ? `Section ${selectedSection}` : "Select Sec"}
                </span>
                <ChevronDown
                  size={16}
                  className={`arrow ${isSectionOpen ? "rotate" : ""}`}
                />
              </div>

              {isSectionOpen && (
                <div className="dropdown-menu fade-in-up">
                  <div
                    className={`dropdown-item ${selectedSection === "" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedSection("");
                      setIsSectionOpen(false);
                    }}
                  >
                    All Sections
                  </div>
                  {SECTIONS.map((sec) => (
                    <div
                      key={sec}
                      className={`dropdown-item ${selectedSection === sec ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedSection(sec);
                        setIsSectionOpen(false);
                      }}
                    >
                      Section {sec}
                      {selectedSection === sec && (
                        <Check size={14} className="check-icon" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 5. CUSTOM SEMESTER DROPDOWN (dynamic, from events) ── */}
            <div className="custom-dropdown-uni" ref={semesterDropdownRef}>
              <div
                className={`dropdown-trigger-uni ${isSemesterOpen ? "active" : ""}`}
                onClick={() => setIsSemesterOpen(!isSemesterOpen)}
              >
                <CalendarDays size={18} className="icon-left" />
                <span>{selectedSemester ? selectedSemester.semester : "Select Sem"}</span>
                <ChevronDown
                  size={16}
                  className={`arrow ${isSemesterOpen ? "rotate" : ""}`}
                />
              </div>

              {isSemesterOpen && (
                <div className="dropdown-menu fade-in-up">
                  <div
                    className={`dropdown-item ${selectedSemester === null ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedSemester(null);
                      setIsSemesterOpen(false);
                    }}
                  >
                    All Semesters
                  </div>
                  {semesterOptions.map((sem) => (
                    <div
                      key={sem.semesterId}
                      className={`dropdown-item ${selectedSemester?.semesterId === sem.semesterId ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedSemester(sem);
                        setIsSemesterOpen(false);
                      }}
                    >
                      {sem.semester}
                      {selectedSemester?.semesterId === sem.semesterId && (
                        <Check size={14} className="check-icon" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="uni-btn-primary"
          onClick={() => window.print()}
          disabled={!selectedEvent || !selectedSemester}
          style={{
            opacity: !selectedEvent || !selectedSemester ? 0.4 : 1,
            cursor: !selectedEvent || !selectedSemester ? "not-allowed" : "pointer",
          }}
        >
          <Printer size={16} />
          Print Report
        </button>

        <div className="uni-table-container">
          <div
            className="table-grid-header"
            style={{ gridTemplateColumns: reportColumns }}
          >
            <span>No.</span>
            <span>Name</span>
            <span>Event</span>
            <span>Program</span>
            <span>Year</span>
            <span>Section</span>
            <span>Semester</span>
          </div>
          <div className="uni-list">
            {loading ? (
              <div className="uni-no-records">Loading...</div>
            ) : students.length > 0 ? (
              students.map((student) => (
                <div
                  key={student.id}
                  className="uni-table-grid-row"
                  style={{ gridTemplateColumns: reportColumns }}
                >
                  <span className="uni-id-text">{student.id}</span>
                  <span className="uni-highlight-text">{student.name}</span>
                  <span className="uni-event-text" style={{ fontWeight: "500" }}>
                    {student.event}
                  </span>
                  {/* ✅ Na-render na ang Event dito */}
                  <span>{student.program}</span>
                  <span>Year {student.year}</span>
                  <span>Section {student.section}</span>
                  <span className="uni-sem-text">{student.semester}</span>
                </div>
              ))
            ) : (
              <div className="uni-no-records">
                No entries matched your filter parameters.
              </div>
            )}
          </div>
        </div>

        {/* 2. DITO MO IPAPASA ANG FILTERED DATA PARA TUGMA ANG SCREEN AT PAPEL */}
        <PrintableReport
          students={students}
          selectedEvent={selectedEvent}
          selectedSemester={selectedSemester?.semester ?? ""}
          selectedProgram={selectedProgram}
          selectedYear={selectedYear}
          selectedSection={selectedSection}
        />
      </div>
    </>
  );
}