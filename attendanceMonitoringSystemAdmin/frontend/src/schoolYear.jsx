import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, AlertTriangle, X, Check } from "lucide-react";

const INITIAL_MOCK_SCHOOL_YEARS = [
  { id: "SY2025-2026", yearRange: "2025-2026" },
  { id: "SY2024-2025", yearRange: "2024-2025" },
  { id: "SY2023-2024", yearRange: "2023-2024" },
];

export default function SchoolYear() {
  const schoolYearColumns = "2fr 2fr 2fr";

  useEffect(() => {
      const handleClickOutside = (e) => {
        if (!e.target.closest(".uni-custom-dropdown-container")) {
          setActiveDropdown(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  // Data List State
  const [schoolYears, setSchoolYears] = useState(INITIAL_MOCK_SCHOOL_YEARS);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);

  // Modal at Dropdown controllers
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Form Field State gamit ang yearStart at yearEnd
  const [formData, setFormData] = useState({
    yearStart: "",
    yearEnd: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Dropdown Options Setup (2020 hanggang 2035)
  const yearOptions = Array.from({ length: 16 }, (_, i) => 2020 + i);

  const handleOpenDeleteModal = (schoolYearItem) => {
    setSelectedSchoolYear(schoolYearItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setSchoolYears((prev) => prev.filter((item) => item.id !== selectedSchoolYear.id));
    setIsDeleteModalOpen(false);
    setSelectedSchoolYear(null);
  };

  const handleOpenAddForm = () => {
    let nextStart = 2026; // Default fallback kung walang laman ang listahan

    if (schoolYears.length > 0) {
      // Kunin ang pinakahuling taon mula sa unang item ng listahan
      const latestRange = schoolYears[0].yearRange; 
      const parts = latestRange.split("-");
      const latestEndYear = parseInt(parts[1], 10);
      
      if (!isNaN(latestEndYear)) {
        nextStart = latestEndYear; // Ang dulo ng huling SY ang simula ng bagong SY
      }
    }

    // I-pre-fill ang mga dropdown values sa tamang kasunod na taon
    setFormData({
      yearStart: nextStart,
      yearEnd: nextStart + 1,
    });
    
    setErrors({});
    setIsPanelOpen(true);
  };

  const handleFieldFocus = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const selectOption = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Smart Logic: Kapag binago ang yearStart, automatic mag-a-adjust ang yearEnd ng +1
      if (name === "yearStart") {
        updated.yearEnd = value + 1;
      }
      return updated;
    });
    setActiveDropdown(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validations
    if (!formData.yearStart) newErrors.yearStart = "Select Year Start.";
    if (!formData.yearEnd) newErrors.yearEnd = "Select Year End.";
    if (formData.yearStart >= formData.yearEnd) {
      newErrors.yearEnd = "Year End must be greater than Year Start.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const generatedId = `SY${formData.yearStart}-${formData.yearEnd}`;
      const generatedRange = `${formData.yearStart}-${formData.yearEnd}`;

      // Check para iwas duplicate entry
      const isDuplicate = schoolYears.some((sy) => sy.id === generatedId);
      if (isDuplicate) {
        setErrors({ yearStart: "This School Year already exists." });
        return;
      }

      const newSY = {
        id: generatedId,
        yearRange: generatedRange,
      };

      setSchoolYears((prev) => [newSY, ...prev]);
      setSuccessMsg("School Year Created Successfully!");

      setTimeout(() => {
        setSuccessMsg("");
        setIsPanelOpen(false);
      }, 1500);
    }
  };

  // Dropdown Component Block (Inayos para sa numeric at custom values)
  const FormDropdown = ({ label, name, options, value }) => (
    <div className={`uni-field-group uni-custom-dropdown-container ${errors[name] ? "uni-has-error" : ""}`}>
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
              className={`uni-dropdown-item-floating ${value === opt ? "selected" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(name, opt);
              }}
            >
              {opt}
              {value === opt && <Check size={14} className="uni-check-icon" />}
            </div>
          ))}
        </div>
      )}
      {errors[name] && <span className="uni-error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <>
      <div className="uni-view fade-in" onClick={() => setActiveDropdown(null)}>
        <header className="uni-header">
          <h1 className="main-title">SCHOOL YEAR</h1>
        </header>

        <div className="filter-container">
          <div className="filter-row">
            <button className="uni-btn-primary" onClick={handleOpenAddForm}>
              <Plus size={16} />
              Add School Year
            </button>
          </div>
        </div>

        <div className="uni-table-container">
          <div className="table-grid-header" style={{ gridTemplateColumns: schoolYearColumns }}>
            <span>School Year ID</span>
            <span>Year Range</span>
            <span>Action</span>
          </div>

          <div className="uni-list">
            {schoolYears.map((schoolYear) => (
              <div key={schoolYear.id} className="uni-table-grid-row" style={{ gridTemplateColumns: schoolYearColumns }}>
                <span className="uni-id-text">{schoolYear.id}</span>
                <span>{schoolYear.yearRange}</span>
                <div className="uni-action-buttons-group" style={{ justifyContent: "flex-start" }}>
                  <button
                    className="uni-action-btn delete"
                    title="Delete School Year"
                    onClick={() => handleOpenDeleteModal(schoolYear)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL 1: Dropdown Form na may Pre-filled Smart Values */}
        {isPanelOpen && (
          <div className="uni-modal-overlay" onClick={() => setIsPanelOpen(false)}>
            <div className="uni-glass-form-card animate-pop-in" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="uni-panel-close-btn" onClick={() => setIsPanelOpen(false)}>
                <X size={16} />
              </button>

              <div className="uni-form-header">
                <h3 className="uni-form-heading">Create New School Year</h3>
                <p className="uni-form-subheading">
                  Review or adjust the academic calendar span below
                </p>
              </div>

              <form id="schoolYearForm" onSubmit={handleFormSubmit} className="uni-form-stack">
                {successMsg && <div className="uni-success-banner">{successMsg}</div>}
                
                <div className="uni-form-row-flex">
                  <FormDropdown
                    label="Year Start"
                    name="yearStart"
                    options={yearOptions}
                    value={formData.yearStart}
                  />
                  <FormDropdown
                    label="Year End"
                    name="yearEnd"
                    options={yearOptions}
                    value={formData.yearEnd}
                  />
                </div>

                <button type="submit" className="uni-btn-submit">
                  Save New School Year
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Delete Secure Confirmation Panel */}
        {isDeleteModalOpen && (
          <div className="uni-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
            <div className="uni-confirm-modal-card animate-pop-in" onClick={(e) => e.stopPropagation()}>
              <div className="uni-confirm-icon-wrapper">
                <AlertTriangle size={28} className="warn-icon" />
              </div>
              <h4>Confirm Deletion</h4>
              <p>
                Are you sure you want to permanently remove{" "}
                <strong>{selectedSchoolYear?.yearRange}</strong>? This action cannot be reverted.
              </p>
              <div className="uni-confirm-actions">
                <button className="uni-btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button className="uni-btn-danger-confirm" onClick={handleConfirmDelete}>
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