import { Eye, EyeOff, User, Check, X } from "lucide-react";
import "./Auth.css";
import omscLogo from "./assets/omsc.logo.png";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 0. MOCK DATABASE (For duplicating checks)
const MOCK_DATABASE_USERS = [
  { idNo: "2024-11111", email: "test@omsc.edu.ph" },
  { idNo: "2024-22222", email: "user@omsc.edu.ph" },
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
    schoolIDNo: "",
    email: "",
    lastName: "",
    firstName: "",
    middleName: "",
    section: "Select Sec...",
    program: "Select Prog...",
    yearLevel: "Select Year...",
    password: "",
    confirmPassword: "",
  });

  // States for Error/Success Messages
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // 2. CONSTANTS & VALIDATION RULES
  const sections = ["A", "B", "C", "D", "E"];
  const programs = ["BSIT", "BSCS", "BSHM", "BSBA", "BEED"];
  const years = ["1", "2", "3", "4"];

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

  const shouldShowPopup = focusedField === "password" && !allPasswordReqsMet;

  const handleInputFocus = (fieldName) => {
    setFocusedField(fieldName);
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  // 3. HANDLERS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleToggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
      setShowPass(false);
      setShowConfirmPass(false);
      setErrors({});
      setSuccessMsg("");
      setFocusedField(null);
    }, 400);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".omsc-auth-dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
    setSuccessMsg("");

    if (!formData.schoolIDNo) newErrors.schoolIDNo = "School ID is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    if (!isLogin) {
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.lastName) newErrors.lastName = "Last Name required.";
      if (!formData.firstName) newErrors.firstName = "First Name required.";
      if (formData.section === "Select Sec...")
        newErrors.section = "Section is required.";
      if (formData.program === "Select Prog...")
        newErrors.program = "Program is required.";
      if (formData.yearLevel === "Select Year...")
        newErrors.yearLevel = "Year level is required.";

      if (!allPasswordReqsMet && formData.password) {
        newErrors.password = "Password does not meet requirements.";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      if (
        !newErrors.schoolIDNo &&
        MOCK_DATABASE_USERS.some((u) => u.idNo === formData.schoolIDNo)
      ) {
        newErrors.schoolIDNo = "School ID is already registered.";
      }
      if (
        !newErrors.email &&
        MOCK_DATABASE_USERS.some((u) => u.email === formData.email)
      ) {
        newErrors.email = "Email is already in use.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccessMsg(
        isLogin
          ? "Login Successful!"
          : "Registration Successful! You can now sign in.",
      );
    }
  };

  // 6. SUB-COMPONENTS
  const CustomDropdown = ({ label, name, options, value }) => (
    <div
      className={`omsc-auth-field-group omsc-auth-dropdown-container ${errors[name] ? "omsc-auth-has-error" : ""}`}
    >
      <label className="omsc-auth-label-text">{label}</label>

      <div
        className={`omsc-auth-form-input omsc-auth-dropdown-trigger ${activeDropdown === name ? "omsc-auth-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setActiveDropdown(activeDropdown === name ? null : name);
          handleInputFocus(name);
        }}
      >
        
        <span className="omsc-auth-dropdown-value">{value}</span>
      </div>

      {activeDropdown === name && (
        <div className="omsc-auth-dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className="omsc-auth-dropdown-item"
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(name, opt);
              }}
            >
              {opt}
              {value === opt && (
                <Check size={14} className="omsc-auth-check-icon" />
              )}
            </div>
          ))}
        </div>
      )}

      {errors[name] && (
        <span className="omsc-auth-error-text">{errors[name]}</span>
      )}
    </div>
  );

  const PasswordRequirements = ({ reqs, visible }) => (
    <div
      className={`omsc-auth-pass-popup ${visible ? "omsc-auth-pass-popup-visible" : ""}`}
    >
      <div className="omsc-auth-popup-arrow"></div>
      <h4>Password Requirements:</h4>
      <ul>
        <li
          className={reqs.length ? "omsc-auth-req-met" : "omsc-auth-req-unmet"}
        >
          {reqs.length ? <Check size={14} /> : <X size={14} />} At least 8
          characters
        </li>
        <li
          className={reqs.number ? "omsc-auth-req-met" : "omsc-auth-req-unmet"}
        >
          {reqs.number ? <Check size={14} /> : <X size={14} />} Contains a
          number
        </li>
        <li
          className={reqs.special ? "omsc-auth-req-met" : "omsc-auth-req-unmet"}
        >
          {reqs.special ? <Check size={14} /> : <X size={14} />} Contains a
          special char
        </li>
        <li
          className={
            reqs.upperLower ? "omsc-auth-req-met" : "omsc-auth-req-unmet"
          }
        >
          {reqs.upperLower ? <Check size={14} /> : <X size={14} />} Uppercase &
          Lowercase
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <div className="omsc-auth-page">
        <div className="omsc-auth-blob omsc-auth-blob-left"></div>
        <div className="omsc-auth-blob omsc-auth-blob-right"></div>

        <div
          className={`omsc-auth-card ${isLogin ? "" : "omsc-auth-card-reverse"}`}
        >
          <div
            className={`omsc-auth-form-container ${isAnimating ? "omsc-auth-fade-out" : "omsc-auth-fade-in"}`}
          >
            <div className="omsc-auth-header">
              <div className="omsc-auth-logo-icon">
                <User color="#0a1d37" size={32} />
              </div>
              <h2 className="omsc-auth-main-title">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="omsc-auth-sub-title">OMSC Academic Portal</p>
            </div>

            <form className="omsc-auth-form" onSubmit={handleSubmit}>
              {successMsg && (
                <div className="omsc-auth-success-banner">{successMsg}</div>
              )}

              {isLogin ? (
                <div className="omsc-auth-input-stack">
                  <div
                    className={`omsc-auth-field-group ${errors.schoolIDNo ? "omsc-auth-has-error" : ""}`}
                  >
                    <label className="omsc-auth-label-text">
                      School ID Number
                    </label>
                    <input
                      type="text"
                      name="schoolIDNo"
                      value={formData.schoolIDNo}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("schoolIDNo")}
                      className="omsc-auth-form-input"
                      placeholder="2024-XXXXX"
                    />
                    {errors.schoolIDNo && (
                      <span className="omsc-auth-error-text">
                        {errors.schoolIDNo}
                      </span>
                    )}
                  </div>
                  <div
                    className={`omsc-auth-field-group omsc-auth-relative ${errors.password ? "omsc-auth-has-error" : ""}`}
                  >
                    <label className="omsc-auth-label-text">Password</label>
                    <div className="omsc-auth-input-icon-wrap">
                      <input
                        type={showPass ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus("password")}
                        onBlur={() => setFocusedField(null)}
                        className="omsc-auth-form-input"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="omsc-auth-eye-btn"
                      >
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="omsc-auth-error-text">
                        {errors.password}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="omsc-auth-reg-stack">
                  <div
                    className={`omsc-auth-field-group ${errors.schoolIDNo ? "omsc-auth-has-error" : ""}`}
                  >
                    <label className="omsc-auth-label-text">
                      School ID No.
                    </label>
                    <input
                      type="text"
                      name="schoolIDNo"
                      value={formData.schoolIDNo}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("schoolIDNo")}
                      className="omsc-auth-form-input"
                      placeholder="2024-00001"
                    />
                    {errors.schoolIDNo && (
                      <span className="omsc-auth-error-text">
                        {errors.schoolIDNo}
                      </span>
                    )}
                  </div>

                  <div
                    className={`omsc-auth-field-group ${errors.email ? "omsc-auth-has-error" : ""}`}
                  >
                    <label className="omsc-auth-label-text">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("email")}
                      className="omsc-auth-form-input"
                      placeholder="juan.delacruz@omsc.edu.ph"
                    />
                    {errors.email && (
                      <span className="omsc-auth-error-text">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="omsc-auth-row-flex">
                    <div
                      className={`omsc-auth-field-group ${errors.lastName ? "omsc-auth-has-error" : ""}`}
                    >
                      <label className="omsc-auth-label-text">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus("lastName")}
                        className="omsc-auth-form-input"
                        placeholder="Dela Cruz"
                      />
                      {errors.lastName && (
                        <span className="omsc-auth-error-text">
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                    <div
                      className={`omsc-auth-field-group ${errors.firstName ? "omsc-auth-has-error" : ""}`}
                    >
                      <label className="omsc-auth-label-text">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus("firstName")}
                        className="omsc-auth-form-input"
                        placeholder="Juan"
                      />
                      {errors.firstName && (
                        <span className="omsc-auth-error-text">
                          {errors.firstName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="omsc-auth-field-group">
                    <label className="omsc-auth-label-text">
                      Middle Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("middleName")}
                      className="omsc-auth-form-input"
                      placeholder="Protasio"
                    />
                  </div>

                  <div className="omsc-auth-row-flex omsc-auth-dropdown-row">
                    <CustomDropdown
                      label="Program"
                      name="program"
                      options={programs}
                      value={formData.program}
                    />
                    <CustomDropdown
                      label="Year"
                      name="yearLevel"
                      options={years}
                      value={formData.yearLevel}
                    />
                    <CustomDropdown
                      label="Section"
                      name="section"
                      options={sections}
                      value={formData.section}
                    />
                  </div>

                  <div className="omsc-auth-row-flex omsc-auth-relative">
                    <div
                      className={`omsc-auth-field-group omsc-auth-relative ${errors.password ? "omsc-auth-has-error" : ""}`}
                    >
                      <label className="omsc-auth-label-text">Password</label>
                      <div className="omsc-auth-input-icon-wrap">
                        <input
                          type={showPass ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onFocus={() => handleInputFocus("password")}
                          onBlur={() => setFocusedField(null)}
                          className="omsc-auth-form-input"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="omsc-auth-eye-btn"
                        >
                          {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <PasswordRequirements
                        reqs={passwordReqs}
                        visible={shouldShowPopup}
                      />
                      {errors.password && (
                        <span className="omsc-auth-error-text">
                          {errors.password}
                        </span>
                      )}
                    </div>

                    <div
                      className={`omsc-auth-field-group omsc-auth-relative ${errors.confirmPassword ? "omsc-auth-has-error" : ""}`}
                    >
                      <label className="omsc-auth-label-text">Confirm</label>
                      <div className="omsc-auth-input-icon-wrap">
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onFocus={() => handleInputFocus("confirmPassword")}
                          className="omsc-auth-form-input"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="omsc-auth-eye-btn"
                        >
                          {showConfirmPass ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="omsc-auth-error-text">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="omsc-auth-action-btns">
                <button
                  type="submit"
                  className="omsc-auth-btn omsc-auth-btn-submit"
                >
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>

                <button
                  type="button"
                  className="omsc-auth-btn omsc-auth-btn-google"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="omsc-auth-google-icon"
                  />
                  Continue with Google
                </button>

                <div className="omsc-auth-or-divider">OR</div>
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="omsc-auth-btn omsc-auth-btn-toggle"
                >
                  {isLogin
                    ? "Create Account"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
            <div className="omsc-auth-footer">
              © 2026-2027 OMSC Group 1 Inc.
            </div>
          </div>

          <div className="omsc-auth-info-panel">
            <div className="omsc-auth-info-content">
              <div className="omsc-auth-college-logo-wrap">
                <img
                  src={omscLogo}
                  alt="OMSC Logo"
                  className="omsc-auth-college-logo"
                />
              </div>
              <p className="omsc-auth-top-note">Educate. Empower. Excel.</p>
              <h1 className="omsc-auth-hero-heading">Welcome Back!</h1>
              <div className="omsc-auth-yellow-divider"></div>
              <p className="omsc-auth-panel-subtext">
                Access your student portal to track attendance and school
                events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
