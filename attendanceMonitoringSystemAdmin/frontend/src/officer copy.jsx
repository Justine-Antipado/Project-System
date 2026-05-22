import React, { useState } from "react";
// Assuming you are using lucide-react for your icons based on the syntax
import { Trash2, AlertTriangle } from "lucide-react";

const ORGANIZATION_OPTIONS = ["PADC", "YMO", "CBAM", "SSG", "Club"];
const POSITION_OPTIONS = {
    PADC: [
      "Mayor",
      "Vice Mayor",
      "Secretary",
      "Treasurer",
      "Auditor",
      "Councilor",
      "Other",
    ],
    YMO: [
      "Mayor",
      "Vice Mayor",
      "Secretary",
      "Treasurer",
      "Auditor",
      "Councilor",
      "Other",
    ],
    CBAM: [
      "Mayor",
      "Vice Mayor",
      "Secretary",
      "Treasurer",
      "Auditor",
      "Councilor",
      "Other",
    ],
    SSG: [
      "Governor",
      "Vice Governor",
      "Secretary",
      "Treasurer",
      "Auditor",
      "Other",
    ],
    Club: ["President", "Vice President", "Secretary", "Treasurer", "Other"],
    "Select Org/Club": [],
  };
export default function Officer() {
  // Configured a 5-column grid layout to match your table columns
  const officerColumns = "2fr 2fr 2fr 2fr 1fr";

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [formMode, setFormMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mock data for the table to render safely
  const [officers, setOfficers] = useState([
    {
      id: "1",
      studentId: "STU-2024-001",
      orgId: "ORG-ALPHA",
      position: "President",
    },
    {
      id: "2",
      studentId: "STU-2024-002",
      orgId: "ORG-BETA",
      position: "Vice President",
    },
  ]);

  const handleOpenAddForm = () => {
    setFormMode("add");
    setEditingId(null);
    setFormData({
      eventName: "",
      eventDate: "",
      venue: "",
      status: "Status",
      program: "Program",
      semester: "Semester",
    });
    setErrors({});
    setIsPanelOpen(true);
  };

  const handleOpenEditForm = (eventItem) => {
    setFormMode("edit");
    setEditingId(eventItem.id);
    setFormData({
      eventName: eventItem.name,
      eventDate: eventItem.date,
      venue: eventItem.venue,
      status: eventItem.status,
      program: eventItem.Program,
      semester: eventItem.semId,
    });
    setErrors({});
    setIsPanelOpen(true);
  };

  const handleOpenDeleteModal = (officer) => {
    setSelectedOfficer(officer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setOfficers(officers.filter((off) => off.id !== selectedOfficer.id));
    setIsDeleteModalOpen(false);
    setSelectedOfficer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    //if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFieldFocus = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const selectOption = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
    //if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.eventName.trim())
      newErrors.eventName = "Event Name is required.";
    if (!formData.eventDate.trim())
      newErrors.eventDate = "Event Date is required.";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required.";
    if (formData.status === "Status" || !formData.status)
      newErrors.status = "Select Status.";
    if (formData.program === "Program" || !formData.program)
      newErrors.program = "Select Program.";
    if (formData.semester === "Semester" || !formData.semester)
      newErrors.semester = "Select Semester.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (formMode === "add") {
        const newEvent = {
          id: events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 11,
          name: formData.eventName,
          date: formData.eventDate,
          venue: formData.venue,
          status: formData.status,
          Program: formData.program,
          semId: formData.semester,
        };
        setEvents((prev) => [newEvent, ...prev]);
        setSuccessMsg("Event Created Successfully!");
      } else {
        setEvents((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: formData.eventName,
                  date: formData.eventDate,
                  venue: formData.venue,
                  status: formData.status,
                  semId: formData.semester,
                }
              : item,
          ),
        );
        setSuccessMsg("Event Configuration Updated Successfully!");
      }

      setTimeout(() => {
        setSuccessMsg("");
        setIsPanelOpen(false);
      }, 1500);
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
        <span>{value}</span>
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
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">OFFICER</h1>
        </header>

        {/* Page filter and btn */}
        <div className="filter-container">
          <div className="search-wrapper"></div>

          <div className="filter-row">
            <button className="uni-btn-primary">
              {/*onClick=handleOpenAddForm...*/}
              <Plus size={16} />
              Add Officer
            </button>
          </div>
        </div>

        <div className="uni-table-container">
          {/* Applied gridTemplateColumns dynamically to the header */}
          <div
            className="table-grid-header"
            style={{ display: "grid", gridTemplateColumns: officerColumns }}
          >
            <span>Officers ID</span>
            <span>Student ID</span>
            <span>Organization ID</span>
            <span>Position</span>
            <span>Action</span>
          </div>

          <div className="uni-list">
            {/* Applied gridTemplateColumns dynamically to each data row */}
            {officers.map((officer) => (
              <div
                className="uni-table-grid-row"
                key={officer.id}
                style={{ display: "grid", gridTemplateColumns: officerColumns }}
              >
                <span className="uni-id-text">{officer.id}</span>
                <span>{officer.studentId}</span>
                <span>{officer.orgId}</span>
                <span>{officer.position}</span>
                <div
                  className="uni-action-buttons-group"
                  style={{ justifyContent: "flex-start" }}
                >
                  <button
                    className="uni-action-btn delete"
                    title="Delete Officer"
                    onClick={() => handleOpenDeleteModal(officer)}
                  >
                    {/* Dinagdag ang Edit button na sumusunod sa pattern mo */}
                  <button className="uni-action-btn edit" title="Edit Officer" onClick={() => handleOpenEditForm(officer)}>
                    <svg size={16} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL 1: Form Multi-purpose Panel Overlay */}
        {isPanelOpen && (
          <div
            className="uni-modal-overlay"
            onClick={() => setIsPanelOpen(false)}
          >
            <div
              className="uni-glass-form-card animate-pop-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="uni-panel-close-btn"
                onClick={() => setIsPanelOpen(false)}
              >
                <X size={16} />
              </button>

              <div className="uni-form-header">
                <h3 className="uni-form-heading">
                  {formMode === "add"
                    ? "Create New Event"
                    : `Modify Event #${editingId}`}
                </h3>
                <p className="uni-form-subheading">
                  {formMode === "add"
                    ? "Setup and register new campus events"
                    : "Alter values for this event entry"}
                </p>
              </div>
              <form onSubmit={handleFormSubmit} className="uni-form-stack">
                {successMsg && (
                  <div className="uni-success-banner">{successMsg}</div>
                )}
                <div className="uni-field-group">
                  <label className="uni-label-text">Studend ID No.</label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    className={`uni-form-input ${errors.eventName ? "error-ring" : ""}`}
                    placeholder="e.g. Acquaintance Party"
                    onFocus={() => handleFieldFocus("eventName")}
                  />
                  {errors.eventName && (
                    <span className="uni-error-text">{errors.eventName}</span>
                  )}
                </div>
                <div className="uni-form-row-flex">
                  <FormDropdown
                    label="Organization"
                    name="organization"
                    options={PROGRAM_OPTIONS}
                    value={formData.program}
                  />
                  <FormDropdown
                    label="Position"
                    name="position"
                    options={SEMESTER}
                    value={formData.semester}
                  />
                </div>
                <button type="submit" className="uni-btn-submit">
                  {formMode === "add" ? "Save New Event" : "Apply Alterations"}
                </button>
              </form>
            </div>
          </div>
        )}

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
                Are you sure you want to permanently remove the officer with ID{" "}
                <strong>{selectedOfficer?.id}</strong> (
                {selectedOfficer?.position})? This action cannot be reverted.
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
