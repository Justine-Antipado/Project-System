import React, { useState, useEffect } from "react";
import { Check, X, Eye, EyeOff } from "lucide-react";
import omscLogo from "./assets/omsc.logo.png";
import "./settings.css";
import axios from "axios";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

export default function Settings() {
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  //const [isLoading, setIsLoading] = useState(false);

  // ── FETCHED FROM BACKEND ──
  const [organizations, setOrganizations] = useState([]);
  const [termYears, setTermYears] = useState([]);

  const sections = ["A", "B", "C", "D", "E"];
  const programs = ["BSIT", "BSCS", "BSHM", "BSBA", "BEED"];
  const years = ["1", "2", "3", "4"];

  // Central template base sa uri ng grupo para sa malilinis na posisyon
  const positionTemplates = {
    localGov: [
      "Mayor",
      "Vice Mayor",
      "Secretary",
      "Treasurer",
      "Auditor",
      "Councilor",
      "Other",
    ],
    studentGov: [
      "Governor",
      "Vice Governor",
      "Secretary",
      "Assistant Sec",
      "Treasurer",
      "Assistant Treasurer",
      "Auditor",
      "Assistant Auditor",
      "PIO",
      "Peace Officers",
      "Business Managers",
      "Other",
    ],
    defaultClub: [
      "President",
      "Vice President",
      "Secretary",
      "Asst. Secretary",
      "Treasurer",
      "Asst. Treasurer",
      "Auditor",
      "PIO",
      "Project Manager",
      "Councilor",
      "Other",
    ],
  };

  // ── INITIAL DATA FORM STATE ──
  const [formData, setFormData] = useState({
    schoolIDNo: "",
    email: "",
    lastName: "",
    firstName: "",
    middleName: "",
    program: "",
    yearLevel: "",
    section: "",
    organization: "",
    position: "",
    term_year: "",
  });

  // ── FETCH ORGANIZATIONS ──
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axios.get(`${API}/get_organizations.php`, {
          withCredentials: true,
        });
        if (res.data.success) {
          // Itinatabi ang buong array para magamit ang OrgType kung mayroon man
          setOrganizations(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
      }
    };
    fetchOrganizations();
  }, []);

  // ── FETCH TERM YEARS / SEMESTERS ──
  useEffect(() => {
    const fetchTermYears = async () => {
      try {
        const res = await axios.get(`${API}/get_semesters.php`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setTermYears(res.data.data.map((row) => row.YearRange));
        }
      } catch (err) {
        console.error("Failed to fetch term years:", err);
      }
    };
    fetchTermYears();
  }, []);

  // ── FETCH PROFILE FROM BACKEND ──
  useEffect(() => {
    const fetchProfile = async () => {
      //setIsLoading(true);
      try {
        const res = await axios.get(`${API}/adminProfile.php`, {
          withCredentials: true,
        });

        if (res.data && res.data.user) {
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
            organization: u.OrgName || "",
            position: u.Position || "",
            term_year: u.TermYear || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");

  // ── DYNAMIC POSITION FILTERING (Database Connected) ──
  const getCurrentPositions = () => {
    const selectedOrgName = formData.organization;
    if (!selectedOrgName) return [];

    // Hanapin ang piniling organisasyon sa listahan mula sa database
    const foundOrg = organizations.find((o) => o.OrgName === selectedOrgName);

    // 1. Kung may OrgType galing sa database table niyo, ito ang unahin
    if (foundOrg && foundOrg.OrgType) {
      if (positionTemplates[foundOrg.OrgType]) {
        return positionTemplates[foundOrg.OrgType];
      }
    }

    // 2. Fallback system base sa pangalan kung walang OrgType kolum ang database niyo
    if (["PADC", "YMO", "CBAM"].includes(selectedOrgName)) {
      return positionTemplates.localGov;
    }
    if (selectedOrgName === "SSG") {
      return positionTemplates.studentGov;
    }

    // Default listahan para sa ibang clubs/organizations
    return positionTemplates.defaultClub;
  };

  const currentPositions = getCurrentPositions();

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
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "organization") updated.position = "";
      return updated;
    });
    setActiveDropdown(null);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── UPDATE PROFILE SUBMIT ──
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
    if (!formData.organization) newErrors.organization = "Select organization.";
    if (!formData.position) newErrors.position = "Select position.";
    if (!formData.term_year) newErrors.term_year = "Select term year.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      //setIsLoading(true);

      const checkRes = await axios.get(`${API}/checkDup.php`, {
        withCredentials: true,
      });
      const existingUsers = checkRes.data;

      const isEmailDuplicate = existingUsers.some(
        (user) =>
          user.Email.toLowerCase().trim() ===
            formData.email.toLowerCase().trim() &&
          user.SchoolIDNo.toLowerCase().trim() !==
            formData.schoolIDNo.toLowerCase().trim(),
      );

      if (isEmailDuplicate) {
        setErrors({
          email: "This email is already in use by another account.",
        });
        return;
      }

      const res = await axios.post(
        `${API}/update_Profile.php`,
        {
          email: formData.email,
          lastName: formData.lastName,
          firstName: formData.firstName,
          middleName: formData.middleName,
          program: formData.program,
          yearLevel: formData.yearLevel,
          section: formData.section,
          organization: formData.organization,
          position: formData.position,
          term_year: formData.term_year,
        },
        { withCredentials: true },
      );

      setSuccessMsg(res.data.message || "Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrors({
        global: err.response?.data?.message || "Update failed. Try again.",
      });
    }
  };

  // ── CHANGE PASSWORD SUBMIT ──
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
      const res = await axios.post(
        `${API}/changePassword.php`,
        {
          old: passData.old,
          new: passData.new,
          confirm: passData.confirm,
        },
        { withCredentials: true },
      );

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

  // ── DROPDOWN REUSABLE COMPONENT ──
  const CustomDropdown = ({
    label,
    name,
    options,
    value,
    disabled = false,
  }) => (
    <div
      className={`field-group custom-dropdown-container ${errors[name] ? "has-error" : ""}`}
    >
      <label className="label-text">{label}</label>
      <div
        className={`form-input dropdown-trigger ${activeDropdown === name ? "active" : ""} ${disabled ? "disabled" : ""}`}
        style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        onClick={(e) => {
          if (disabled) return;
          e.stopPropagation();
          setActiveDropdown(activeDropdown === name ? null : name);
          handleInputFocus(name);
        }}
      >
        <span className="dropdown-value">{value || `Select ${label}...`}</span>
      </div>
      {activeDropdown === name && !disabled && (
        <div className="dropdown-menu">
          {options.length === 0 ? (
            <div
              className="dropdown-item"
              style={{ color: "#aaa", cursor: "default" }}
            >
              No options available
            </div>
          ) : (
            options.map((opt) => (
              <div
                key={opt}
                className="dropdown-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(name, opt);
                }}
              >
                {/* TINANGGAL ANG EQUAL SIGN DITO */}
                {opt}
                {value === opt && <Check size={14} className="check-icon" />}
              </div>
            ))
          )}
        </div>
      )}
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  {
    /*if (isLoading)
    return (
      <div className="settings-view fade-in">
        <p>Processing request with system database engine...</p>
      </div>
    );*/
  }

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
                <div
                  className="error-banner"
                  style={{
                    color: "white",
                    backgroundColor: "#e63946",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "15px",
                    textAlign: "center",
                  }}
                >
                  {errors.global}
                </div>
              )}

              <div className="registration-stack">
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

                <div className="input-row-flex dropdown-row">
                  <CustomDropdown
                    label="Organization"
                    name="organization"
                    options={organizations.map((org) => org.OrgName)}
                    value={formData.organization}
                  />
                  <CustomDropdown
                    label="Position"
                    name="position"
                    options={currentPositions}
                    value={formData.position}
                    disabled={!formData.organization}
                  />
                  <CustomDropdown
                    label="Term Year"
                    name="term_year"
                    options={termYears}
                    value={formData.term_year}
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
                  <div className="input-pill-wrapper input-with-icon">
                    <input
                      type={showOldPass ? "text" : "password"} // Dynamic type base sa state
                      className="form-input"
                      placeholder="••••••••"
                      value={passData.old}
                      onFocus={() => handleInputFocus("old")}
                      onChange={(e) =>
                        setPassData({ ...passData, old: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="eye-btn-pill eye-btn"
                      onClick={() => setShowOldPass(!showOldPass)} // Toggle state kapag kini-click
                    >
                      {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordErrors.old && (
                    <span className="error-text">{passwordErrors.old}</span>
                  )}
                </div>
                <div className="input-row-flex">
                  <div
                    className={`field-group ${passwordErrors.new ? "has-error" : ""}`}
                    style={{ position: "relative" }}
                  >
                    <label className="label-text">New Password</label>
                    <div
                      className={`input-pill-wrapper input-with-icon ${
                        passData.new && !allChangePassReqsMet
                          ? "error-ring"
                          : ""
                      }`}
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
                      className={`password-popup-tooltip password-requirements-popup ${
                        shouldShowChangePassPopup ? "visible" : ""
                      }`}
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

                  <div
                    className={`field-group ${passwordErrors.confirm ? "has-error" : ""}`}
                  >
                    <label className="label-text">Confirm New Password</label>
                    <div
                      className={`input-pill-wrapper input-with-icon ${
                        passData.confirm && passData.new !== passData.confirm
                          ? "error-ring"
                          : ""
                      }`}
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
