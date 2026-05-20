import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, AlertTriangle, AlignJustifyIcon  } from "lucide-react";
{/* */}
const INITIAL_MOCK_SCHOOL_YEARS = [
  { id: "SY2023-2024", yearRange: "2023-2024" },
  { id: "SY2024-2025", yearRange: "2024-2025" },
  { id: "SY2025-2026", yearRange: "2025-2026" },
];

export default function SchoolYear() {
  //const [search, setSearch] = useState("");
  const schoolYearColumns = "2fr 2fr 2fr";

  // Modal controllers
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);

  const handleOpenDeleteModal = (schoolYearItem) => {
    setSelectedSchoolYear(schoolYearItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setEvents((prev) => prev.filter((item) => item.id !== selectedEvent.id));
    setIsDeleteModalOpen(false);
    setSelectedEvent(null);
  };
  return (
    <>
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">SCHOOL YEAR</h1>
        </header>

        <div className="filter-container">
          {/*<div className="search-wrapper"></div>*/}

          <div className="filter-row">
            <button className="uni-btn-primary">
              {/*onClick=handleOpenAddForm...*/}
              <Plus size={16} />
              Add School Year
            </button>
          </div>
        </div>
        <div className="uni-table-container">
          <div
            className="table-grid-header"
            style={{ gridTemplateColumns: schoolYearColumns }}
          >
            <span>School Year ID</span>
            <span>Year Range</span>
            <span>Action</span>
          </div>

          <div className="uni-list">
            {INITIAL_MOCK_SCHOOL_YEARS.map((schoolYear) => (
              <div
                key={schoolYear.id}
                className="uni-table-grid-row"
                style={{ gridTemplateColumns: schoolYearColumns }}
              >
                <span className="uni-id-text">{schoolYear.id}</span>
                <span>{schoolYear.yearRange}</span>
                <div
                  className="uni-action-buttons-group"
                  style={{ justifyContent: "flex-start" }}
                >
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

        {/*<div className="uni-modal-overlay">
          <div className="uni-glass-form-card animate-pop-in">
            <button
              type="button"
              className="uni-panel-close-btn"
              onClick={() => setIsPanelOpen(false)}
            >
              <X size={16} />
            </button>

            <div className="uni-form-header">
              <h3 className="uni-form-heading">Create New School Year</h3>
              <p className="uni-form-subheading">
                Setup and register new academic calendar spans
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="uni-form-stack">
              {successMsg && (
                <div className="uni-success-banner">{successMsg}</div>
              )}
              <div className="uni-form-row-flex">
                <FormDropdown
                  label="Status"
                  name="status"
                  options={STATUS_OPTIONS}
                  value={formData.status}
                />
                <FormDropdown
                  label="Semester"
                  name="semester"
                  options={SEMESTER}
                  value={formData.semester}
                />
              </div>
              <button type="submit" className="uni-btn-submit" s>
                Save New School Year
              </button>
            </form>
          </div>
        </div>*/}

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
                <strong>{selectedSchoolYear?.yearRange}</strong>? This action
                cannot be reverted.
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
