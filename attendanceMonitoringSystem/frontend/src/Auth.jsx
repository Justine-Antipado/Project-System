//import React, { useState } from 'react';
import { Eye, EyeOff, User, Check, X } from 'lucide-react';
import './Auth.css';
import omscLogo from './assets/omsc.logo.png';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 0. MOCK DATABASE (For duplicating checks)
const MOCK_DATABASE_USERS = [
  { idNo: '2024-11111', email: 'test@omsc.edu.ph' },
  { idNo: '2024-22222', email: 'user@omsc.edu.ph' },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  // 1. STATE MANAGEMENT
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // States for Password Validation UI
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    schoolIDNo: '',
    email: '', 
    lastName: '',
    firstName: '',
    middleName: '',
    deptID: 'Select Dept',
    program: 'Select Program',
    yearLevel: 'Select Year',
    password: '',
    confirmPassword: ''
  });

  // States for Error/Success Messages
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // 2. CONSTANTS & VALIDATION RULES
  const departments = ['CAS', 'CBA', 'COE', 'CCS'];
  const programs = ['BSIT', 'BSCS', 'BSHM', 'BSBA', 'BEED'];
  const years = ['1', '2', '3', '4'];

  const validatePassword = (pass) => {
    return {
      length: pass.length >= 8,
      number: /\d/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      upperLower: /[a-z]/.test(pass) && /[A-Z]/.test(pass),
    };
  };

  const passwordReqs = validatePassword(formData.password);
  const allPasswordReqsMet = Object.values(passwordReqs).every(Boolean);

  const shouldShowPopup = focusedField === 'password' && !allPasswordReqsMet;

  const handleInputFocus = (fieldName) => {
    setFocusedField(fieldName);
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  // 3. HANDLERS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleToggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
      setShowPass(false);
      setShowConfirmPass(false);
      setErrors({});
      setSuccessMsg('');
      setFocusedField(null);
    }, 400); 
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    // If the click is NOT on a dropdown trigger or menu, close all
    if (!event.target.closest('.custom-dropdown-container')) {
      setActiveDropdown(null);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  const selectOption = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Logic for Google Login
  const handleGoogleLogin = () => {
    console.log("Redirecting to Google OAuth...");
    // Add your Firebase or Auth0 Google logic here
  };

  // 4. FORM SUBMISSION
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setSuccessMsg('');

    if (!formData.schoolIDNo) newErrors.schoolIDNo = 'School ID is required.';
    if (!formData.password) newErrors.password = 'Password is required.';

    if (!isLogin) {
      if (!formData.email) newErrors.email = 'Email is required.';
      if (!formData.lastName) newErrors.lastName = 'Last Name required.';
      if (!formData.firstName) newErrors.firstName = 'First Name required.';
      if (formData.deptID === 'Select Dept') newErrors.deptID = 'Select Dept.';
      if (formData.program === 'Select Program') newErrors.program = 'Select Program.';
      if (formData.yearLevel === 'Select Year') newErrors.yearLevel = 'Select Year.';

      if (!allPasswordReqsMet) {
        newErrors.password = 'Password does not meet requirements.';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }

      if (!newErrors.schoolIDNo && MOCK_DATABASE_USERS.some(u => u.idNo === formData.schoolIDNo)) {
        newErrors.schoolIDNo = 'School ID is already registered.';
      }
      if (!newErrors.email && MOCK_DATABASE_USERS.some(u => u.email === formData.email)) {
        newErrors.email = 'Email is already in use.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccessMsg(isLogin ? 'Login Successful!' : 'Registration Successful! You can now sign in.');
    }
  };

  // 6. SUB-COMPONENTS
  const CustomDropdown = ({ label, name, options, value }) => (
  <div 
    className={`field-group custom-dropdown-container ${errors[name] ? 'has-error' : ''}`}
  >
    <label className="label-text">{label}</label>

    <div 
      className={`form-input dropdown-trigger ${activeDropdown === name ? 'active' : ''}`}
      onClick={(e) => {
        e.stopPropagation(); // Stop bubbling
        setActiveDropdown(activeDropdown === name ? null : name);
        handleInputFocus(name);
      }}
    >
      <span className="dropdown-value">{value}</span>
    </div>
    
    {activeDropdown === name && (
      <div className="dropdown-menu">
        {options.map((opt) => (
          <div 
            key={opt} 
            className="dropdown-item" 
            // Change onClick to onMouseDown to ensure it fires before the blur/close logic
            onMouseDown={(e) => {
              e.preventDefault(); 
              selectOption(name, opt);
            }}
          >
            {opt}
            {value === opt && <Check size={14} className="check-icon" />}
          </div>
        ))}
      </div>
    )}

    {errors[name] && <span className="error-text">{errors[name]}</span>}
  </div>
);

  const PasswordRequirements = ({ reqs, visible }) => (
    <div className={`password-requirements-popup ${visible ? 'visible' : ''}`}>
      <div className="popup-arrow"></div>
      <h4>Password Requirements:</h4>
      <ul>
        <li className={reqs.length ? 'met' : 'unmet'}>
          {reqs.length ? <Check size={14} /> : <X size={14} />} At least 8 characters
        </li>
        <li className={reqs.number ? 'met' : 'unmet'}>
          {reqs.number ? <Check size={14} /> : <X size={14} />} Contains a number
        </li>
        <li className={reqs.special ? 'met' : 'unmet'}>
          {reqs.special ? <Check size={14} /> : <X size={14} />} Contains a special char
        </li>
        <li className={reqs.upperLower ? 'met' : 'unmet'}>
          {reqs.upperLower ? <Check size={14} /> : <X size={14} />} Uppercase & Lowercase
        </li>
      </ul>
    </div>
  );

  return (
    <div className="page-container">
      <div className="blob blob-left"></div>
      <div className="blob blob-right"></div>

      <div className={`auth-card ${isLogin ? '' : 'reverse'}`}>
        
        <div className={`form-container ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          <div className="header-section">
            <div className="logo-icon">
              <User color="#0a1d37" size={32} />
            </div>
            <h2 className="main-title">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p className="sub-title">OMSC Academic Portal</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {successMsg && <div className="success-banner">{successMsg}</div>}
            
            {isLogin ? (
              <div className="input-stack">
                <div className={`field-group ${errors.schoolIDNo ? 'has-error' : ''}`}>
                  <label className="label-text">School ID Number</label>
                  <input 
                    type="text" name="schoolIDNo"
                    value={formData.schoolIDNo}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('schoolIDNo')}
                    className="form-input" placeholder="2024-XXXXX" 
                  />
                  {errors.schoolIDNo && <span className="error-text">{errors.schoolIDNo}</span>}
                </div>
                <div className={`field-group relative ${errors.password ? 'has-error' : ''}`}>
                  <label className="label-text">Password</label>
                  <div className="input-with-icon">
                    <input 
                      type={showPass ? "text" : "password"} name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('password')}
                      onBlur={() => setFocusedField(null)}
                      className="form-input" placeholder="••••••••" 
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="eye-btn">
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
              </div>
            ) : (
              <div className="registration-stack">
                <div className={`field-group ${errors.schoolIDNo ? 'has-error' : ''}`}>
                  <label className="label-text">School ID No.</label>
                  <input 
                    type="text" name="schoolIDNo"
                    value={formData.schoolIDNo}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('schoolIDNo')}
                    className="form-input" placeholder="2024-00001" 
                  />
                  {errors.schoolIDNo && <span className="error-text">{errors.schoolIDNo}</span>}
                </div>

                <div className={`field-group ${errors.email ? 'has-error' : ''}`}>
                  <label className="label-text">Email Address</label>
                  <input 
                    type="email" name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('email')}
                    className="form-input" placeholder="juan.delacruz@omsc.edu.ph" 
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="input-row-flex">
                  <div className={`field-group ${errors.lastName ? 'has-error' : ''}`}>
                    <label className="label-text">Last Name</label>
                    <input 
                      type="text" name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('lastName')}
                      className="form-input" placeholder="Dela Cruz" 
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                  <div className={`field-group ${errors.firstName ? 'has-error' : ''}`}>
                    <label className="label-text">First Name</label>
                    <input 
                      type="text" name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('firstName')}
                      className="form-input" placeholder="Juan" 
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                </div>

                <div className="field-group">
                  <label className="label-text">Middle Name (Optional)</label>
                  <input 
                    type="text" name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('middleName')}
                    className="form-input" placeholder="Protasio" 
                  />
                </div>

                <div className="input-row-flex dropdown-row">
                   <CustomDropdown label="Dept" name="deptID" options={departments} value={formData.deptID} />
                   <CustomDropdown label="Program" name="program" options={programs} value={formData.program} />
                   <CustomDropdown label="Year" name="yearLevel" options={years} value={formData.yearLevel} />
                </div>

                <div className="input-row-flex relative">
                  <div className={`field-group relative ${errors.password ? 'has-error' : ''}`}>
                    <label className="label-text">Password</label>
                    <div className="input-with-icon">
                      <input 
                        type={showPass ? "text" : "password"} name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('password')}
                        onBlur={() => setFocusedField(null)}
                        className="form-input" placeholder="••••••••" 
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="eye-btn">
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <PasswordRequirements reqs={passwordReqs} visible={shouldShowPopup} />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className={`field-group relative ${errors.confirmPassword ? 'has-error' : ''}`}>
                    <label className="label-text">Confirm</label>
                    <div className="input-with-icon">
                      <input 
                        type={showConfirmPass ? "text" : "password"} name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('confirmPassword')}
                        className="form-input" placeholder="••••••••" 
                      />
                      <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="eye-btn">
                        {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button type="submit" className="btn btn-submit">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>

              <button 
                type="button" 
                className="btn btn-google" 
                onClick={handleGoogleLogin}
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="google-icon"
                />
                Continue with Google
              </button>

              <div className="or-divider">OR</div>
              <button type="button" onClick={handleToggleMode} className="btn btn-toggle">
                {isLogin ? 'Create Account' : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
          <div className="footer-credits">© 2026-2027 OMSC Group 1 Inc.</div>
        </div>

        <div className="info-panel">
          <div className="info-content">
            <div className="college-logo-container">
              <img src={omscLogo} alt="OMSC Logo" className="college-logo" />
            </div>
            <p className="top-note">Educate. Empower. Excel.</p>
            <h1 className="hero-heading">Welcome Back!</h1>
            <div className="yellow-divider"></div>
            <p className="panel-subtext">Access your student portal to track attendance and school events.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
