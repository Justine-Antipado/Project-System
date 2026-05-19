import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Calendar, ChevronDown, Check, Trash2, QrCode, SquarePen, X, AlertTriangle } from 'lucide-react';
//import './event.css';

const STATUS_OPTIONS = ['Ongoing', 'Completed', 'Cancelled'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SEMESTER = ['1st Sem', '2nd Sem'];

const INITIAL_MOCK_EVENTS = [
  { id: 11, name: 'Assembly', date: '2026-08-01', venue: 'OMSC Gymnasium', status: 'Ongoing', semId: '1st Sem' },
  { id: 12, name: 'Meeting', date: '2025-01-02', venue: 'OMSC Gymnasium', status: 'Completed', semId: '2nd Sem' },
  { id: 13, name: 'IT Day', date: '2025-12-10', venue: 'OMSC Gymnasium', status: 'Completed', semId: '1st Sem' },
  { id: 14, name: 'Meeting', date: '2026-01-06', venue: 'OMSC Gymnasium', status: 'Cancelled', semId: '2nd Sem' },
];

export default function Event() {

  const [events, setEvents] = useState(INITIAL_MOCK_EVENTS);
    const [search, setSearch] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    
    // Modals Controller States
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    
    const [formMode, setFormMode] = useState('add'); 
    const [editingId, setEditingId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
  
    // Form Field State
    const [formData, setFormData] = useState({
      eventName: '',
      eventDate: '',
      venue: '',
      status: 'Select Status',
      semester: 'Select Sem'
    });
    
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
  
    const monthDropdownRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (monthDropdownRef.current && !monthDropdownRef.current.contains(e.target)) {
          setIsMonthOpen(false);
        }
        if (!e.target.closest('.evt-custom-dropdown-container')) {
          setActiveDropdown(null);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const filteredEvents = events.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                            r.venue.toLowerCase().includes(search.toLowerCase());
      
      let matchesMonth = true;
      if (selectedMonth) {
        const eventDateObj = new Date(r.date);
        const eventMonthName = MONTHS[eventDateObj.getMonth()];
        matchesMonth = eventMonthName === selectedMonth;
      }
      return matchesSearch && matchesMonth;
    });
  
    const handleOpenAddForm = () => {
      setFormMode('add');
      setEditingId(null);
      setFormData({
        eventName: '',
        eventDate: '',
        venue: '',
        status: 'Select Status',
        semester: 'Select Sem'
      });
      setErrors({});
      setIsPanelOpen(true);
    };
  
    const handleOpenEditForm = (eventItem) => {
      setFormMode('edit');
      setEditingId(eventItem.id);
      setFormData({
        eventName: eventItem.name,
        eventDate: eventItem.date,
        venue: eventItem.venue,
        status: eventItem.status,
        semester: eventItem.semId
      });
      setErrors({});
      setIsPanelOpen(true);
    };
  
    const handleOpenDeleteModal = (eventItem) => {
      setSelectedEvent(eventItem);
      setIsDeleteModalOpen(true);
    };
  
    const handleConfirmDelete = () => {
      setEvents(prev => prev.filter(item => item.id !== selectedEvent.id));
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
    };
  
    const handleOpenQrModal = (eventItem) => {
      if (eventItem.status.toLowerCase() === 'ongoing') {
        setSelectedEvent(eventItem);
        setIsQrModalOpen(true);
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };
  
    const selectOption = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
      setActiveDropdown(null);
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      const newErrors = {};
      
      if (!formData.eventName.trim()) newErrors.eventName = 'Event Name is required.';
      if (!formData.eventDate.trim()) newErrors.eventDate = 'Event Date is required.';
      if (!formData.venue.trim()) newErrors.venue = 'Venue is required.';
      if (formData.status === 'Select Status' || !formData.status) newErrors.status = 'Select Status.';
      if (formData.semester === 'Select Sem' || !formData.semester) newErrors.semester = 'Select Semester.';
  
      setErrors(newErrors);
  
      if (Object.keys(newErrors).length === 0) {
        if (formMode === 'add') {
          const newEvent = {
            id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 11,
            name: formData.eventName,
            date: formData.eventDate,
            venue: formData.venue,
            status: formData.status,
            semId: formData.semester
          };
          setEvents(prev => [newEvent, ...prev]);
          setSuccessMsg('Event Created Successfully!');
        } else {
          setEvents(prev => prev.map(item => item.id === editingId ? {
            ...item,
            name: formData.eventName,
            date: formData.eventDate,
            venue: formData.venue,
            status: formData.status,
            semId: formData.semester
          } : item));
          setSuccessMsg('Event Configuration Updated Successfully!');
        }
        
        setTimeout(() => {
          setSuccessMsg('');
          setIsPanelOpen(false);
        }, 1500);
      }
    };
  
    const FormDropdown = ({ label, name, options, value }) => (
      <div className={`evt-field-group evt-custom-dropdown-container ${errors[name] ? 'evt-has-error' : ''}`}>
        <label className="evt-label-text">{label}</label>
        <div 
          className={`evt-form-input evt-dropdown-trigger ${activeDropdown === name ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(activeDropdown === name ? null : name);
          }}
        >
          <span>{value}</span>
        </div>
        
        {activeDropdown === name && (
          <div className="evt-dropdown-menu-floating">
            {options.map((opt) => (
              <div 
                key={opt} 
                className={`evt-dropdown-item-floating ${value === opt ? 'selected' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault(); 
                  selectOption(name, opt);
                }}
              >
                {opt}
                {value === opt && <Check size={14} className="evt-check-icon" />}
              </div>
            ))}
          </div>
        )}
        {errors[name] && <span className="evt-error-text">{errors[name]}</span>}
      </div>
    );
  
  return (
    <>
    {/* Page title */}
    <div className="event-view fade-in">
      <header className="event-header">
        <h1 className="main-title">EVENTS</h1>
      </header>
    

    {/* Page filter and btn */}
    <div className="filter-container">
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search event..."
                        className="search-input"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
      </div>

      <div className="filter-row">
        <button className="evt-btn-primary" onClick={handleOpenAddForm}>
                        <Plus size={16} />
                        Add Event
                      </button>

    {/* ── CUSTOM DROPDOWN ── */}
        <div className="custom-dropdown-event" ref={monthDropdownRef}>
          <div
            className={`dropdown-trigger-event ${isMonthOpen ? 'active' : ''}`} 
            onClick={() => setIsMonthOpen(!isMonthOpen)}
          >
            <Calendar size={18} className="icon-left" />
            <span>{selectedMonth || 'Select Month'}</span>
            <ChevronDown size={16} className={`arrow ${isMonthOpen ? 'rotate' : ''}`} />
          </div>

          {isMonthOpen && (
            <div className="dropdown-menu fade-in-up">
              <div 
                className={`dropdown-item ${selectedMonth === '' ? 'selected' : ''}`}
                onClick={() => { setSelectedMonth(''); setIsOpen(false); }}
              >
                All Months
              </div>
              {MONTHS.map(m => (
                <div 
                  key={m} 
                  className={`dropdown-item ${selectedMonth === m ? 'selected' : ''}`}
                  onClick={() => { setSelectedMonth(m); setIsOpen(false); }}
                >
                  {m}
                  {selectedMonth === m && <Check size={14} className="check-icon" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    <div className="event-table-container">
      <div className="table-grid-header">
            <span>Event ID</span>
            <span>Event Name</span>
            <span>Date</span>
            <span>Venue</span>
            <span>Status</span>
            <span>Semester ID</span>
            <span className="text-right-aligned">Action</span>
          </div>

          <div className="event-list">
            {filteredEvents.map((event) => {
                          const isOngoing = event.status.toLowerCase() === 'ongoing';
                          return (
                            <div key={event.id} className="evt-table-grid-row">
                              <span className="evt-id-text">{event.id}</span>
                              <span className="evt-highlight-text">{event.name}</span>
                              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                              <span>{event.venue}</span>
                              <div>
                                <span className={`evt-status-badge ${event.status.toLowerCase()}`}>
                                  {event.status}
                                </span>
                              </div>
                              <span className="evt-sem-text">{event.semId}</span>
                              <div className="evt-action-buttons-group">
                                <button 
                                  className="evt-action-btn delete" 
                                  title="Delete Event"
                                  onClick={() => handleOpenDeleteModal(event)}
                                >
                                  <Trash2 size={16} />
                                </button>
                                
                                <button 
                                  className={`evt-action-btn qr ${isOngoing ? 'active-qr' : 'disabled-qr'}`} 
                                  title={isOngoing ? "Active QR Scanner" : "QR Only Available for Ongoing Events"}
                                  disabled={!isOngoing}
                                  onClick={() => handleOpenQrModal(event)}
                                >
                                  <QrCode size={16} />
                                </button>
            
                                <button 
                                  className={`evt-action-btn edit ${editingId === event.id ? 'active-edit' : ''}`} 
                                  title="Edit Configuration"
                                  onClick={() => handleOpenEditForm(event)}
                                >
                                  <SquarePen size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {filteredEvents.length === 0 && (
                          <div className="evt-no-records">No entries matched your filter parameters.</div>
                        )}
          </div>
    </div>

    {/* MODAL 1: Form Multi-purpose Panel Overlay */}
          {isPanelOpen && (
            <div className="evt-modal-overlay" onClick={() => setIsPanelOpen(false)}>
              <div className="evt-glass-form-card animate-pop-in" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="evt-panel-close-btn" onClick={() => setIsPanelOpen(false)}>
                  <X size={16} />
                </button>
    
                <div className="evt-form-header">
                  <h3 className="evt-form-heading">
                    {formMode === 'add' ? 'Create New Event' : `Modify Event #${editingId}`}
                  </h3>
                  <p className="evt-form-subheading">
                    {formMode === 'add' ? 'Setup and register new campus events' : 'Alter values for this event entry'}
                  </p>
                </div>
    
                <form onSubmit={handleFormSubmit} className="evt-form-stack">
                  {successMsg && <div className="evt-success-banner">{successMsg}</div>}
                  
                  <div className="evt-field-group">
                    <label className="evt-label-text">Event Name</label>
                    <input 
                      type="text" 
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      className={`evt-form-input ${errors.eventName ? 'error-ring' : ''}`}
                      placeholder="e.g. Acquaintance Party" 
                    />
                    {errors.eventName && <span className="evt-error-text">{errors.eventName}</span>}
                  </div>
    
                  <div className="evt-form-row-flex">
                    <div className="evt-field-group">
                      <label className="evt-label-text">Event Date</label>
                      <input 
                        type="date" 
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className={`evt-form-input ${errors.eventDate ? 'error-ring' : ''}`}
                      />
                      {errors.eventDate && <span className="evt-error-text">{errors.eventDate}</span>}
                    </div>
                    
                    <div className="evt-field-group">
                      <label className="evt-label-text">Venue</label>
                      <input 
                        type="text" 
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        className={`evt-form-input ${errors.venue ? 'error-ring' : ''}`}
                        placeholder="OMSC Gym" 
                      />
                      {errors.venue && <span className="evt-error-text">{errors.venue}</span>}
                    </div>
                  </div>
    
                  <div className="evt-form-row-flex">
                     <FormDropdown label="Status" name="status" options={STATUS_OPTIONS} value={formData.status} />
                     <FormDropdown label="Semester" name="semester" options={SEMESTER} value={formData.semester} />
                  </div>
    
                  <button type="submit" className="evt-btn-submit">
                    {formMode === 'add' ? 'Save New Event' : 'Apply Alterations'}
                  </button>
                </form>
              </div>
            </div>
          )}

    {/* MODAL 2: Delete Secure Confirmation Panel */}
          {isDeleteModalOpen && (
            <div className="evt-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
              <div className="evt-confirm-modal-card animate-pop-in" onClick={(e) => e.stopPropagation()}>
                <div className="evt-confirm-icon-wrapper">
                  <AlertTriangle size={28} className="warn-icon" />
                </div>
                <h4>Confirm Deletion</h4>
                <p>Are you sure you want to permanently remove <strong>{selectedEvent?.name}</strong>? This action cannot be reverted.</p>
                <div className="evt-confirm-actions">
                  <button className="evt-btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                  <button className="evt-btn-danger-confirm" onClick={handleConfirmDelete}>Delete Record</button>
                </div>
              </div>
            </div>
          )}
    
          
    //</div>
    </div>
    
    </>
  );
}