import React, { useState } from 'react';
import { Eye, EyeOff, User, ChevronDown, Check, GraduationCap, Building2, Calendar } from 'lucide-react';
import './App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', idNumber: '', password: '',
    term: 'Select Term', position: 'Select Position', org: 'Select Org/Club'
  });

  const handleToggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  const selectOption = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
  };

  return (
    <div className="page-container">
      {/* Background Decorations */}
      <div className="blob blob-left"></div>
      <div className="blob blob-right"></div>

      <div className="auth-card">
        {/* FORM SIDE */}
        <div className={`form-container ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          <div className="header-section">
            <div className="logo-icon">
              <User color="white" size={28} />
            </div>
            <h2 className="main-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="sub-title">Academic Portal Access</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {isLogin ? (
              <div className="input-stack">
                <div className="field-group">
                  <label className="label-text">ID Number</label>
                  <input type="text" className="form-input" placeholder="2024-XXXXX" />
                </div>
                <div className="field-group relative">
                  <label className="label-text">Password</label>
                  <input type={showPass ? "text" : "password"} className="form-input" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="eye-btn">
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="registration-grid">
                <div className="input-half">
                  <label className="label-text">First Name</label>
                  <input type="text" className="form-input" placeholder="John" />
                </div>
                <div className="input-half">
                  <label className="label-text">Last Name</label>
                  <input type="text" className="form-input" placeholder="Doe" />
                </div>
                {/* Dropdowns would go here - simplified for this example */}
              </div>
            )}

            <div className="action-buttons">
              <button className="btn btn-submit">
                {isLogin ? 'Log In to Portal' : 'Register Account'}
              </button>
              
              <div className="or-divider">OR</div>

              <button type="button" onClick={handleToggleMode} className="btn btn-toggle">
                {isLogin ? 'Create Account' : 'Already have an account?'}
              </button>
            </div>
          </form>
        </div>

        {/* INFO SIDE */}
        <div className="info-panel">
          <div className="info-content">
            <h1 className="hero-heading">{isLogin ? 'HELLO!' : 'WELCOME!'}</h1>
            <div className="green-divider"></div>
            <p className="hero-desc">
              Access your schedule, grades, and campus events in one unified dashboard.
            </p>
            
            <div className="phone-preview">
              <div className="phone-inner">
                <div className="mock-widget"></div>
                <div className="mock-widget primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;