import React, { useState, useRef, useEffect } from "react";

import {
  Search,
  Trash2,
  AlertTriangle,
  Plus,
  X,
  SquarePen,
} from "lucide-react";

import axios from "axios";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

export default function Organization() {
  const [search, setSearch] = useState("");

  // Idagdag ang formData state para sa Organization
  const [formData, setFormData] = useState({
    orgId: "",
    orgName: "",
  });

  // Custom column sizes base sa structure ng table mo
  const orgColumns = "2fr 4fr 1fr";

  // State para sa modal at pagpili ng aalisin na item
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const [formMode, setFormMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  //const [selectedEvent, setSelectedEvent] = useState(null);

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Mock data na tumutugma sa iisang row structure mo para gumana ang loop at search
  const [organizations, setOrganizations] = useState([]);

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${API}/getOrganizations.php`);
      if (res.data.success === true) {
        const mapped = res.data.data.map((org) => ({
          id: org.OrgID,
          name: org.OrgName,
        }));
        setOrganizations(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);
  // Handler para sa pagpuno sa input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler para sa pag-clear ng error kapag nag-focus ang user
  const handleFieldFocus = (fieldName) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  // Pagbubukas ng Add Form
  const handleOpenAddForm = () => {
    setFormMode("add");
    setEditingId(null);
    setFormData({
      orgId: "", // Kailangan ng ID kapag magdadagdag ng bagong org
      orgName: "",
    });
    setErrors({});
    setIsPanelOpen(true);
  };

  // Click handler para sa delete button
  const handleOpenDeleteModal = (org) => {
    setSelectedOrganization(org);
    setIsDeleteModalOpen(true);
  };

  // Pagbubukas ng Edit Form gamit ang piniling org item
  const handleOpenEditForm = (orgItem) => {
    setFormMode("edit");
    setEditingId(orgItem.id);
    setFormData({
      orgId: orgItem.id,
      orgName: orgItem.name,
    });
    setErrors({});
    setIsPanelOpen(true);
  };

  // Multi-purpose Form Submit Logic
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.orgName.trim()) {
      newErrors.orgName = "Organization Name is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (formMode === "add") {
          const payload = new FormData();
          payload.append("orgName", formData.orgName.trim());
          const res = await axios.post(`${API}/addOrganization.php`, payload);
          if (res.data.success) {
            const { OrgID, OrgName } = res.data.data;
            setOrganizations((prev) => [{ id: OrgID, name: OrgName }, ...prev]);
            setSuccessMsg("Organization Created Successfully!");
          }
        } else {
          const payload = new FormData();
          payload.append("orgId", editingId);
          payload.append("orgName", formData.orgName.trim());
          const res = await axios.post(`${API}/editOrganization.php`, payload);
          if (res.data.success) {
            setOrganizations((prev) =>
              prev.map((item) =>
                item.id === editingId
                  ? { ...item, name: formData.orgName.trim() }
                  : item,
              ),
            );
            setSuccessMsg("Organization Updated Successfully!");
          }
        }

        setTimeout(() => {
          // ✅ Only ONE setTimeout — inside try
          setSuccessMsg("");
          setIsPanelOpen(false);
        }, 1500);
      } catch (error) {
        const msg =
          error.response?.data?.message || "Server error. Please try again.";

        // duplicate organization error
        if (
          msg.includes("already exists") ||
          msg.includes("Another organization")
        ) {
          setErrors({
            orgName: msg,
          });
        } else {
          setErrors({
            global: msg,
          });
        }
      }
      // ✅ Nothing here — the duplicate was removed
    }
  };

  // Logic para sa aktwal na pagbura kapag kinumpirma
  const handleConfirmDelete = async () => {
    try {
      const payload = new FormData();
      payload.append("orgId", selectedOrganization.id);
      const res = await axios.post(`${API}/deleteOrganization.php`, payload);
      if (res.data.success) {
        setOrganizations(
          organizations.filter((org) => org.id !== selectedOrganization.id),
        );
        setIsDeleteModalOpen(false);
        setSelectedOrganization(null);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Logic para sa real-time filter ng search input mo
  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">ORGANIZATION</h1>
        </header>

        <div className="filter-container">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search organization..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <button className="uni-btn-primary" onClick={handleOpenAddForm}>
              <Plus size={16} />
              Add Organization
            </button>
          </div>
        </div>

        <div className="uni-table-container">
          {/* Idinagdag ang inline styling para sumunod sa alignment ang mga haligi ng table */}
          <div
            className="table-grid-header"
            style={{ display: "grid", gridTemplateColumns: orgColumns }}
          >
            <span>Organization ID</span>
            <span>Organization Name</span>
            <span>Action</span>
          </div>
          <div className="uni-list">
            {/* Ginamit ang filtered list gamit ang eksaktong HTML structure mo */}
            {filteredOrganizations.map((org) => (
              <div
                className="uni-table-grid-row"
                key={org.id}
                style={{ display: "grid", gridTemplateColumns: orgColumns }}
              >
                <span className="uni-id-text">ID-{org.id}</span>
                <span className="uni-highlight-text">{org.name}</span>
                <div
                  className="uni-action-buttons-group"
                  style={{ justifyContent: "flex-start" }}
                >
                  <button
                    className="uni-action-btn delete"
                    title="Delete Organization"
                    onClick={() => handleOpenDeleteModal(org)} // Inayos mula schoolYear papuntang org object
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    className={`uni-action-btn edit ${editingId === org.id ? "active-edit" : ""}`}
                    title="Edit Configuration"
                    onClick={() => handleOpenEditForm(org)} // Inayos mula event patungong org
                  >
                    <SquarePen size={16} />
                  </button>
                </div>
              </div>
            ))}
            {filteredOrganizations.length === 0 && (
              <div className="uni-no-records">
                No organization records found.
              </div>
            )}
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
                    ? "Create New Organization"
                    : `Modify Organization ID-${editingId}`}
                </h3>
                <p className="uni-form-subheading">
                  {formMode === "add"
                    ? "Setup and register new organizations"
                    : "Alter values for this organization entry"}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="uni-form-stack">
                {successMsg && (
                  <div className="uni-success-banner">{successMsg}</div>
                )}
                {errors.global && (
                  <div className="uni-error-banner">{errors.global}</div>
                )}
                <div className="uni-field-group">
                  <label className="uni-label-text">Organization Name</label>
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleInputChange}
                    className={`uni-form-input ${errors.orgName ? "error-ring" : ""}`}
                    placeholder="e.g. Acquaintance Party"
                    onFocus={() => handleFieldFocus("orgName")}
                  />
                  {errors.orgName && (
                    <span className="uni-error-text">{errors.orgName}</span>
                  )}
                </div>

                <button type="submit" className="uni-btn-submit">
                  {formMode === "add"
                    ? "Save New Organization"
                    : "Apply Alterations"}
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
                Are you sure you want to permanently remove{" "}
                <strong>{selectedOrganization?.name}</strong>? This action
                cannot be reverted.{" "}
                {/* Inayos ang variable mula selectedEvent papuntang selectedOrganization */}
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
