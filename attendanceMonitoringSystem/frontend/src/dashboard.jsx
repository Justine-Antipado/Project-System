import React, { useState } from 'react';
import { 
  LayoutDashboard, History, Settings, User, Check, X, Camera, 
  LogOut, Info, CalendarCheck, TrendingUp, Maximize2, Eye, EyeOff 
} from 'lucide-react';
import './dashboard.css';
import omscLogo from './assets/omsc.logo.png';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [focusedField, setFocusedField] = useState(null);
  
  // STATE PARA SA EDITABLE PROFILE INFO
  const [profileData, setProfileData] = useState({
    lastName: 'Santiago',
    firstName: 'Ricardo',
    dept: 'CITE',
    program: 'BSIT',
    year: '1st Year'
  });

  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  
  // NEW STATE PARA SA ERROR HANDLING
  const [errors, setErrors] = useState({});

  const handleProfileChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  // LOGIC PARA SA PAG-SUBMIT NG SETTINGS
  const handleUpdateProfile = () => {
    const newErrors = {};
    if (!profileData.lastName) newErrors.lastName = 'Last Name is required';
    if (!profileData.firstName) newErrors.firstName = 'First Name is required';
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Profile Updated Successfully!');
    }
  };

  const validate = (p) => ({
    length: p.length >= 8,
    number: /\d/.test(p),
    special: /[!@#$%^&*]/.test(p),
  });
  const reqs = validate(passData.new);
  const allMet = Object.values(reqs).every(Boolean);

  return (
    <div className="app-layout">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* --- QR FULLSCREEN MODAL --- */}
      {showQRModal && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowQRModal(false)}><X /></button>
            <h2 style={{marginBottom: '1rem', color: 'var(--omsc-dark)'}}>Student QR Code</h2>
            <img src="/qr-placeholder.png" alt="Full QR" className="qr-large" />
            <p style={{marginTop: '1rem', fontWeight: '600'}}>24-1-03962</p>
          </div>
        </div>
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="system-logo"><img src={omscLogo} alt="OMSC Logo" /></div>
          <div className="system-info"><h2 className="system-name">Events Attendance System</h2></div>
        </div>

        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <History size={20} /> Attendance History
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Settings
          </div>
        </nav>

        <div className="logout-section">
          <div className="nav-item logout-btn"><LogOut size={20} /> Logout</div>
        </div>
      </aside>

      <main className="main-content">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-view fade-in">
            <header className="welcome-header">
              <p className="sub-text">Welcome back! 👋</p>
              <h1 className="main-title">DASHBOARD</h1>
            </header>
            <div className="bento-grid">
              <div className="bento-card profile-info-card interactive-card accent-blue">
                <div className="card-header"><Info size={18} className="icon-muted" /> <span>Student Information</span></div>
                <div className="profile-details">
                  <h2 className="student-name">{profileData.lastName}, <br />{profileData.firstName}</h2>
                  <div className="detail-group"><label>ID Number</label><p>24-1-03962</p></div>
                  <div className="detail-group"><label>Program</label><p>{profileData.program}</p></div>
                  <div className="detail-group"><label>Year Level</label><p>{profileData.year}</p></div>
                </div>
              </div>
              <div className="bento-card qr-card interactive-card accent-yellow">
                <div className="qr-wrapper">
                  <div className="qr-container">
                    <img src="/qr-placeholder.png" alt="Student QR Code" className="qr-image" />
                    <div className="qr-scan-line"></div>
                  </div>
                </div>
                <p className="qr-hint">Scan for Attendance</p>
                <button className="btn-action-small" onClick={() => setShowQRModal(true)}>
                  <Maximize2 size={14} style={{marginRight: '5px'}} /> View Fullscreen
                </button>
              </div>
              <div className="bento-card stats-card interactive-card accent-sky" onClick={() => setActiveTab('history')}>
                <div className="card-header"><CalendarCheck size={18} className="icon-blue" /> <span>Total Events Attended</span></div>
                <div className="stats-content"><h2 className="stats-value">12</h2><p className="stats-label">Events</p></div>
                <div className="card-footer-info">Go to History →</div>
              </div>
              <div className="bento-card stats-card interactive-card accent-green">
                <div className="card-header"><TrendingUp size={18} className="icon-green" /> <span>Attendance Rating</span></div>
                <div className="stats-content">
                  <h2 className="stats-value">95%</h2>
                  <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: '95%' }}></div></div>
                  <p className="stats-label rating-excellent">— Excellent</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SETTINGS (UPDATED) */}
        {activeTab === 'settings' && (
          <div className="settings-view fade-in">
            <h2 className="settings-title">Account Settings</h2>
            <div className="settings-grid">
              <div className="glass-card profile-sidebar-card">
                <div className="avatar-section">
                  <div className="avatar-pill-wrapper">
                    <User size={60} color="#ccc" />
                    <label className="camera-badge-pill" htmlFor="pfp-upload">
                      <Camera size={16} /><input type="file" id="pfp-upload" hidden />
                    </label>
                  </div>
                  <h3 className="sidebar-student-name">{profileData.firstName} {profileData.lastName}</h3>
                  <p className="sidebar-student-id">24-1-03962</p>
                </div>
                <button className="btn-save-main" onClick={handleUpdateProfile}>Save Changes</button>
              </div>

              {/* RIGHT SIDE: FORMS */}
      <div className="main-settings-form-container">
        <div className="glass-card form-section-card">
          <h4 className="form-section-title">Edit Profile Information</h4>
          
          <div className="pill-form-row three-cols">
            <div className="pill-form-group">
              <label className="label-text">Dept</label>
              <select className="form-input-pill select-pill" value={profileData.dept} onChange={(e) => handleProfileChange(e, 'dept')}>
                <option>CITE</option><option>COED</option>
              </select>
            </div>
            <div className="pill-form-group">
              <label className="label-text">Program</label>
              <select className="form-input-pill select-pill" value={profileData.program} onChange={(e) => handleProfileChange(e, 'program')}>
                <option>BSIT</option><option>BSIS</option>
              </select>
            </div>
            <div className="pill-form-group">
              <label className="label-text">Year</label>
              <select className="form-input-pill select-pill" value={profileData.year} onChange={(e) => handleProfileChange(e, 'year')}>
                <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
              </select>
            </div>
          </div>

          <div className="pill-form-group">
            <label className="label-text">School ID No.</label>
            <input type="text" className="form-input-pill disabled-bg" value="24-1-03962" readOnly />
          </div>
          
          <div className="pill-form-row">
            <div className="pill-form-group">
              <label className="label-text">Last Name</label>
              <input 
                type="text" className={`form-input-pill ${errors.lastName ? 'error-ring' : ''}`} 
                value={profileData.lastName} 
                onChange={(e) => handleProfileChange(e, 'lastName')}
              />
            </div>
            <div className="pill-form-group">
              <label className="label-text">First Name</label>
              <input 
                type="text" className={`form-input-pill ${errors.firstName ? 'error-ring' : ''}`} 
                value={profileData.firstName} 
                onChange={(e) => handleProfileChange(e, 'firstName')}
              />
            </div>
          </div>
        </div>

                {/* SECURITY SECTION */}
                <div className="glass-card form-section-card">
                  <h4 className="form-section-title">Change Password</h4>
                  <div className="pill-form-group">
                    <label className="label-text">Current Password</label>
                    <input type="password" className="form-input-pill" placeholder="••••••••" />
                  </div>
                  <div className="pill-form-row">
                    <div className="pill-form-group relative">
                      <label className="label-text">New Password</label>
                      <div className={`input-pill-wrapper ${passData.new && !allMet ? 'error-ring' : ''}`}>
                        <input
                          type={showPass ? "text" : "password"} className="form-input-pill" placeholder="••••••••"
                          onFocus={() => setFocusedField('new')} onBlur={() => setFocusedField(null)}
                          onChange={(e) => setPassData({...passData, new: e.target.value})}
                        />
                        <button className="eye-btn-pill" onClick={() => setShowPass(!showPass)}>
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className={`password-popup-tooltip ${focusedField === 'new' ? 'visible' : ''}`}>
                        <p className="popup-title">Requirements:</p>
                        <div className={`popup-item ${reqs.length ? 'met' : 'unmet'}`}>{reqs.length ? <Check size={12} /> : <X size={12} />} 8+ Characters</div>
                        <div className={`popup-item ${reqs.number ? 'met' : 'unmet'}`}>{reqs.number ? <Check size={12} /> : <X size={12} />} Numbers</div>
                        <div className={`popup-item ${reqs.special ? 'met' : 'unmet'}`}>{reqs.special ? <Check size={12} /> : <X size={12} />} Special Char</div>
                      </div>
                    </div>
                    <div className="pill-form-group">
                      <label className="label-text">Confirm</label>
                      <div className={`input-pill-wrapper ${passData.confirm && passData.new !== passData.confirm ? 'error-ring' : ''}`}>
                        <input
                          type={showConfirm ? "text" : "password"} className="form-input-pill"
                          onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                        />
                        <button className="eye-btn-pill" onClick={() => setShowConfirm(!showConfirm)}>
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: HISTORY */}
        {activeTab === 'history' && (
          <div className="history-view fade-in">
            <header className="history-header">
              <h1 className="main-title">ATTENDANCE HISTORY</h1>
              <div className="user-profile-mini"><User size={32} /></div>
            </header>
            <div className="filter-container">
              <div className="search-wrapper">
                <input type="text" placeholder="Search event..." className="search-input" />
                <div className="search-icon-box"><Info size={18} style={{ transform: 'rotate(180deg)' }} /></div>
              </div>
              <div className="dropdown-wrapper">
                <select className="month-dropdown">
                  <option>Month</option><option>January</option><option>February</option>
                </select>
              </div>
            </div>
            <div className="history-table-container">
              <div className="table-header-grid">
                <span>Date</span><span>Event Name</span><span>Venue</span><span>Time In</span>
              </div>
              <div className="history-list">
                <div className="history-row accent-blue">
                  <span className="row-date">September 02, 2025</span><span className="row-event">Student General Assembly</span><span className="row-venue">OMSC Gymnasium</span><span className="row-time">07 : 55 AM</span>
                </div>
                <div className="history-row accent-yellow">
                  <span className="row-date">January 24, 2026</span><span className="row-event">Meeting</span><span className="row-venue">OMSC Gymnasium</span><span className="row-time">08 : 00 AM</span>
                </div>
                <div className="history-row accent-green">
                  <span className="row-date">February 18, 2026</span><span className="row-event">Meeting</span><span className="row-venue">OMSC Gymnasium</span><span className="row-time">08 : 00 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;