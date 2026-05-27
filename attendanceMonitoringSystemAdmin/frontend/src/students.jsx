import React, { useState, useRef, useEffect } from "react";
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
  X,
} from "lucide-react";
import axios from "axios";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

const PROGRAMS = ["BSIT", "BEED", "BSOA", "BSBA"];
const YEAR_LEVELS = [1, 2, 3, 4];
const SECTIONS = ["A", "B", "C", "D"];

export default function Student() {
  const studentColumns = "1fr 1.2fr 1.5fr 1.5fr 1.2fr 1fr 1fr 1fr 1.2fr";

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // ── DROPDOWN FILTERS STATES ──
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const programDropdownRef = useRef(null);

  const [selectedYear, setSelectedYear] = useState("");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearDropdownRef = useRef(null);

  const [selectedSection, setSelectedSection] = useState("");
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const sectionDropdownRef = useRef(null);

  // ── MODALS & FORMS CONTROL STATES ──
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudentForDelete, setSelectedStudentForDelete] =
    useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("edit");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    schoolIdNo: "",
    program: "",
    yearLevel: "",
    section: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // ── READ: FETCH & MAP DATABASE RECORDS ──
  const fetchStudents = () => {
    axios
      .get(`${API}/showStudent.php`)
      .then((res) => {
        if (res.data.status === "success") {
          const mappedStudents = res.data.data.map((dbStudent) => ({
            id: dbStudent.StudentID || dbStudent.id,
            schoolIdNo: dbStudent.SchoolIDNo || dbStudent.schoolIdNo,
            firstName: dbStudent.FirstName || dbStudent.firstName,
            lastName: dbStudent.LastName || dbStudent.lastName,
            middleName: dbStudent.MiddleName || dbStudent.middleName,
            program: dbStudent.Program || dbStudent.program,
            yearLevel: Number(dbStudent.YearLevel || dbStudent.yearLevel),
            section: dbStudent.Section || dbStudent.section,
          }));
          setStudents(mappedStudents);
        }
      })
      .catch((err) => console.error("Error reading database records:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
      if (!event.target.closest(".uni-custom-dropdown-container")) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── SEARCH AND FILTER LOGIC ──
  const filteredStudents = students.filter((student) => {
    const fullName =
      `${student.firstName} ${student.lastName} ${student.middleName}`.toLowerCase();
    const matchesSearch =
      student.schoolIdNo.toLowerCase().includes(search.toLowerCase()) ||
      fullName.includes(search.toLowerCase());

    const matchesProgram =
      selectedProgram === "" || student.program === selectedProgram;
    const matchesYear =
      selectedYear === "" || student.yearLevel === Number(selectedYear);
    const matchesSection =
      selectedSection === "" || student.section === selectedSection;

    return matchesSearch && matchesProgram && matchesYear && matchesSection;
  });

  // ── ACTION HANDLERS ──
  const handleOpenDeleteModal = (studentItem) => {
    setSelectedStudentForDelete(studentItem);
    setIsDeleteModalOpen(true);
  };

  // ── DELETE: BACKEND DISPATCH ──
  const handleConfirmDelete = () => {
    axios
      .post(`${API}/deleteStudent.php`, { id: selectedStudentForDelete.id })
      .then((res) => {
        if (res.data.status === "success") {
          setStudents((prev) =>
            prev.filter((item) => item.id !== selectedStudentForDelete.id),
          );
          setIsDeleteModalOpen(false);
          setSelectedStudentForDelete(null);
        } else {
          alert("Failed to delete record: " + res.data.message);
        }
      })
      .catch((err) => console.error("Error deleting student:", err));
  };

  const handleOpenEditForm = (studentItem) => {
    setFormMode("edit");
    setEditingId(studentItem.id);
    setFormData({
      firstName: studentItem.firstName,
      lastName: studentItem.lastName,
      middleName: studentItem.middleName,
      schoolIdNo: studentItem.schoolIdNo,
      program: studentItem.program,
      yearLevel: studentItem.yearLevel.toString(),
      section: studentItem.section,
    });
    setErrors({});
    setIsFormModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldFocus = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const selectOption = (name, opt) => {
    setFormData((prev) => ({ ...prev, [name]: opt }));
    setActiveDropdown(null);
  };

  // ── UPDATE: BACKEND DISPATCH ──
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last Name is required.";
    if (!formData.schoolIdNo.trim())
      newErrors.schoolIdNo = "School ID No. is required.";
    if (!formData.program) newErrors.program = "Please select a Program.";
    if (!formData.yearLevel)
      newErrors.yearLevel = "Please select a Year Level.";
    if (!formData.section) newErrors.section = "Please select a Section.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        id: editingId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        schoolIdNo: formData.schoolIdNo,
        program: formData.program,
        yearLevel: Number(formData.yearLevel),
        section: formData.section,
      };

      axios
        .post(`${API}/updateStudent.php`, payload)
        .then((res) => {
          if (res.data.status === "success") {
            setStudents((prev) =>
              prev.map((item) =>
                item.id === editingId ? { ...item, ...payload } : item,
              ),
            );
            setSuccessMsg("Student Record Updated Successfully!");
            setTimeout(() => {
              setSuccessMsg("");
              setIsFormModalOpen(false);
              setEditingId(null);
            }, 1500);
          } else {
            alert("Database update error: " + res.data.message);
          }
        })
        .catch((err) => console.error("Error updating student record:", err));
    }
  };

  const FormDropdown = ({ label, name, options, value }) => (
    <div
      className={`uni-field-group uni-custom-dropdown-container ${errors[name] ? "uni-has-error" : ""}`}
    >
      <label className="uni-label-text">{label}</label>
      <div
        className={`uni-form-input uni-dropdown-trigger ${errors[name] ? "error-ring" : ""} ${activeDropdown === name ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          handleFieldFocus(name);
          setActiveDropdown(activeDropdown === name ? null : name);
        }}
      >
        <span>{value || `Select ${label}`}</span>
      </div>

      {activeDropdown === name && (
        <div className="uni-dropdown-menu-floating">
          {options.map((opt) => (
            <div
              key={opt}
              className={`uni-dropdown-item-floating ${value === opt || value === opt.toString() ? "selected" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(name, opt);
              }}
            >
              {opt}
              {(value === opt || value === opt.toString()) && (
                <Check size={14} className="uni-check-icon" />
              )}
            </div>
          ))}
        </div>
      )}
      {errors[name] && <span className="uni-error-text">{errors[name]}</span>}
    </div>
  );

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
            {/* ── PROGRAM FILTER DROPDOWN ── */}
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

            {/* ── YEAR LEVEL FILTER DROPDOWN ── */}
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

            {/* ── SECTION FILTER DROPDOWN ── */}
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

        {/* ── STUDENTS DATA TABLE ── */}
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
                  <span className="uni-id-text">ID-{student.id}</span>
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
              <div className="uni-no-records">No student records found.</div>
            )}
          </div>
        </div>

        {/* ── MODAL 1: STUDENT FORM PANEL OVERLAY ── */}
        {isFormModalOpen && (
          <div
            className="uni-modal-overlay"
            onClick={() => setIsFormModalOpen(false)}
          >
            <div
              className="uni-glass-form-card animate-pop-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="uni-panel-close-btn"
                onClick={() => setIsFormModalOpen(false)}
              >
                <X size={16} />
              </button>

              <div className="uni-form-header">
                <h3 className="uni-form-heading">
                  {formMode === "add"
                    ? "Create New Student"
                    : `Modify Student Record (ID${editingId})`}
                </h3>
                <p className="uni-form-subheading">
                  {formMode === "add"
                    ? "Register a new profile"
                    : "Alter attributes for this structural profile entry"}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="uni-form-stack">
                {successMsg && (
                  <div className="uni-success-banner">{successMsg}</div>
                )}

                <div className="uni-form-row-flex">
                  <div className="uni-field-group">
                    <label className="uni-label-text">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`uni-form-input ${errors.firstName ? "error-ring" : ""}`}
                      placeholder="e.g. John"
                      onFocus={() => handleFieldFocus("firstName")}
                    />
                    {errors.firstName && (
                      <span className="uni-error-text">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="uni-field-group">
                    <label className="uni-label-text">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`uni-form-input ${errors.lastName ? "error-ring" : ""}`}
                      placeholder="e.g. Doe"
                      onFocus={() => handleFieldFocus("lastName")}
                    />
                    {errors.lastName && (
                      <span className="uni-error-text">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="uni-form-row-flex">
                  <div className="uni-field-group">
                    <label className="uni-label-text">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="uni-form-input"
                      placeholder="e.g. M."
                    />
                  </div>

                  <div className="uni-field-group">
                    <label className="uni-label-text">School ID No.</label>
                    <input
                      type="text"
                      name="schoolIdNo"
                      value={formData.schoolIdNo}
                      onChange={handleInputChange}
                      className={`uni-form-input ${errors.schoolIdNo ? "error-ring" : ""}`}
                      placeholder="e.g. 2024-0000"
                      onFocus={() => handleFieldFocus("schoolIdNo")}
                    />
                    {errors.schoolIdNo && (
                      <span className="uni-error-text">
                        {errors.schoolIdNo}
                      </span>
                    )}
                  </div>
                </div>

                <div className="uni-form-row-flex">
                  <FormDropdown
                    label="Program"
                    name="program"
                    options={PROGRAMS}
                    value={formData.program}
                  />
                  <FormDropdown
                    label="Year Level"
                    name="yearLevel"
                    options={YEAR_LEVELS}
                    value={formData.yearLevel}
                  />
                  <FormDropdown
                    label="Section"
                    name="section"
                    options={SECTIONS}
                    value={formData.section}
                  />
                </div>

                <button type="submit" className="uni-btn-submit">
                  {formMode === "add"
                    ? "Save Student Profile"
                    : "Apply Alterations"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL 2: DELETE CONFIRMATION OVERLAY ── */}
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
