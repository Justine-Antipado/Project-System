import React, { useState } from 'react';
import { Eye, EyeOff, User, ChevronDown, Check } from 'lucide-react';
import './App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', middleName: '', idNumber: '', 
    password: '', confirmPassword: '',
    course: 'Select Course', yearLevel: 'Select Year'
  });

  const courses = ['BSIT', 'BEED', 'CBAM'];
  const years = ['1', '2', '3', '4'];

  const handleToggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
      setShowPass(false);
      setShowConfirmPass(false);
    }, 400); 
  };

  const selectOption = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
  };

  const CustomDropdown = ({ label, name, options, value }) => (
    <div className="field-group custom-dropdown-container">
      <label className="label-text">{label}</label>
      <div 
        className={`form-input dropdown-trigger ${activeDropdown === name ? 'active' : ''}`}
        onClick={() => setActiveDropdown(activeDropdown === name ? null : name)}
      >
        <span>{value}</span>
        <ChevronDown size={18} className={`chevron ${activeDropdown === name ? 'rotate' : ''}`} />
      </div>
      
      {activeDropdown === name && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div 
              key={opt} 
              className="dropdown-item" 
              onClick={() => selectOption(name, opt)}
            >
              {opt}
              {value === opt && <Check size={14} className="check-icon" />}
            </div>
          ))}
        </div>
      )}
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
              <User color="#5e7d63" size={32} />
            </div>
            <h2 className="main-title">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p className="sub-title">Academic Portal Access</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {isLogin ? (
              <div className="input-stack">
                <div className="field-group">
                  <label className="label-text">School ID Number or Username</label>
                  <input type="text" className="form-input" placeholder="2024-XXXXX" />
                </div>
                <div className="field-group relative">
                  <label className="label-text">Password</label>
                  <div className="input-with-icon">
                    <input type={showPass ? "text" : "password"} className="form-input" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="eye-btn">
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="registration-stack">
                <div className="field-group">
                  <label className="label-text">First Name</label>
                  <input type="text" className="form-input" placeholder="Juan" />
                </div>
                <div className="field-group">
                  <label className="label-text">Last Name</label>
                  <input type="text" className="form-input" placeholder="Dela Cruz" />
                </div>
                <div className="field-group">
                  <label className="label-text">Middle Name</label>
                  <input type="text" className="form-input" placeholder="Protasio" />
                </div>

                <div className="input-row-flex">
                  <CustomDropdown label="Course" name="course" options={courses} value={formData.course} />
                  <CustomDropdown label="Year Level" name="yearLevel" options={years} value={formData.yearLevel} />
                </div>

                <div className="field-group relative">
                  <label className="label-text">Create Password</label>
                  <div className="input-with-icon">
                    <input type={showPass ? "text" : "password"} className="form-input" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="eye-btn">
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="field-group relative">
                  <label className="label-text">Confirm Password</label>
                  <div className="input-with-icon">
                    <input type={showConfirmPass ? "text" : "password"} className="form-input" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="eye-btn">
                      {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button className="btn btn-submit">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>
              
              <div className="or-divider">OR</div>

              <button type="button" onClick={handleToggleMode} className="btn btn-toggle">
                {isLogin ? 'Sign Up' : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
          <div className="footer-credits">© 2026-2027 Group 1 Inc.</div>
        </div>

        <div className="info-panel">
          <div className="info-content">
            <p className="top-note">Sign in to view upcoming school events and track your attendance.</p>
            <h1 className="hero-heading">Welcome Back!</h1>
            <div className="green-divider"></div>
            
            <div className="phone-preview">
              <div className="phone-inner">
                <div className="mock-login-text">Login</div>
                <div className="mock-widget"></div>
                <div className="mock-widget primary"></div>
                <div className="mock-btn">Log In</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;