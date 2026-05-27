import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// ─── CONFIGURATIONS & CONSTANTS ───
const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

const PROGRAMS = ["BSIT", "BEED", "BSOA", "BSBA"];
const YEAR_LEVELS = [1, 2, 3, 4];
const SECTIONS = ["A", "B", "C", "D"];

export default function EventAttendance() {
  // ── ROUTING AT URL PARAMS LOGIC ──
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("eventId") || "";

  // Inayos sa 5 columns para magkasya nang saktong-sakto at pantay ang attendance fields
  const eventAttendanceColumns = "1.2fr 1fr 1.2fr 1.2fr 1.5fr";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // ── STATE FOR PROGRAM DROPDOWN ──
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const programDropdownRef = useRef(null);

  // ── STATE FOR YEAR LEVEL DROPDOWN ──
  const [selectedYear, setSelectedYear] = useState("");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearDropdownRef = useRef(null);

  // ── STATE FOR SECTION DROPDOWN ──
  const [selectedSection, setSelectedSection] = useState("");
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const sectionDropdownRef = useRef(null);

  useEffect(() => {
    if (eventId) {
      axios
        .get(`${API}/getEventAttendance.php?eventId=${eventId}`)
        .then((res) => {
          if (res.data.status === "success") {
            setStudents(res.data.data);
          }
        })
        .catch((err) => console.error("Error fetching attendance:", err));
    }
  }, [eventId]);

  // ── CLICK OUTSIDE TO CLOSE DROP DOWNS ──
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        programDropdownRef.current &&
        !programDropdownRef.current.contains(event.target)
      ) {
        setIsProgramOpen(false);
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setIsYearOpen(false);
      }
      if (
        sectionDropdownRef.current &&
        !sectionDropdownRef.current.contains(event.target)
      ) {
        setIsSectionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── SEARCH AT FILTER LOGIC ──
  const filteredStudents = students.filter((student) => {
    // Hinahanap ang tinype ng user sa Attendance ID, Student School ID, Event ID, o Scanned By
    const searchTarget = `
        ${student.EventAttendanceID} 
        ${student.SchoolIDNo} 
        ${student.EventID} 
        ${student.ScannedByName}
      `.toLowerCase();

    const matchesSearch = searchTarget.includes(search.toLowerCase());

    // Dropdown filters (nakabase pa rin sa kurso at pangkat ng estudyante)
    const matchesProgram =
      selectedProgram === "" || student.program === selectedProgram;
    const matchesYear =
      selectedYear === "" || student.yearLevel === Number(selectedYear);
    const matchesSection =
      selectedSection === "" || student.section === selectedSection;

    return matchesSearch && matchesProgram && matchesYear && matchesSection;
  });

  return (
    <>
      <div className="uni-view fade-in">
        <button
          type="button"
          className="uni-panel-close-btn"
          onClick={() => navigate(-1)}
        >
          <X size={18} />
        </button>
        <header className="uni-header">
          <h1 className="main-title">
            EVENT ATTENDANCE {eventId ? `ID-${eventId}` : ""}
          </h1>
        </header>

        <div className="filter-container">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search attendance logs..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-row">
            {/* ── CUSTOM PROGRAM DROPDOWN ── */}
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

            {/* ── CUSTOM YEAR LEVEL DROPDOWN ── */}
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

            {/* ── CUSTOM SECTION DROPDOWN ── */}
            <div className="custom-dropdown-uni" ref={sectionDropdownRef}>
              <div
                className={`dropdown-trigger-uni ${isSectionOpen ? "active" : ""}`}
                onClick={() => setIsSectionOpen(!isSectionOpen)}
              >
                <Layers size={18} className="icon-left" />
                <span>
                  {selectedSection
                    ? `Section ${selectedSection}`
                    : "Select Sec"}
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
          </div>
        </div>

        <div className="uni-table-container">
          <div
            className="table-grid-header"
            style={{ gridTemplateColumns: eventAttendanceColumns }}
          >
            <span>Event Attendance ID</span>
            <span>Event ID</span>
            <span>Student ID No.</span>
            <span>Scanned By</span>
            <span>Timestamp</span>
          </div>

          <div className="uni-list">
            {filteredStudents.map((student) => {
              return (
                <div
                  key={student.EventAttendanceID}
                  className="uni-table-grid-row"
                  style={{ gridTemplateColumns: eventAttendanceColumns }}
                >
                  <span className="uni-id-text">
                    ID-{student.EventAttendanceID}
                  </span>
                  <span className="uni-highlight-text">
                    ID-{student.EventID}
                  </span>
                  <span>{student.SchoolIDNo}</span>
                  <span>{student.ScannedByName}</span>
                  <span className="uni-sem-text">{student.Timestamp}</span>
                </div>
              );
            })}

            {filteredStudents.length === 0 && (
              <div className="uni-no-records">No student records found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
