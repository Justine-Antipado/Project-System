import React, { useState, useEffect } from 'react';
import './event.css';

export default function Event() {
  // ── 1. STATE MANAGEMENT ──
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Custom Dropdown State para sa layout tracking
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // States para sa pagkontrol ng Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // System Notifications
  const [successMsg, setSuccessMsg] = useState('');

  // Error Validation States
  const [errors, setErrors] = useState({});

  // States para sa temporary form data at targets
  const [eventToDelete, setEventToDelete] = useState(null);
  const [currentEvent, setCurrentEvent] = useState({
    id: '',
    name: '',
    date: '',
    venue: '',
    status: 'Active'
  });

  // Default Mock Data
  const [events, setEvents] = useState([
    { id: '11', name: 'Assembly', date: '2026-08-01', venue: 'OMSC Gymnasium', status: 'Active' },
    { id: '12', name: 'Meeting', date: '2025-01-02', venue: 'OMSC Gymnasium', status: 'Done' },
    { id: '13', name: 'IT Day', date: '2025-12-10', venue: 'OMSC Gymnasium', status: 'Done' },
    { id: '14', name: 'Meeting', date: '2026-01-06', venue: 'OMSC Gymnasium', status: 'Done' },
  ]);

  const statusOptions = ['Active', 'Done'];

  // ── 2. LIFE CYCLE & UTILITIES ──
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = (fieldName) => {
    setFocusedField(fieldName);
    if (errors[fieldName]) setErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const selectOption = (name, value) => {
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── 3. MODAL CONTROLS ──
  const openAddModal = () => {
    const nextId = String(events.length > 0 ? Math.max(...events.map(e => Number(e.id))) + 1 : 11);
    setCurrentEvent({ id: nextId, name: '', date: '', venue: '', status: 'Active' });
    setErrors({});
    setIsAddOpen(true);
  };

  const openEditModal = (eventItem) => {
    setCurrentEvent(eventItem);
    setErrors({});
    setActiveDropdown(null);
    setIsEditOpen(true);
  };

  const openDeleteModal = (eventItem) => {
    setEventToDelete(eventItem);
    setIsDeleteOpen(true);
  };

  // ── 4. FORM VALIDATION ENGINE ──
  const validateForm = () => {
    let tempErrors = {};
    if (!currentEvent.name.trim()) tempErrors.name = 'Event Name is required.';
    if (!currentEvent.date) tempErrors.date = 'Event Date is required.';
    if (!currentEvent.venue.trim()) tempErrors.venue = 'Venue location is required.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ── 5. SUBMIT HANDLERS ──
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    if (validateForm()) {
      setEvents([...events, currentEvent]);
      setIsAddOpen(false);
      setSuccessMsg('New Event Registered Successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    if (validateForm()) {
      setEvents(events.map(e => e.id === currentEvent.id ? currentEvent : e));
      setIsEditOpen(false);
      setSuccessMsg('Event Details Updated Successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setIsDeleteOpen(false);
      setEventToDelete(null);
      setSuccessMsg('Event Deleted Successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // ── 6. FILTER & SEARCH LOGIC ──
  const filteredEvents = events.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.venue.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ── 7. REUSABLE DROPDOWN COMPONENT ──
  const CustomDropdown = ({ label, name, options, value }) => (
    <div className={`field-group custom-dropdown-container ${errors[name] ? 'has-error' : ''}`}>
      <label className="label-text">{label}</label>
      <div 
        className={`form-input dropdown-trigger ${activeDropdown === name ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setActiveDropdown(activeDropdown === name ? null : name);
          handleInputFocus(name);
        }}
      >
        <span className="dropdown-trigger-text">{value}</span>
      </div>
      
      {activeDropdown === name && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div 
              key={opt} 
              className="dropdown-item" 
              onMouseDown={(e) => {
                e.preventDefault(); 
                selectOption(name, opt);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="events-view-container fade-in">
      
      {/* ── TOP SEARCH CONTROL BAR ── */}
      <div className="events-search-wrapper">
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Search event..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="event-search-input"
          />
          <span className="search-bar-icon">🔍</span>
        </div>
      </div>

      {successMsg && <div className="success-banner" style={{ maxWidth: '1200px', margin: '1rem auto' }}>{successMsg}</div>}

      {/* ── MAIN EVENTS WORKSPACE ── */}
      <div className="events-table-card glass-card">
        
        <div className="events-action-header">
          <h2 className="events-section-title">Events Management</h2>
          
          <div className="header-controls-group">
            <button className="btn-add-event" onClick={openAddModal}>
              Add Event +
            </button>
            
            {/* Custom Dropdown Filter for Table Header */}
            <div className="custom-dropdown-container">
              <button 
                type="button"
                className={`dropdown-trigger ${activeDropdown === 'tableFilter' ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'tableFilter' ? null : 'tableFilter')}
              >
                <span className="dropdown-trigger-text">{filterStatus === 'All' ? 'All Status' : filterStatus}</span>
              </button>

              {activeDropdown === 'tableFilter' && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={() => { setFilterStatus('All'); setActiveDropdown(null); }}>All Status</div>
                  <div className="dropdown-item" onClick={() => { setFilterStatus('Active'); setActiveDropdown(null); }}>Active</div>
                  <div className="dropdown-item" onClick={() => { setFilterStatus('Done'); setActiveDropdown(null); }}>Done</div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── GRID SYSTEM DATA MATRIX (PREMIUM TABLE STYLE) ── */}
        <div className="events-table-wrapper">
          <table className="event-custom-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Event ID</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No events found in the list.</td>
                </tr>
              ) : (
                filteredEvents.map((eventItem) => (
                  <tr key={eventItem.id}>
                    <td className="event-td-highlight">{eventItem.id}</td>
                    <td>{eventItem.name}</td>
                    <td>
                      {new Date(eventItem.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>{eventItem.venue}</td>
                    <td>
                      <span className={`status-badge-chip ${eventItem.status.toLowerCase()}`}>
                        {eventItem.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-icons-flex">
                        <button className="icon-action-btn edit-btn" onClick={() => openEditModal(eventItem)} title="Edit Event">
                          ✏️
                        </button>
                        <button className="icon-action-btn delete-btn" onClick={() => openDeleteModal(eventItem)} title="Delete Event">
                          🗑️
                        </button>
                        <button 
                          className={`icon-action-btn qr-btn ${eventItem.status === 'Done' ? 'disabled' : ''}`} 
                          disabled={eventItem.status === 'Done'}
                          onClick={() => alert(`Opening QR scanner core for event registration #${eventItem.id}`)}
                          title={eventItem.status === 'Done' ? 'Disabled' : 'Scan QR'}
                        >
                          🔲
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL WINDOW: ADD NEW EVENT ── */}
      {isAddOpen && (
        <div className="events-modal-overlay">
          <div className="glass-card settings-form-block modal-box-layout">
            <div className="settings-form-header">
              <div>
                <h3 className="settings-form-heading">Create New Campus Event</h3>
                <p className="settings-form-subheading">Provide layout execution data context</p>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleAddSubmit}>
              <div className="registration-stack">
                <div className={`field-group ${errors.name ? 'has-error' : ''}`}>
                  <label className="label-text">Event Name</label>
                  <input 
                    type="text" name="name" value={currentEvent.name}
                    onChange={handleInputChange} onFocus={() => handleInputFocus('name')}
                    className="form-input" placeholder="e.g., Acquaintance Party" 
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className={`field-group ${errors.venue ? 'has-error' : ''}`}>
                  <label className="label-text">Event Venue</label>
                  <input 
                    type="text" name="venue" value={currentEvent.venue}
                    onChange={handleInputChange} onFocus={() => handleInputFocus('venue')}
                    className="form-input" placeholder="e.g., OMSC Gymnasium" 
                  />
                  {errors.venue && <span className="error-text">{errors.venue}</span>}
                </div>

                <div className="input-row-flex dropdown-row">
                  <div className={`field-group ${errors.date ? 'has-error' : ''}`}>
                    <label className="label-text">Target Execution Date</label>
                    <input 
                      type="date" name="date" value={currentEvent.date}
                      onChange={handleInputChange} onFocus={() => handleInputFocus('date')}
                      className="form-input" 
                    />
                    {errors.date && <span className="error-text">{errors.date}</span>}
                  </div>
                  
                  <CustomDropdown label="Initial Status" name="status" options={statusOptions} value={currentEvent.status} />
                </div>
              </div>

              <div className="action-buttons" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ width: '40%' }} onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-submit" style={{ width: '60%' }}>
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL WINDOW: EDIT EVENT DETAILS ── */}
      {isEditOpen && (
        <div className="events-modal-overlay">
          <div className="glass-card settings-form-block modal-box-layout">
            <div className="settings-form-header">
              <div>
                <h3 className="settings-form-heading">Modify Event Parameters</h3>
                <p className="settings-form-subheading">Update specific records validation tracks</p>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleEditSubmit}>
              <div className="registration-stack">
                <div className={`field-group ${errors.name ? 'has-error' : ''}`}>
                  <label className="label-text">Event Name</label>
                  <input 
                    type="text" name="name" value={currentEvent.name}
                    onChange={handleInputChange} onFocus={() => handleInputFocus('name')}
                    className="form-input" 
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className={`field-group ${errors.venue ? 'has-error' : ''}`}>
                  <label className="label-text">Event Venue</label>
                  <input 
                    type="text" name="venue" value={currentEvent.venue}
                    onChange={handleInputChange} onFocus={() => handleInputFocus('venue')}
                    className="form-input" 
                  />
                  {errors.venue && <span className="error-text">{errors.venue}</span>}
                </div>

                <div className="input-row-flex dropdown-row">
                  <div className={`field-group ${errors.date ? 'has-error' : ''}`}>
                    <label className="label-text">Target Execution Date</label>
                    <input 
                      type="date" name="date" value={currentEvent.date}
                      onChange={handleInputChange} onFocus={() => handleInputFocus('date')}
                      className="form-input" 
                    />
                    {errors.date && <span className="error-text">{errors.date}</span>}
                  </div>
                  
                  <CustomDropdown label="Operational Status" name="status" options={statusOptions} value={currentEvent.status} />
                </div>
              </div>

              <div className="action-buttons" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ width: '40%' }} onClick={() => setIsEditOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-submit" style={{ width: '60%' }}>
                  Save Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL WINDOW: MODERN DELETE CONFIRMATION ── */}
      {isDeleteOpen && eventToDelete && (
        <div className="events-modal-overlay">
          <div className="glass-card modal-box-layout text-center" style={{ maxWidth: '450px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 className="settings-form-heading" style={{ marginBottom: '0.5rem' }}>Delete Event Entry?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <span style={{ color: '#ffffff', fontWeight: '700' }}>"{eventToDelete.name}"</span>? All related scanner configurations will be disabled.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button type="button" className="btn-secondary" onClick={() => { setIsDeleteOpen(false); setEventToDelete(null); }}>
                Cancel
              </button>
              <button type="button" className="btn-submit" style={{ background: '#ef4444', color: '#ffffff' }} onClick={handleConfirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPONENT LOCAL EFFECTS STYLES ── */}
      <style>{`
        .events-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10, 15, 30, 0.7); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 99999;
          animation: overlayFade 0.2s ease-out;
        }
        .modal-box-layout { width: 90%; maxWidth: 550px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
        .text-center { text-align: center; }
        @keyframes overlayFade { from { opacity: 0; } to { opacity: 1; } }
        
        .btn-add-event, .btn-submit, .btn-secondary, .icon-action-btn { cursor: pointer; transition: all 0.2s ease; }
        .btn-add-event:hover, .btn-submit:hover { filter: brightness(1.15); }
        .btn-add-event:active, .btn-submit:active { transform: scale(0.98); }
        .icon-action-btn:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>

    </div>
  );
}