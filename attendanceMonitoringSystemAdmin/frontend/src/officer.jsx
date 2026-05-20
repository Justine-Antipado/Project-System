import React, { useState } from "react";
// Assuming you are using lucide-react for your icons based on the syntax
import { Trash2, AlertTriangle } from "lucide-react";

export default function Officer() {
  // Configured a 5-column grid layout to match your table columns
  const officerColumns = "2fr 2fr 2fr 2fr 1fr"; 
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // Mock data for the table to render safely
  const [officers, setOfficers] = useState([
    { id: "1", studentId: "STU-2024-001", orgId: "ORG-ALPHA", position: "President" },
    { id: "2", studentId: "STU-2024-002", orgId: "ORG-BETA", position: "Vice President" },
  ]);

  const handleOpenDeleteModal = (officer) => {
    setSelectedOfficer(officer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setOfficers(officers.filter(off => off.id !== selectedOfficer.id));
    setIsDeleteModalOpen(false);
    setSelectedOfficer(null);
  };

  return (
    <>
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">OFFICER</h1>
        </header>

        <div className="uni-table-container">
          {/* Applied gridTemplateColumns dynamically to the header */}
          <div 
            className="table-grid-header" 
            style={{ display: "grid", gridTemplateColumns: officerColumns }}
          >
            <span>Officers ID</span>
            <span>Student ID</span>
            <span>Org ID</span>
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
                <div className="uni-action-buttons-group" style={{ justifyContent: "flex-start" }}>
                  <button
                    className="uni-action-btn delete"
                    title="Delete Officer"
                    onClick={() => handleOpenDeleteModal(officer)}
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
                Are you sure you want to permanently remove the officer with ID{" "}
                <strong>{selectedOfficer?.id}</strong> ({selectedOfficer?.position})? 
                This action cannot be reverted.
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