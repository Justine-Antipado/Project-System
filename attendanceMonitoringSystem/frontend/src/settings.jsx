import React, { useState, useEffect } from "react";
import { Check, X, Eye, EyeOff } from "lucide-react";
import omscLogo from "./assets/omsc.logo.png";
import "./settings.css";
import axios from "axios";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystem/backend";

export default function Settings() {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    schoolIDNo: "",
    email: "",
    lastName: "",
    firstName: "",
    middleName: "",
    program: "",
    yearLevel: "",
    section: "",
  });

  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");

  const sections = ["A", "B", "C", "D", "E"];
  const programs = ["BSIT", "BSCS", "BSHM", "BSBA", "BEED"];
  const years = ["1", "2", "3", "4"];

  // ── FETCH SESSION DATA ON MOUNT ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/get_student_profile.php`, {
          withCredentials: true,
        });
        const u = res.data.user;
        setFormData({
          schoolIDNo: u.SchoolIDNo || "",
          email: u.Email || "",
          lastName: u.LastName || "",
          firstName: u.FirstName || "",
          middleName: u.MiddleName || "",
          program: u.Program || "",
          yearLevel: u.YearLevel || "",
          section: u.section || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validatePassword = (pass) => ({
    length: pass.length >= 8,
    number: /\d/.test(pass),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    upperLower: /[a-z]/.test(pass) && /[A-Z]/.test(pass),
  });

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
    const handleClickOutside = (e) => {
      if (!e.target.closest(".custom-dropdown-container"))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── UPDATE PROFILE ──
  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name required.";
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name required.";
    if (!formData.program) newErrors.program = "Select Program.";
    if (!formData.yearLevel) newErrors.yearLevel = "Select Year.";
    if (!formData.section) newErrors.section = "Select Section.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    

    try {
// ── STEP 1: Check for duplicate email (excluding current user's own email) ──
    const checkRes = await axios.get(`${API}/checkDup.php`, {
      withCredentials: true,
    });
    const existingUsers = checkRes.data;

    const isEmailDuplicate = existingUsers.some(
      (user) =>
        user.Email.toLowerCase().trim() === formData.email.toLowerCase().trim() &&
        user.SchoolIDNo.toLowerCase().trim() !== formData.schoolIDNo.toLowerCase().trim()
        // ↑ exclude themselves — same email is fine if it's their own account
    );

    if (isEmailDuplicate) {
      setErrors({ email: "This email is already in use by another account." });
      return;
    }

      const data = new FormData();
      data.append("email", formData.email);
      data.append("lastName", formData.lastName);
      data.append("firstName", formData.firstName);
      data.append("middleName", formData.middleName);
      data.append("program", formData.program);
      data.append("yearLevel", formData.yearLevel);
      data.append("section", formData.section);

      const res = await axios.post(`${API}/update_student_profile.php`, data, {
        withCredentials: true,
      });
      setSuccessMsg(res.data.message || "Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrors({
        global: err.response?.data?.message || "Update failed. Try again.",
      });
    }
  };

  // ── CHANGE PASSWORD ──
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const newPassErrors = {};
    setPasswordSuccessMsg("");

    if (!passData.old) newPassErrors.old = "Current password is required.";
    if (!passData.new) newPassErrors.new = "New password is required.";
    if (passData.new && !allChangePassReqsMet)
      newPassErrors.new = "Password does not meet requirements.";
    if (passData.new !== passData.confirm)
      newPassErrors.confirm = "Passwords do not match.";

    if (Object.keys(newPassErrors).length > 0) {
      setPasswordErrors(newPassErrors);
      return;
    }
    setPasswordErrors({});

    try {
      const data = new FormData();
      data.append("oldPassword", passData.old);
      data.append("newPassword", passData.new);

      const res = await axios.post(`${API}/change_password.php`, data, {
        withCredentials: true,
      });
      setPasswordSuccessMsg(
        res.data.message || "Password changed successfully!",
      );
      setPassData({ old: "", new: "", confirm: "" });
      setTimeout(() => setPasswordSuccessMsg(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Password change failed.";
      setPasswordErrors({ old: msg });
    }
  };

  // ── DROPDOWN ──
  const CustomDropdown = ({ label, name, options, value }) => (
    <div
      className={`field-group custom-dropdown-container ${errors[name] ? "has-error" : ""}`}
    >
      <label className="label-text">{label}</label>
      <div
        className={`form-input dropdown-trigger ${activeDropdown === name ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setActiveDropdown(activeDropdown === name ? null : name);
          handleInputFocus(name);
        }}
      >
        <span className="dropdown-value">{value || `Select ${label}...`}</span>
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

  if (isLoading)
    return (
      <div className="settings-view fade-in">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="settings-view fade-in">
      <h2
        className="settings-title"
        style={{ marginBottom: "1.5rem", fontWeight: 800 }}
      >
        Account Settings
      </h2>

      <div className="settings-grid">
        <div className="settings-forms-wrapper">
          {/* FORM 1: Profile Info */}
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
              {successMsg && <div className="success-banner">{successMsg}</div>}
              {errors.global && (
                <div className="error-banner" style={{
                    color: "white",
                    backgroundColor: "#e63946",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "15px",
                    textAlign: "center",
                  }}>{errors.global}</div>
              )}

              <div className="registration-stack">
                {/* School ID — read-only */}
                <div className="field-group">
                  <label className="label-text">School ID No.</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.schoolIDNo}
                    readOnly
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
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

                {/* Program | Year | Section */}
                <div className="input-row-flex dropdown-row">
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
              </div>

              <div className="action-buttons" style={{ marginTop: "1.5rem" }}>
                <button type="submit" className="btn btn-submit">
                  Update General Info
                </button>
              </div>
            </form>
          </div>

          {/* FORM 2: Change Password */}
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
                        value={passData.new}
                        onFocus={() => handleInputFocus("new")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setPassData({ ...passData, new: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="eye-btn-pill eye-btn"
                        onClick={() => setShowNewPass(!showNewPass)}
                      >
                        {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div
                      className={`password-popup-tooltip password-requirements-popup ${shouldShowChangePassPopup ? "visible" : ""}`}
                    >
                      <div className="popup-arrow"></div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "11px",
                          marginBottom: "4px",
                        }}
                      >
                        Requirements:
                      </p>
                      <ul>
                        {[
                          ["length", "8+ Characters"],
                          ["number", "Numbers"],
                          ["special", "Special Char"],
                          ["upperLower", "Upper & Lower"],
                        ].map(([key, label]) => (
                          <li
                            key={key}
                            className={changePassReqs[key] ? "met" : "unmet"}
                          >
                            {changePassReqs[key] ? (
                              <Check size={12} />
                            ) : (
                              <X size={12} />
                            )}{" "}
                            {label}
                          </li>
                        ))}
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
                          setPassData({ ...passData, confirm: e.target.value })
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
  );
}
