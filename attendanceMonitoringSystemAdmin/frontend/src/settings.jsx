import React, { useState, useEffect } from "react";
import { User, Camera, Check, X, Eye, EyeOff } from "lucide-react";
import omscLogo from "./assets/omsc.logo.png";
import "./settings.css";

export default function Settings() {
  // 1. STATE MANAGEMENT
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Form 1 State: Profile Data ONLY
  const [formData, setFormData] = useState({
    schoolIDNo: "24-1-03962",
    email: "juan.delacruz@omsc.edu.ph",
    lastName: "Dela Cruz",
    firstName: "Juan",
    middleName: "Protasio",
    deptID: "CCS",
    program: "BSIT",
    yearLevel: "3",
  });

  // Form 2 State: Change Password Section
  const [passData, setPassData] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");

  // BAGONG STATE: Para sa hiwalay na success message ng Profile Sidebar
  const [sidebarSuccessMsg, setSidebarSuccessMsg] = useState("");

  // 2. CONSTANTS & VALIDATION RULES
  const departments = ["CAS", "CBA", "COE", "CCS"];
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

  const changePassReqs = validatePassword(passData.new);
  const allChangePassReqsMet = Object.values(changePassReqs).every(Boolean);
  const shouldShowChangePassPopup =
    focusedField === "new" && !allChangePassReqsMet;

  const handleInputFocus = (fieldName) => {
    setFocusedField(fieldName);
    if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    if (passwordErrors[fieldName])
      setPasswordErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown-container")) {
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

  // REUSABLE VALIDATION FUNCTION FOR PROFILE
  const runProfileValidation = () => {
    const newErrors = {};
    if (!formData.schoolIDNo.trim())
      newErrors.schoolIDNo = "School ID is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name required.";
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name required.";
    if (formData.deptID === "Select Dept" || !formData.deptID)
      newErrors.deptID = "Select Dept.";
    if (formData.program === "Select Program" || !formData.program)
      newErrors.program = "Select Program.";
    if (formData.yearLevel === "Select Year" || !formData.yearLevel)
      newErrors.yearLevel = "Select Year.";

    return newErrors;
  };

  // SUBMIT HANDLER 1: Update Profile Details Only
  const handleUpdateProfileSubmit = (e) => {
    if (e) e.preventDefault();
    setSuccessMsg("");

    const newErrors = runProfileValidation();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccessMsg("Personal Information Updated Successfully!");

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    }
  };

  // ISOLATED SIDEBAR BUTTON HANDLER: Dito lang magti-trigger ang sarili niyang feedback
  const handleSidebarSaveClick = (e) => {
    e.preventDefault();
    setSidebarSuccessMsg("Image updated successfully!");

    // Auto-hide sidebar success message pagkalipas ng 3 segundo
    setTimeout(() => {
      setSidebarSuccessMsg("");
    }, 3000);
  };

  // SUBMIT HANDLER 2: Change Password
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    const newPassErrors = {};
    setPasswordSuccessMsg("");

    if (!passData.old) newPassErrors.old = "Current password is required.";
    if (!passData.new) newPassErrors.new = "New password is required.";

    if (passData.new && !allChangePassReqsMet) {
      newPassErrors.new = "Password does not meet requirements.";
    }
    if (passData.new !== passData.confirm) {
      newPassErrors.confirm = "Passwords do not match.";
    }

    setPasswordErrors(newPassErrors);

    if (Object.keys(newPassErrors).length === 0) {
      setPasswordSuccessMsg("Password Changed Successfully!");
      setPassData({ old: "", new: "", confirm: "" });

      // Auto-hide password success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccessMsg("");
      }, 3000);
    }
  };

  // 3. DROPDOWN COMPONENT
  const CustomDropdown = ({ label, name, options, value }) => (
    <div
      className={`field-group custom-dropdown-container ${errors[name] ? "has-error" : ""}`}
    >
      <label className="label-text">{label}</label>
      <div
        className={`form-input dropdown-trigger-settings ${activeDropdown === name ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
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

  return (
    <>
      <div className="settings-view fade-in">
        <h2
          className="settings-title"
          style={{ marginBottom: "1.5rem", fontWeight: 800 }}
        >
          Account Settings
        </h2>

        <div className="settings-grid">
          
          

          {/* ── RIGHT COLUMN: Isolated Forms Wrapper ── */}
          <div className="settings-forms-wrapper">
            {/* FORM 1: Pure Account Info */}
            <div className="glass-card settings-form-block">
              <div className="settings-form-header">
                <img
                  src={omscLogo}
                  alt="OMSC Logo"
                  className="settings-college-logo"
                />
                <div>
                  <h3 className="settings-form-heading">
                    Edit Account Information
                  </h3>
                  <p className="settings-form-subheading">
                    OMSC Academic Portal Registration Data
                  </p>
                </div>
              </div>

              <form className="auth-form" onSubmit={handleUpdateProfileSubmit}>
                {successMsg && (
                  <div className="success-banner">{successMsg}</div>
                )}

                <div className="registration-stack">
                  <div
                    className={`field-group ${errors.schoolIDNo ? "has-error" : ""}`}
                  >
                    <label className="label-text">School ID No.</label>
                    <input
                      type="text"
                      name="schoolIDNo"
                      value={formData.schoolIDNo}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("schoolIDNo")}
                      className="form-input"
                      placeholder="2024-00001"
                    />
                    {errors.schoolIDNo && (
                      <span className="error-text">{errors.schoolIDNo}</span>
                    )}
                  </div>

                  <div
                    className={`field-group ${errors.email ? "has-error" : ""}`}
                  >
                    <label className="label-text">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("email")}
                      className="form-input"
                      placeholder="juan.delacruz@omsc.edu.ph"
                    />
                    {errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>

                  <div className="input-row-flex">
                    <div
                      className={`field-group ${errors.lastName ? "has-error" : ""}`}
                    >
                      <label className="label-text">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus("lastName")}
                        className="form-input"
                        placeholder="Dela Cruz"
                      />
                      {errors.lastName && (
                        <span className="error-text">{errors.lastName}</span>
                      )}
                    </div>
                    <div
                      className={`field-group ${errors.firstName ? "has-error" : ""}`}
                    >
                      <label className="label-text">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus("firstName")}
                        className="form-input"
                        placeholder="Juan"
                      />
                      {errors.firstName && (
                        <span className="error-text">{errors.firstName}</span>
                      )}
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="label-text">Middle Name (Optional)</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus("middleName")}
                      className="form-input"
                      placeholder="Protasio"
                    />
                  </div>

                  <div className="input-row-flex dropdown-row">
                    <CustomDropdown
                      label="Dept"
                      name="deptID"
                      options={departments}
                      value={formData.deptID}
                    />
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
                  </div>
                </div>

                <div className="action-buttons" style={{ marginTop: "1.5rem" }}>
                  <button type="submit" className="btn btn-submit">
                    Update General Info
                  </button>
                </div>
              </form>
            </div>

            {/* FORM 2: Isolated Change Password Section */}
            <div className="glass-card settings-form-block">
              <h4
                className="form-section-title"
                style={{
                  marginBottom: "1.5rem",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                }}
              >
                Change Security Password
              </h4>

              <form onSubmit={handleChangePasswordSubmit}>
                {passwordSuccessMsg && (
                  <div className="success-banner">{passwordSuccessMsg}</div>
                )}

                <div className="registration-stack">
                  {/* Current Password Field */}
                  <div
                    className={`field-group ${passwordErrors.old ? "has-error" : ""}`}
                  >
                    <label className="label-text">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={passData.old}
                      onFocus={() => handleInputFocus("old")}
                      onChange={(e) =>
                        setPassData({ ...passData, old: e.target.value })
                      }
                    />
                    {passwordErrors.old && (
                      <span className="error-text">{passwordErrors.old}</span>
                    )}
                  </div>

                  {/* Grid row para sa New at Confirm fields */}
                  <div className="input-row-flex">
                    {/* New Password */}
                    <div
                      className={`field-group ${passwordErrors.new ? "has-error" : ""}`}
                      style={{ position: "relative" }}
                    >
                      <label className="label-text">New Password</label>
                      <div
                        className={`input-pill-wrapper input-with-icon ${passData.new && !allChangePassReqsMet ? "error-ring" : ""}`}
                      >
                        <input
                          type={showNewPass ? "text" : "password"}
                          className="form-input"
                          placeholder="••••••••"
                          onFocus={() => handleInputFocus("new")}
                          onBlur={() => setFocusedField(null)}
                          value={passData.new}
                          onChange={(e) =>
                            setPassData({ ...passData, new: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          className="eye-btn-pill eye-btn"
                          onClick={() => setShowNewPass(!showNewPass)}
                        >
                          {showNewPass ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      {/* Tooltip Requirements */}
                      <div
                        className={`password-popup-tooltip password-requirements-popup ${shouldShowChangePassPopup ? "visible" : ""}`}
                      >
                        <div className="popup-arrow"></div>
                        <p
                          className="popup-title"
                          style={{
                            fontWeight: 700,
                            fontSize: "11px",
                            marginBottom: "4px",
                          }}
                        >
                          Requirements:
                        </p>
                        <ul>
                          <li
                            className={changePassReqs.length ? "met" : "unmet"}
                          >
                            {changePassReqs.length ? (
                              <Check size={12} />
                            ) : (
                              <X size={12} />
                            )}{" "}
                            8+ Characters
                          </li>
                          <li
                            className={changePassReqs.number ? "met" : "unmet"}
                          >
                            {changePassReqs.number ? (
                              <Check size={12} />
                            ) : (
                              <X size={12} />
                            )}{" "}
                            Numbers
                          </li>
                          <li
                            className={changePassReqs.special ? "met" : "unmet"}
                          >
                            {changePassReqs.special ? (
                              <Check size={12} />
                            ) : (
                              <X size={12} />
                            )}{" "}
                            Special Char
                          </li>
                          <li
                            className={
                              changePassReqs.upperLower ? "met" : "unmet"
                            }
                          >
                            {changePassReqs.upperLower ? (
                              <Check size={12} />
                            ) : (
                              <X size={12} />
                            )}{" "}
                            Upper & Lower
                          </li>
                        </ul>
                      </div>
                      {passwordErrors.new && (
                        <span className="error-text">{passwordErrors.new}</span>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div
                      className={`field-group ${passwordErrors.confirm ? "has-error" : ""}`}
                    >
                      <label className="label-text">Confirm New Password</label>
                      <div
                        className={`input-pill-wrapper input-with-icon ${passData.confirm && passData.new !== passData.confirm ? "error-ring" : ""}`}
                      >
                        <input
                          type={showConfirmNewPass ? "text" : "password"}
                          className="form-input"
                          placeholder="••••••••"
                          value={passData.confirm}
                          onFocus={() => handleInputFocus("confirm")}
                          onChange={(e) =>
                            setPassData({
                              ...passData,
                              confirm: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          className="eye-btn-pill eye-btn"
                          onClick={() =>
                            setShowConfirmNewPass(!showConfirmNewPass)
                          }
                        >
                          {showConfirmNewPass ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirm && (
                        <span className="error-text">
                          {passwordErrors.confirm}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="action-buttons" style={{ marginTop: "1.5rem" }}>
                  <button type="submit" className="btn btn-submit">
                    Change Password Keys
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
