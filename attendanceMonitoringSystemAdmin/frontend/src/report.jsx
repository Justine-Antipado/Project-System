import React, { useState, useRef, useEffect } from "react";
import PrintableReport from "./PrintableReport";
// Idinagdag ang mga tamang icons mula sa lucide-react para hindi mag-error ang code mo
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

const PROGRAMS = ["BSIT", "BEED", "BSOA", "BSBA"];
const YEAR_LEVELS = [1, 2, 3, 4];
const SECTIONS = ["A", "B", "C", "D"];
const SEMESTER = ["1st Semester", "2nd Semester"];
const EVENTS = ["Event 1", "Event 2", "Event 3", "Event 4"];

// ── 🛠️ NA-UPDATE NA MOCK DATA (MAY 'event' PROPERTY NA ANG BAWAT ESTUDYANTE) ──
const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    event: "Event 1",
    program: "BSIT",
    year: 3,
    section: "A",
    semester: "1st Semester",
  },

  {
    id: 2,
    name: "Maria Clara Santos",
    event: "Event 2",
    program: "BSBA",
    year: 4,
    section: "B",
    semester: "1st Semester",
  },
  {
    id: 3,
    name: "Crisostomo Ibarra",
    event: "Event 3",
    program: "BSIT",
    year: 2,
    section: "C",
    semester: "2nd Semester",
  },
  {
    id: 4,
    name: "Jane Doe",
    event: "Event 1",
    program: "BEED",
    year: 1,
    section: "A",
    semester: "1st Semester",
  },

  {
    id: 5,
    name: "John Smith",
    event: "Event 4",
    program: "BSOA",
    year: 2,
    section: "D",
    semester: "1st Semester",
  },
  {
    id: 6,
    name: "Pedro Penduko",
    event: "Event 2",
    program: "BSIT",
    year: 4,
    section: "A",
    semester: "2nd Semester",
  },
  {
    id: 7,
    name: "Gabriela Silang",
    event: "Event 1",
    program: "BEED",
    year: 3,
    section: "B",
    semester: "1st Semester",
  },
  {
    id: 8,
    name: "Andres Bonifacio",
    event: "Event 3",
    program: "BSBA",
    year: 2,
    section: "A",
    semester: "2nd Semester",
  },
  {
    id: 9,
    name: "Melchora Aquino",
    event: "Event 4",
    program: "BSOA",
    year: 4,
    section: "C",
    semester: "1st Semester",
  },
  {
    id: 10,
    name: "Emilio Aguinaldo",
    event: "Event 1",
    program: "BSIT",
    year: 1,
    section: "B",
    semester: "1st Semester",
  },
  {
    id: 11,
    name: "Jose Rizal",
    event: "Event 2",
    program: "BSBA",
    year: 3,
    section: "D",
    semester: "2nd Semester",
  },
  {
    id: 12,
    name: "Apolinario Mabini",
    event: "Event 3",
    program: "BSIT",
    year: 2,
    section: "A",
    semester: "1st Semester",
  },
  {
    id: 13,
    name: "Marcelo H. Del Pilar",
    event: "Event 4",
    program: "BEED",
    year: 4,
    section: "B",
    semester: "2nd Semester",
  },
  {
    id: 14,
    name: "Juan Luna",
    event: "Event 1",
    program: "BSBA",
    year: 1,
    section: "C",
    semester: "1st Semester",
  },
  {
    id: 15,
    name: "Antonio Luna",
    event: "Event 2",
    program: "BSOA",
    year: 3,
    section: "A",
    semester: "2nd Semester",
  },
  {
    id: 16,
    name: "Jane Doe",
    event: "Event 1",
    program: "BEED",
    year: 1,
    section: "A",
    semester: "1st Semester",
  },
  {
    id: 17,
    name: "Jane Doe",
    event: "Event 1",
    program: "BEED",
    year: 1,
    section: "A",
    semester: "1st Semester",
  },
  {
    id: 18,
    name: "Juan Cruz",
    event: "Event 1",
    program: "BSIT",
    year: 3,
    section: "A",
    semester: "1st Semester",
  },
];

