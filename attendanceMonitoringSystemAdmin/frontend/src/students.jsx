import React, { useState, useRef, useEffect } from "react";
// Lahat ng kailangang icons para sa student structure at actions
import {
  Search,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronDown,
  Check,
  Trash2,
  SquarePen,
  AlertTriangle,
} from "lucide-react";

// Inayos ang mock data para umayon sa mga sumusunod na haligi ng table records
const INITIAL_MOCK_STUDENTS = [
  {
    id: "STU-001",
    schoolIdNo: "2024-0123",
    firstName: "Ranjet Ayn",
    lastName: "Mulingbayan",
    middleName: "L.",
    program: "BSIT",
    yearLevel: 2,
    section: "B",
  },
  {
    id: "STU-002",
    schoolIdNo: "2024-0567",
    firstName: "John",
    lastName: "Doe",
    middleName: "M.",
    program: "BSBA",
    yearLevel: 3,
    section: "A",
  },
  {
    id: "STU-003",
    schoolIdNo: "2023-0987",
    firstName: "Jane",
    lastName: "Smith",
    middleName: "S.",
    program: "BEED",
    yearLevel: 4,
    section: "C",
  },
];

const PROGRAMS = ["BSIT", "BEED", "BSOA", "BSBA"];
const YEAR_LEVELS = [1, 2, 3, 4];
const SECTIONS = ["A", "B", "C", "D"];

export default function Student() {
  // Inayos ang grid template columns para magkasya nang pantay ang 9 columns ng table
  const studentColumns = "1fr 1.2fr 1.5fr 1.5fr 1.2fr 1fr 1fr 1fr 1.2fr";

  const [students, setStudents] = useState(INITIAL_MOCK_STUDENTS);
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

  // Modal at Editing Controllers
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudentForDelete, setSelectedStudentForDelete] =
    useState(null);
  const [editingId, setEditingId] = useState(null);

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
    // Search filter (tumutugma sa pangalan o School ID)
    const fullName =
      `${student.firstName} ${student.lastName} ${student.middleName}`.toLowerCase();
    const matchesSearch =
      student.schoolIdNo.toLowerCase().includes(search.toLowerCase()) ||
      fullName.includes(search.toLowerCase());

    // Dropdown filters
    const matchesProgram =
      selectedProgram === "" || student.program === selectedProgram;
    const matchesYear =
      selectedYear === "" || student.yearLevel === Number(selectedYear);
    const matchesSection =
      selectedSection === "" || student.section === selectedSection;

    return matchesSearch && matchesProgram && matchesYear && matchesSection;
  });

  // ── HANDLERS FOR ACTIONS ──
  const handleOpenDeleteModal = (studentItem) => {
    setSelectedStudentForDelete(studentItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setStudents((prev) =>
      prev.filter((item) => item.id !== selectedStudentForDelete.id),
    );
    setIsDeleteModalOpen(false);
    setSelectedStudentForDelete(null);
  };

  const handleOpenEditForm = (studentItem) => {
    setEditingId(studentItem.id);
    // Dito mo pwedeng tawagin ang function mo para mag-populate ang edit form base sa iyong kasalukuyang system flow
  };

  return (
    <>
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">STUDENTS</h1>
        </header>

        <div className="filter-container">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search student..."
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
            style={{ gridTemplateColumns: studentColumns }}
          >
            <span>Student ID</span>
            <span>School ID NO.</span>
            <span>First Name</span>
            <span>Last Name</span>
            <span>Middle Name</span>
            <span>Program</span>
            <span>Year Level</span>
            <span>Section</span>
            <span className="text-left-aligned">Action</span>
          </div>

          <div className="uni-list">
            {filteredStudents.map((student) => {
              return (
                <div
                  key={student.id}
                  className="uni-table-grid-row"
                  style={{ gridTemplateColumns: studentColumns }}
                >
                  <span className="uni-id-text">{student.id}</span>
                  <span className="uni-highlight-text">
                    {student.schoolIdNo}
                  </span>
                  <span>{student.firstName}</span>
                  <span>{student.lastName}</span>
                  <span>{student.middleName}</span>
                  <span className="uni-sem-text">{student.program}</span>
                  <span>Year {student.yearLevel}</span>
                  <span>Section {student.section}</span>

                  <div
                    className="uni-action-buttons-group"
                    style={{ justifyContent: "flex-start" }}
                  >
                    <button
                      className="uni-action-btn delete"
                      title="Delete Record"
                      onClick={() => handleOpenDeleteModal(student)}
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      className={`uni-action-btn edit ${editingId === student.id ? "active-edit" : ""}`}
                      title="Edit Record"
                      onClick={() => handleOpenEditForm(student)}
                    >
                      <SquarePen size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredStudents.length === 0 && (
              <div className="uni-no-records">
                No entries matched your filter parameters.
              </div>
            )}
          </div>
        </div>

        {/* MODAL 2: Delete Secure Confirmation Panel */}
        {isDeleteModalOpen && (
          <div
            className="uni-modal-overlay"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <div
              className="uni-confirm-modal-card animate-pop-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="uni-confirm-icon-wrapper">
                <AlertTriangle size={28} className="warn-icon" />
              </div>
              <h4>Confirm Deletion</h4>
              <p>
                Are you sure you want to permanently remove{" "}
                <strong>
                  {selectedStudentForDelete?.firstName}{" "}
                  {selectedStudentForDelete?.lastName}
                </strong>
                ? This action cannot be reverted.
              </p>
              <div className="uni-confirm-actions">
                <button
                  className="uni-btn-cancel"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="uni-btn-danger-confirm"
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
