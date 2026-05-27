import React, { useState, useEffect, useRef } from "react";
import { Trash2, AlertTriangle, X, Check, Plus, SquarePen } from "lucide-react";
import axios from "axios";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

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
};
const DEFAULT_POSITIONS = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Auditor",
  "Other",
];

export default function Officer() {
  const officerColumns = "2fr 2fr 2fr 2fr 1fr";

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [formMode, setFormMode] = useState("add");
  const [editingId, setEditingId] = useState(null);

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    organization: "Select Org/Club",
    position: "Select Position",
  });

  const [officers, setOfficers] = useState([]);
  const [organizationOptions, setOrganizationOptions] = useState([]);

  // ─── Fetch ───────────────────────────────────────────────────────────────

  const fetchOfficers = async () => {
    try {
      const res = await axios.get(`${API}/getOfficers.php`);
      if (res.data.success) {
        const mapped = res.data.data.map((o) => ({
          id: String(o.OfficersID),
          studentId: o.SchoolIDNo,
          orgId: o.OrgName,
          position: o.Position,
        }));
        setOfficers(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch officers:", err);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${API}/getOrganizations.php`);
      if (res.data.success === true) {
        setOrganizationOptions(res.data.data.map((org) => org.OrgName));
      }
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    }
  };

  useEffect(() => {
    fetchOfficers();
    fetchOrganizations();
  }, []);

  // ─── Click outside dropdown ───────────────────────────────────────────────

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".uni-custom-dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Form Handlers ────────────────────────────────────────────────────────

  const handleOpenAddForm = () => {
    setFormMode("add");
    setEditingId(null);
    setFormData({
      studentId: "",
      organization: "Select Org/Club",
      position: "Select Position",
    });
    setErrors({});
    setIsPanelOpen(true);
  };

  const handleOpenEditForm = (officerItem) => {
    setFormMode("edit");
    setEditingId(officerItem.id);
    setFormData({
      studentId: officerItem.studentId,
      organization: officerItem.orgId,
      position: officerItem.position,
    });
    setErrors({});
    setIsPanelOpen(true);
  };

  const handleOpenDeleteModal = (officer) => {
    setSelectedOfficer(officer);
    setIsDeleteModalOpen(true);
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

  const selectOption = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "organization") updated.position = "Select Position";
      return updated;
    });
    setActiveDropdown(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.studentId.trim())
      newErrors.studentId = "Student ID is required.";
    if (formData.organization === "Select Org/Club" || !formData.organization)
      newErrors.organization = "Select Organization.";
    if (formData.position === "Select Position" || !formData.position)
      newErrors.position = "Select Position.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (formMode === "add") {
          const payload = new FormData();
          payload.append("schoolIDNo", formData.studentId.trim());
          payload.append("orgName", formData.organization);
          payload.append("position", formData.position);

          const res = await axios.post(`${API}/addOfficer.php`, payload);
          if (res.data.success) {
            const d = res.data.data;
            setOfficers((prev) => [
              {
                id: String(d.OfficersID),
                studentId: d.SchoolIDNo,
                orgId: d.OrgName,
                position: d.Position,
              },
              ...prev,
            ]);
            setSuccessMsg("Officer Created Successfully!");
          }
        } else {
          const payload = new FormData();
          payload.append("officersId", editingId);
          payload.append("orgName", formData.organization);
          payload.append("position", formData.position);

          const res = await axios.post(`${API}/editOfficer.php`, payload);
          if (res.data.success) {
            setOfficers((prev) =>
              prev.map((item) =>
                item.id === editingId
                  ? {
                      ...item,
                      orgId: formData.organization,
                      position: formData.position,
                    }
                  : item,
              ),
            );
            setSuccessMsg("Officer Updated Successfully!");
          }
        }

        setTimeout(() => {
          setSuccessMsg("");
          setIsPanelOpen(false);
        }, 1500);
      } catch (err) {
        const data = err.response?.data;
        if (data?.field) {
          // ✅ Show under the specific field (e.g. studentId)
          setErrors({ [data.field]: data.message });
        } else {
          // Fallback to global banner for other server errors
          setErrors({
            global: data?.message || "Server error. Please try again.",
          });
        }
      }
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const payload = new FormData();
      payload.append("officersId", selectedOfficer.id);
      const res = await axios.post(`${API}/deleteOfficer.php`, payload);
      if (res.data.success) {
        setOfficers(officers.filter((o) => o.id !== selectedOfficer.id));
        setIsDeleteModalOpen(false);
        setSelectedOfficer(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ─── Sub-component ────────────────────────────────────────────────────────

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
        <div
          className="uni-dropdown-menu-floating"
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`.uni-dropdown-menu-floating::-webkit-scrollbar { display: none; }`}</style>
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

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <div className="uni-view fade-in" onClick={() => setActiveDropdown(null)}>
        <header className="uni-header">
          <h1 className="main-title">OFFICER</h1>
        </header>

        <div className="filter-container">
          <div className="filter-row">
            <button className="uni-btn-primary" onClick={handleOpenAddForm}>
              <Plus size={16} />
              Add Officer
            </button>
          </div>
        </div>

        <div className="uni-table-container">
          <div
            className="table-grid-header"
            style={{ display: "grid", gridTemplateColumns: officerColumns }}
          >
            <span>Officers ID</span>
            <span>Student ID</span>
            <span>Organization</span>
            <span>Position</span>
            <span>Action</span>
          </div>

          <div className="uni-list">
            {officers.map((officer) => (
              <div
                className="uni-table-grid-row"
                key={officer.id}
                style={{ display: "grid", gridTemplateColumns: officerColumns }}
              >
                <span className="uni-id-text">ID-{officer.id}</span>
                <span>{officer.studentId}</span>
                <span>{officer.orgId}</span>
                <span>{officer.position}</span>
                <div
                  className="uni-action-buttons-group"
                  style={{ justifyContent: "flex-start", gap: "8px" }}
                >
                  <button
                    className="uni-action-btn delete"
                    title="Delete Officer"
                    onClick={() => handleOpenDeleteModal(officer)}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    className={`uni-action-btn edit ${editingId === officer.id ? "active-edit" : ""}`}
                    title="Edit Officer"
                    onClick={() => handleOpenEditForm(officer)}
                  >
                    <SquarePen size={16} />
                  </button>
                </div>
              </div>
            ))}
            {officers.length === 0 && (
              <div className="uni-no-records">No officers records found.</div>
            )}
          </div>
        </div>

        {/* MODAL 1: Add / Edit Panel */}
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
                    ? "Create New Officer"
                    : `Modify Officer ID-${editingId}`}
                </h3>
                <p className="uni-form-subheading">
                  {formMode === "add"
                    ? "Setup and register new organization officers"
                    : "Alter values for this officer entry"}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="uni-form-stack">
                {successMsg && (
                  <div className="uni-success-banner">{successMsg}</div>
                )}
                {errors.global && (
                  <div
                    className="uni-error-banner"
                    style={{
                      color: "white",
                      backgroundColor: "#e63946",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "15px",
                      textAlign: "center",
                    }}
                  >
                    {errors.global}
                  </div>
                )}

                <div className="uni-field-group">
                  <label className="uni-label-text">Student ID No.</label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className={`uni-form-input ${errors.studentId ? "error-ring" : ""}`}
                    placeholder="e.g. 2024-00001"
                    onFocus={() => handleFieldFocus("studentId")}
                    disabled={formMode === "edit"}
                    style={
                      formMode === "edit"
                        ? { opacity: 0.6, cursor: "not-allowed" }
                        : {}
                    }
                  />
                  {errors.studentId && (
                    <span className="uni-error-text">{errors.studentId}</span>
                  )}
                </div>

                <div
                  className="uni-form-row-flex"
                  style={{ display: "flex", gap: "16px" }}
                >
                  <FormDropdown
                    label="Organization"
                    name="organization"
                    options={organizationOptions}
                    value={formData.organization}
                  />
                  <FormDropdown
                    label="Position"
                    name="position"
                    options={
                      POSITION_OPTIONS[formData.organization] ||
                      DEFAULT_POSITIONS
                    }
                    value={formData.position}
                  />
                </div>

                <button type="submit" className="uni-btn-submit">
                  {formMode === "add"
                    ? "Save New Officer"
                    : "Apply Alterations"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Delete Confirmation */}
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