export default function Report() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [filter, setSearch] = useState("");

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
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isSemesterOpen, setIsSemesterOpen] = useState(false);
  const semesterDropdownRef = useRef(null);

  // ── 🎯 AKTIBONG FILTER LOGIC ──
  const filteredStudents = students.filter((student) => {
    return (
      (selectedEvent === "" || student.event === selectedEvent) &&
      (selectedProgram === "" || student.program === selectedProgram) &&
      (selectedYear === "" || student.year === Number(selectedYear)) &&
      (selectedSection === "" || student.section === selectedSection) &&
      (selectedSemester === "" || student.semester === selectedSemester)
    );
  });

  // ── CLICK OUTSIDE TO CLOSE DROP DOWNS ──
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        eventDropdownRef.current &&
        !eventDropdownRef.current.contains(event.target)
      ) {
        setIsEventOpen(false);
      }
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
      if (
        semesterDropdownRef.current &&
        !semesterDropdownRef.current.contains(event.target)
      ) {
        setIsSemesterOpen(false);
      }
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
                  {EVENTS.map((evt) => (
                    <div
                      key={evt}
                      className={`dropdown-item ${selectedEvent === evt ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedEvent(evt);
                        setIsEventOpen(false);
                      }}
                    >
                      {evt}
                      {selectedEvent === evt && (
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

            {/* ── 5. CUSTOM SEMESTER DROPDOWN ── */}
            <div className="custom-dropdown-uni" ref={semesterDropdownRef}>
              <div
                className={`dropdown-trigger-uni ${isSemesterOpen ? "active" : ""}`}
                onClick={() => setIsSemesterOpen(!isSemesterOpen)}
              >
                <CalendarDays size={18} className="icon-left" />
                <span>{selectedSemester || "Select Sem"}</span>
                <ChevronDown
                  size={16}
                  className={`arrow ${isSemesterOpen ? "rotate" : ""}`}
                />
              </div>

              {isSemesterOpen && (
                <div className="dropdown-menu fade-in-up">
                  <div
                    className={`dropdown-item ${selectedSemester === "" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedSemester("");
                      setIsSemesterOpen(false);
                    }}
                  >
                    All Semesters
                  </div>
                  {SEMESTER.map((sem) => (
                    <div
                      key={sem}
                      className={`dropdown-item ${selectedSemester === sem ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedSemester(sem);
                        setIsSemesterOpen(false);
                      }}
                    >
                      {sem}
                      {selectedSemester === sem && (
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
            cursor:
              !selectedEvent || !selectedSemester ? "not-allowed" : "pointer",
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
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="uni-table-grid-row"
                style={{ gridTemplateColumns: reportColumns }}
              >
                <span className="uni-id-text">{student.id}</span>
                <span className="uni-highlight-text">{student.name}</span>
                <span className="uni-event-text" style={{ fontWeight: "500" }}>
                  {student.event}
                </span>{" "}
                {/* ✅ Na-render na ang Event dito */}
                <span>{student.program}</span>
                <span>Year {student.year}</span>
                <span>Section {student.section}</span>
                <span className="uni-sem-text">{student.semester}</span>
              </div>
            ))}
            {filteredStudents.length === 0 && (
              <div className="uni-no-records">
                No entries matched your filter parameters.
              </div>
            )}
          </div>
        </div>

        {/* 2. DITO MO IPAPASA ANG FILTERED DATA PARA TUGMA ANG SCREEN AT PAPEL */}
        <PrintableReport
          students={filteredStudents}
          selectedEvent={selectedEvent}
          selectedSemester={selectedSemester}
          selectedProgram={selectedProgram}
          selectedYear={selectedYear}
          selectedSection={selectedSection}
        />
      </div>
    </>
  );
}
