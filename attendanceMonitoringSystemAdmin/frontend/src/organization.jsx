import React, { useState, useRef, useEffect } from "react";
// Inayos ang import: Idinagdag ang Plus icon para sa bagong button mo
import { Search, Trash2, AlertTriangle, Plus } from "lucide-react";

export default function Organization() {
  const [search, setSearch] = useState("");
  
  // Custom column sizes base sa structure ng table mo
  const orgColumns = "2fr 4fr 1fr";

  // State para sa modal at pagpili ng aalisin na item
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  // Mock data na tumutugma sa iisang row structure mo para gumana ang loop at search
  const [organizations, setOrganizations] = useState([
    { id: "ORG-ALPHA", name: "Alpha Organization" },
    { id: "ORG-BETA", name: "Beta Computer Society" }
  ]);

  // 1. Idinagdag ang handler para sa Add button para hindi ito mag-crash
  const handleOpenAddForm = () => {
    // Dito mo ilalagay ang logic mo pag nag-add (hal. opens an add modal or page redirect)
    alert("Add Organization clicked! Dito mo ilalagay ang setup mo para sa pagdagdag.");
  };

  // Click handler para sa delete button
  const handleOpenDeleteModal = (org) => {
    setSelectedOrganization(org);
    setIsDeleteModalOpen(true);
  };

  // Logic para sa aktwal na pagbura kapag kinumpirma
  const handleConfirmDelete = () => {
    setOrganizations(organizations.filter(org => org.id !== selectedOrganization.id));
    setIsDeleteModalOpen(false);
    setSelectedOrganization(null);
  };

  // Logic para sa real-time filter ng search input mo
  const filteredOrganizations = organizations.filter(org => 
    org.id.toLowerCase().includes(search.toLowerCase()) ||
    org.name.toLowerCase().includes(search.toLowerCase())
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
          <div className="table-grid-header" style={{ display: "grid", gridTemplateColumns: orgColumns }}>
            <span>Organization ID</span>
            <span>Organization Name</span>
            <span>Action</span>
          </div>
          <div className="uni-list">
            {/* Ginamit ang filtered list gamit ang eksaktong HTML structure mo */}
            {filteredOrganizations.map((org) => (
              <div className="uni-table-grid-row" key={org.id} style={{ display: "grid", gridTemplateColumns: orgColumns }}>
                <span className="uni-id-text">{org.id}</span>
                <span className="uni-highlight-text">{org.name}</span>
                <div className="uni-action-buttons-group">
                  <button
                    className="uni-action-btn delete"
                    title="Delete Organization"
                    onClick={() => handleOpenDeleteModal(org)} // Inayos mula schoolYear papuntang org object
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
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
                <strong>{selectedOrganization?.name}</strong>? This action cannot be
                reverted. {/* Inayos ang variable mula selectedEvent papuntang selectedOrganization */}
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