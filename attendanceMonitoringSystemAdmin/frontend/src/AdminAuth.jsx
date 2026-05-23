import { Eye, EyeOff, User, Check, X } from "lucide-react";
import "./AdminAuth.css";
import omscLogo from "./assets/omsc.logo.png";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_DATABASE_USERS = [
  { idNo: "2024-11111", email: "test@omsc.edu.ph" },
  { idNo: "2024-22222", email: "user@omsc.edu.ph" },
];

export default function AdminAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    schoolIDNo: "",
    email: "",
    lastName: "",
    firstName: "",
    middleName: "",
    section: "Select Sec...",
    program: "Select Pro...",
    yearLevel: "Select Yea...",
    organization: "Select Org...",
    position: "Select Pos...",
    term_year: "Select Ter...",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const sections = ["A", "B", "C", "D", "E"];
  const programs = ["BSIT", "BSCS", "BSHM", "BSBA", "BEED"];
  const years = ["1", "2", "3", "4"];
  const organizations = ["PADC", "YMO", "CBAM", "SSG", "Club"];
  const termYears = ["2024-2025", "2025-2026", "2026-2027"];
  const positionOptions = {
    PADC: ["Mayor", "Vice Mayor", "Secretary", "Treasurer", "Auditor", "Councilor", "Other"],
    YMO: ["Mayor", "Vice Mayor", "Secretary", "Treasurer", "Auditor", "Councilor", "Other"],
    CBAM: ["Mayor", "Vice Mayor", "Secretary", "Treasurer", "Auditor", "Councilor", "Other"],
    SSG: ["Governor", "Vice Governor", "Secretary", "Treasurer", "Auditor", "Other"],
    Club: ["President", "Vice President", "Secretary", "Treasurer", "Other"],
    "Select Org/Club": [],
  };

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
      setFormData({
        schoolIDNo: "",
        email: "",
        lastName: "",
        firstName: "",
        middleName: "",
        section: "Select Sec...",
        program: "Select Pro...",
        yearLevel: "Select Yea...",
        organization: "Select Org...",
        position: "Select Pos...",
        term_year: "Select Ter...",
        password: "",
        confirmPassword: "",
      });
    }, 400);
  };

  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = Object.values(dropdownRefs.current);
      const clickedInside = refs.some((ref) => ref && ref.contains(event.target));
      if (!clickedInside) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectOption = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "organization") newData.position = "Select Position";
      return newData;
    });
    setActiveDropdown(null);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGoogleLogin = () => {
    console.log("Redirecting to Google OAuth...");
  };

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
      if (formData.section === "Select Sec...") newErrors.section = "Select Section.";
      if (formData.program === "Select Pro...") newErrors.program = "Select Program.";
      if (formData.yearLevel === "Select Yea...") newErrors.yearLevel = "Select Year.";
      if (formData.organization === "Select Org...") newErrors.organization = "Select Org/Club.";
      if (formData.position === "Select Pos...") newErrors.position = "Select Position.";
      if (formData.term_year === "Select Ter...") newErrors.term_year = "Select Term/Year.";
      if (!allPasswordReqsMet) {
        newErrors.password = "Password does not meet requirements.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
      if (!newErrors.schoolIDNo && MOCK_DATABASE_USERS.some((u) => u.idNo === formData.schoolIDNo)) {
        newErrors.schoolIDNo = "School ID is already registered.";
      }
      if (!newErrors.email && MOCK_DATABASE_USERS.some((u) => u.email === formData.email)) {
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

  const CustomDropdown = ({ label, name, options, value }) => (
    <div
      ref={(el) => (dropdownRefs.current[name] = el)}
      className={`ap-field-wrapper ap-dropdown-scope ${errors[name] ? "ap-state-error" : ""}`}
    >
      <label className="ap-field-label">{label}</label>

      <div
        className={`ap-input-control ap-dropdown-toggle ${activeDropdown === name ? "ap-state-active" : ""}`}
        onClick={() => {
          
          setActiveDropdown(activeDropdown === name ? null : name);
          handleInputFocus(name);
        }}
      >
        <span className="ap-dropdown-current">{value}</span>
      </div>

      {activeDropdown === name && (
        <div className="ap-dropdown-overlay">
          {options.map((opt) => (
            <div
              key={opt}
              className="ap-dropdown-row"
              onClick={() => selectOption(name, opt)}
            >
              {opt}
              {value === opt && <Check size={14} className="ap-check-mark" />}
            </div>
          ))}
        </div>
      )}

      {errors[name] && <span className="ap-error-message">{errors[name]}</span>}
    </div>
  );

  const PasswordRequirements = ({ reqs, visible }) => (
    <div className={`ap-reqs-bubble ${visible ? "ap-state-visible" : ""}`}>
      <div className="ap-bubble-pointer"></div>
      <h4>Password Requirements:</h4>
      <ul>
        <li className={reqs.length ? "ap-req-met" : "ap-req-unmet"}>
          {reqs.length ? <Check size={14} /> : <X size={14} />} At least 8 characters
        </li>
        <li className={reqs.number ? "ap-req-met" : "ap-req-unmet"}>
          {reqs.number ? <Check size={14} /> : <X size={14} />} Contains a number
        </li>
        <li className={reqs.special ? "ap-req-met" : "ap-req-unmet"}>
          {reqs.special ? <Check size={14} /> : <X size={14} />} Contains a special char
        </li>
        <li className={reqs.upperLower ? "ap-req-met" : "ap-req-unmet"}>
          {reqs.upperLower ? <Check size={14} /> : <X size={14} />} Uppercase & Lowercase
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <div className="ap-screen-container">
        <div className="ap-glow-blur ap-glow-start"></div>
        <div className="ap-glow-blur ap-glow-end"></div>

        <div className={`ap-form-shell ${isLogin ? "" : "ap-layout-flipped"}`}>
          <div className={`ap-form-inner ${isAnimating ? "ap-anim-fadeout" : "ap-anim-fadein"}`}>
            <div className="ap-header-block">
              <div className="ap-icon-avatar">
                <User color="#0a1d37" size={32} />
              </div>
              <h2 className="ap-title-main">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="ap-title-sub">OMSC Academic Portal</p>
            </div>

            <form className="ap-main-form" onSubmit={handleSubmit}>
              {successMsg && <div className="ap-alert-success">{successMsg}</div>}

              {isLogin ? (
                <div className="ap-stack-vertical">
                  <div className={`ap-field-wrapper ${errors.schoolIDNo ? "ap-state-error" : ""}`}>
                    <label className="ap-field-label">School ID Number</label>
                    <input
                      type="text"
                      name="schoolIDNo"
                      value={formData.schoolIDNo}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("schoolIDNo")}
                      className="ap-input-control"
                      placeholder="2024-XXXXX"
                    />
                    {errors.schoolIDNo && (
                      <span className="ap-error-message">{errors.schoolIDNo}</span>
                    )}
                  </div>
                  <div className={`ap-field-wrapper ap-pos-relative ${errors.password ? "ap-state-error" : ""}`}>
                    <label className="ap-field-label">Password</label>
                    <div className="ap-input-icon-group">
                      <input
                        type={showPass ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus("password")}
                        onBlur={() => setFocusedField(null)}
                        className="ap-input-control"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="ap-visibility-toggle"
                      >
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="ap-error-message">{errors.password}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="ap-stack-register">
                  <div className={`ap-field-wrapper ${errors.schoolIDNo ? "ap-state-error" : ""}`}>
                    <label className="ap-field-label">School ID No.</label>
                    <input
                      type="text"
                      name="schoolIDNo"
                      value={formData.schoolIDNo}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("schoolIDNo")}
                      className="ap-input-control"
                      placeholder="2024-00001"
                    />
                    {errors.schoolIDNo && (
                      <span className="ap-error-message">{errors.schoolIDNo}</span>
                    )}
                  </div>

                  <div className={`ap-field-wrapper ${errors.email ? "ap-state-error" : ""}`}>
                    <label className="ap-field-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("email")}
                      className="ap-input-control"
                      placeholder="juan.delacruz@omsc.edu.ph"
                    />
                    {errors.email && (
                      <span className="ap-error-message">{errors.email}</span>
                    )}
                  </div>

                  <div className="ap-row-flexible">
                    <div className={`ap-field-wrapper ${errors.lastName ? "ap-state-error" : ""}`}>
                      <label className="ap-field-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus("lastName")}
                        className="ap-input-control"
                        placeholder="Dela Cruz"
                      />
                      {errors.lastName && (
                        <span className="ap-error-message">{errors.lastName}</span>
                      )}
                    </div>
                    <div className={`ap-field-wrapper ${errors.firstName ? "ap-state-error" : ""}`}>
                      <label className="ap-field-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus("firstName")}
                        className="ap-input-control"
                        placeholder="Juan"
                      />
                      {errors.firstName && (
                        <span className="ap-error-message">{errors.firstName}</span>
                      )}
                    </div>
                  </div>

                  <div className="ap-field-wrapper">
                    <label className="ap-field-label">Middle Name (Optional)</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("middleName")}
                      className="ap-input-control"
                      placeholder="Protasio"
                    />
                  </div>

                  <div className="ap-row-flexible ap-row-dropdowns">
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

                  <div className="ap-row-flexible ap-row-dropdowns">
                    <CustomDropdown
                      label="Org/Club"
                      name="organization"
                      options={organizations}
                      value={formData.organization}
                    />
                    <CustomDropdown
                      label="Position"
                      name="position"
                      options={positionOptions[formData.organization] || []}
                      value={formData.position}
                    />
                    <CustomDropdown
                      label="Term/Year"
                      name="term_year"
                      options={termYears}
                      value={formData.term_year}
                    />
                  </div>

                  <div className="ap-row-flexible ap-pos-relative">
                    <div className={`ap-field-wrapper ap-pos-relative ${errors.password ? "ap-state-error" : ""}`}>
                      <label className="ap-field-label">Password</label>
                      <div className="ap-input-icon-group">
                        <input
                          type={showPass ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onFocus={() => handleInputFocus("password")}
                          onBlur={() => setFocusedField(null)}
                          className="ap-input-control"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="ap-visibility-toggle"
                        >
                          {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <PasswordRequirements
                        reqs={passwordReqs}
                        visible={shouldShowPopup}
                      />
                      {errors.password && (
                        <span className="ap-error-message">{errors.password}</span>
                      )}
                    </div>

                    <div className={`ap-field-wrapper ap-pos-relative ${errors.confirmPassword ? "ap-state-error" : ""}`}>
                      <label className="ap-field-label">Confirm</label>
                      <div className="ap-input-icon-group">
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onFocus={() => handleInputFocus("confirmPassword")}
                          className="ap-input-control"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="ap-visibility-toggle"
                        >
                          {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="ap-error-message">{errors.confirmPassword}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="ap-action-cluster">
                <button type="submit" className="ap-btn ap-btn-primary">
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>

                <button
                  type="button"
                  className="ap-btn ap-btn-oauth"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="ap-oauth-icon"
                  />
                  Continue with Google
                </button>

                <div className="ap-text-divider">OR</div>
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="ap-btn ap-btn-switch"
                >
                  {isLogin
                    ? "Create Account"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
            <div className="ap-footer-text">© 2026-2027 OMSC Group 1 Inc.</div>
          </div>

          <div className="ap-branding-panel">
            <div className="ap-branding-content">
              <div className="ap-logo-wrapper">
                <img src={omscLogo} alt="OMSC Logo" className="ap-logo-img" />
              </div>
              <p className="ap-branding-tagline">Educate. Empower. Excel.</p>
              <h1 className="ap-branding-headline">Welcome Back!</h1>
              <div className="ap-accent-line"></div>
              <p className="ap-branding-body">
                Access your student portal to track attendance and school events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}