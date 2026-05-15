import React, { useState } from 'react';
import { User, Camera, Check, X, Eye, EyeOff } from 'lucide-react';
//import './dashboard.css';
import './style.css';


export default function Settings() {
  // ── Profile State ──
  const [profileData, setProfileData] = useState({
    lastName: 'Santiago',
    firstName: 'Ricardo',
    dept: 'CITE',
    program: 'BSIT',
    year: '1st Year',
  });
  const [errors, setErrors] = useState({});

  // ── Password State ──
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // ── Handlers ──
  const handleProfileChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleUpdateProfile = () => {
    const newErrors = {};
    if (!profileData.lastName) newErrors.lastName = 'Last Name is required';
    if (!profileData.firstName) newErrors.firstName = 'First Name is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert('Profile Updated Successfully!');
    }
  };

  // ── Password Validation ──
  const validate = p => ({
    length: p.length >= 8,
    number: /\d/.test(p),
    special: /[!@#$%^&*]/.test(p),
  });
  const reqs = validate(passData.new);
  const allMet = Object.values(reqs).every(Boolean);

  return (
    <div className="settings-view fade-in">
      <h2 className="settings-title">Account Settings</h2>

      <div className="settings-grid">
        {/* ── LEFT: Profile Sidebar ── */}
        <div className="glass-card profile-sidebar-card">
          <div className="avatar-section">
            <div className="avatar-pill-wrapper">
              <User size={60} color="#ccc" />
              <label className="camera-badge-pill" htmlFor="pfp-upload">
                <Camera size={16} />
                <input type="file" id="pfp-upload" hidden />
              </label>
            </div>
            <h3 className="sidebar-student-name">
              {profileData.firstName} {profileData.lastName}
            </h3>
            <p className="sidebar-student-id">24-1-03962</p>
          </div>
          <button className="btn-save-main" onClick={handleUpdateProfile}>
            Save Changes
          </button>
        </div>

        {/* ── RIGHT: Forms ── */}
        <div className="main-settings-form-container">
          {/* Edit Profile */}
          <div className="glass-card form-section-card">
            <h4 className="form-section-title">Edit Profile Information</h4>

            {/* Dept / Program / Year */}
            <div className="pill-form-row three-cols">
              <div className="pill-form-group">
                <label className="label-text">Dept</label>
                <select
                  className="form-input-pill select-pill"
                  value={profileData.dept}
                  onChange={e => handleProfileChange(e, 'dept')}
                >
                  <option>CITE</option>
                  <option>COED</option>
                </select>
              </div>
              <div className="pill-form-group">
                <label className="label-text">Program</label>
                <select
                  className="form-input-pill select-pill"
                  value={profileData.program}
                  onChange={e => handleProfileChange(e, 'program')}
                >
                  <option>BSIT</option>
                  <option>BSIS</option>
                </select>
              </div>
              <div className="pill-form-group">
                <label className="label-text">Year</label>
                <select
                  className="form-input-pill select-pill"
                  value={profileData.year}
                  onChange={e => handleProfileChange(e, 'year')}
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>

            {/* School ID (read-only) */}
            <div className="pill-form-group">
              <label className="label-text">School ID No.</label>
              <input
                type="text"
                className="form-input-pill disabled-bg"
                value="24-1-03962"
                readOnly
              />
            </div>

            {/* Last Name / First Name */}
            <div className="pill-form-row">
              <div className="pill-form-group">
                <label className="label-text">Last Name</label>
                <input
                  type="text"
                  className={`form-input-pill ${errors.lastName ? 'error-ring' : ''}`}
                  value={profileData.lastName}
                  onChange={e => handleProfileChange(e, 'lastName')}
                />
                {errors.lastName && (
                  <span className="error-text-pill">{errors.lastName}</span>
                )}
              </div>
              <div className="pill-form-group">
                <label className="label-text">First Name</label>
                <input
                  type="text"
                  className={`form-input-pill ${errors.firstName ? 'error-ring' : ''}`}
                  value={profileData.firstName}
                  onChange={e => handleProfileChange(e, 'firstName')}
                />
                {errors.firstName && (
                  <span className="error-text-pill">{errors.firstName}</span>
                )}
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="glass-card form-section-card">
            <h4 className="form-section-title">Change Password</h4>

            <div className="pill-form-group">
              <label className="label-text">Current Password</label>
              <input
                type="password"
                className="form-input-pill"
                placeholder="••••••••"
                value={passData.old}
                onChange={e => setPassData({ ...passData, old: e.target.value })}
              />
            </div>

            <div className="pill-form-row">
              {/* New Password */}
              <div className="pill-form-group" style={{ position: 'relative' }}>
                <label className="label-text">New Password</label>
                <div
                  className={`input-pill-wrapper ${
                    passData.new && !allMet ? 'error-ring' : ''
                  }`}
                >
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input-pill"
                    placeholder="••••••••"
                    onFocus={() => setFocusedField('new')}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => setPassData({ ...passData, new: e.target.value })}
                  />
                  <button
                    className="eye-btn-pill"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password requirements tooltip */}
                <div
                  className={`password-popup-tooltip ${
                    focusedField === 'new' ? 'visible' : ''
                  }`}
                >
                  <p className="popup-title">Requirements:</p>
                  <div className={`popup-item ${reqs.length ? 'met' : 'unmet'}`}>
                    {reqs.length ? <Check size={12} /> : <X size={12} />} 8+ Characters
                  </div>
                  <div className={`popup-item ${reqs.number ? 'met' : 'unmet'}`}>
                    {reqs.number ? <Check size={12} /> : <X size={12} />} Numbers
                  </div>
                  <div className={`popup-item ${reqs.special ? 'met' : 'unmet'}`}>
                    {reqs.special ? <Check size={12} /> : <X size={12} />} Special Char
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="pill-form-group">
                <label className="label-text">Confirm</label>
                <div
                  className={`input-pill-wrapper ${
                    passData.confirm && passData.new !== passData.confirm
                      ? 'error-ring'
                      : ''
                  }`}
                >
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="form-input-pill"
                    placeholder="••••••••"
                    onChange={e =>
                      setPassData({ ...passData, confirm: e.target.value })
                    }
                  />
                  <button
                    className="eye-btn-pill"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end right column */}
      </div>
    </div>
  );
}