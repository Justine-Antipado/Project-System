import React, { useEffect, useRef, useState } from "react";
import {
  QrCode,
  CameraOff,
  Play,
  Square,
  Layers,
  CheckCircle,
  X,
  ArrowLeft,
  AlertCircle,
  UserX,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

export default function QrScannerDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [scanStatus, setScanStatus] = useState("idle");
  const [scanMessage, setScanMessage] = useState("");
  const [eventName, setEventName] = useState("");
  const [officerId, setOfficerId] = useState(null); // ← fetched from adminProfile

  const queryParams = new URLSearchParams(useLocation().search);
  const eventId = queryParams.get("eventId") || "";

  const [scannedProfile, setScannedProfile] = useState({
    lastName: "—",
    firstName: "—",
    middleName: "",
    program: "—",
    yearLevel: "—",
    status: "idle",
  });

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const lastScannedTextRef = useRef("");
  const throttleTimeoutRef = useRef(null);
  const statusTimeoutRef = useRef(null);

  // ─── Fetch logged-in officer's ID from adminProfile ───
  useEffect(() => {
    axios
      .get(`${API}/adminProfile.php`, { withCredentials: true })
      .then((res) => {
        if (res.data.success && res.data.user?.OfficersID) {
          setOfficerId(res.data.user.OfficersID);
        }
      })
      .catch(() => {});
  }, []);

  // ─── Fetch event name ───
  useEffect(() => {
    if (!eventId) return;
    axios
      .get(`${API}/getEvents.php`)
      .then((res) => {
        const ev = res.data.find((e) => String(e.EventID) === String(eventId));
        if (ev) setEventName(ev.EventName);
      })
      .catch(() => {});
  }, [eventId]);

  const playBeep = (type = "success") => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(
        type === "success" ? 880 : 300,
        ctx.currentTime,
      );
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  };

  const clearStatusAfterDelay = () => {
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => {
      setScanStatus("idle");
      setScanMessage("");
    }, 4000);
  };

  const handleScan = async (decodedText) => {
    if (
      decodedText === lastScannedTextRef.current &&
      throttleTimeoutRef.current
    )
      return;

    clearTimeout(throttleTimeoutRef.current);
    lastScannedTextRef.current = decodedText;
    throttleTimeoutRef.current = setTimeout(() => {
      lastScannedTextRef.current = "";
    }, 5000);

    setScanStatus("idle");
    setScanMessage("");

    try {
      const res = await axios.post(
        `${API}/scannedAttendance.php`,
        {
          eventId,
          qrCode: decodedText,
          scannedBy: officerId, // ← real OfficersID from session
        },
        { withCredentials: true },
      );

      const data = res.data;

      if (data.status === "success") {
        playBeep("success");
        setScanStatus("success");
        setScanMessage("Attendance recorded successfully.");

        const timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setScannedProfile({
          lastName: data.student.lastName,
          firstName: data.student.firstName,
          middleName: data.student.middleName || "",
          program: data.student.program,
          yearLevel: data.student.yearLevel,
          status: "success",
        });

        setAttendanceList((prev) => [
          {
            id: data.attendanceId,
            lastName: data.student.lastName,
            firstName: data.student.firstName,
            middleName: data.student.middleName || "N/A",
            program: data.student.program,
            yearLevel: data.student.yearLevel,
            time: timestamp,
          },
          ...prev,
        ]);
      } else if (data.status === "not_found") {
        playBeep("error");
        setScanStatus("not_found");
        setScanMessage(
          "Student not found. QR code is not registered in the system.",
        );
        setScannedProfile((prev) => ({ ...prev, status: "not_found" }));
      } else if (data.status === "duplicate") {
        playBeep("error");
        setScanStatus("duplicate");
        setScanMessage("Student is already registered for this event.");
        setScannedProfile({
          lastName: data.student.lastName,
          firstName: data.student.firstName,
          middleName: data.student.middleName || "",
          program: data.student.program,
          yearLevel: data.student.yearLevel,
          status: "duplicate",
        });
      } else {
        playBeep("error");
        setScanStatus("error");
        setScanMessage(data.message || "An error occurred.");
      }
    } catch (err) {
      playBeep("error");
      setScanStatus("error");
      setScanMessage("Server error. Please check your connection.");
    }

    clearStatusAfterDelay();
  };

  const startScanner = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("reader");
      }
      setIsScanning(true);
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: (w, h) => {
            const m = Math.min(w, h);
            return { width: Math.floor(m * 0.7), height: Math.floor(m * 0.7) };
          },
          aspectRatio: 1.0,
        },
        handleScan,
      );
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Failed to initialize camera stream.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {}
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop();
      }
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  const profileBorderColor =
    {
      success: "#10b981",
      not_found: "#ef4444",
      duplicate: "#ef4444",
      error: "#ef4444",
      idle: "#eab308",
    }[scannedProfile.status] || "#eab308";

  const statusBadgeStyle = {
    success: {
      bg: "rgba(16,185,129,0.12)",
      color: "#10b981",
      label: "VERIFIED",
    },
    not_found: {
      bg: "rgba(239,68,68,0.12)",
      color: "#ef4444",
      label: "NOT FOUND",
    },
    duplicate: {
      bg: "rgba(239,68,68,0.12)",
      color: "#ef4444",
      label: "DUPLICATE",
    },
    error: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", label: "ERROR" },
    idle: { bg: "rgba(234,179,8,0.1)", color: "#eab308", label: "STANDBY" },
  }[scannedProfile.status] || {
    bg: "rgba(234,179,8,0.1)",
    color: "#eab308",
    label: "STANDBY",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        padding: "32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`
        .dashboard-grid { display:grid; grid-template-columns:1fr; gap:28px; max-width:1300px; width:100%; margin:0 auto; }
        @media (min-width:1024px) { .dashboard-grid { grid-template-columns:4.5fr 7.5fr; } }
        .premium-card { background-color:#1e293b; border-radius:12px; padding:24px; border:1px solid rgba(255,255,255,0.05); box-shadow:0 20px 25px -5px rgba(0,0,0,0.3),0 10px 10px -5px rgba(0,0,0,0.2); }
        .back-btn-box { background:transparent; border:none; color:#94a3b8; cursor:pointer; display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:8px; transition:all 0.2s; margin-right:8px; }
        .back-btn-box:hover { background:rgba(255,255,255,0.06); color:#fff; }
        .dark-table-container { width:100%; overflow-x:auto; background:#111827; border-radius:10px; border:1px solid rgba(255,255,255,0.04); }
        .dark-table { width:100%; border-collapse:collapse; text-align:left; font-size:13px; }
        .dark-table th { background:#1f2937; color:#9ca3af; padding:14px 18px; font-weight:600; text-transform:uppercase; font-size:11px; letter-spacing:0.05em; border-bottom:1px solid rgba(255,255,255,0.08); }
        .dark-table td { padding:16px 18px; border-bottom:1px solid rgba(255,255,255,0.03); color:#e5e7eb; }
        .dark-table tr:hover { background:rgba(255,255,255,0.02); }
        @keyframes laser-glow { 0%{top:4%;opacity:0.3} 50%{opacity:1} 100%{top:94%;opacity:0.3} }
        .cyber-laser { position:absolute; left:0; width:100%; height:3px; background:linear-gradient(to right,transparent,#eab308,transparent); box-shadow:0 0 12px #eab308; animation:laser-glow 2.2s ease-in-out infinite; pointer-events:none; z-index:10; }
        @keyframes pulse-red { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,0.15)} }
        .pulse-red { animation:pulse-red 1.2s ease infinite; }
        @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0.15)} }
        .pulse-green { animation:pulse-green 1.2s ease infinite; }
        #reader { width:100%!important; height:100%!important; border:none!important; }
        #reader video { width:100%!important; height:100%!important; object-fit:cover!important; border-radius:8px!important; }
        #reader __dashboard_section_csr__, #reader img { display:none!important; }
        .scan-error-banner { display:flex; align-items:flex-start; gap:10px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:12px 14px; margin-top:14px; }
        .scan-success-banner { display:flex; align-items:flex-start; gap:10px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:12px 14px; margin-top:14px; }
        .officer-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; padding:4px 10px; background:#0f172a; color:#64748b; border-radius:6px; border:1px solid rgba(255,255,255,0.05); }
        .officer-badge.loaded { color:#eab308; border-color:rgba(234,179,8,0.2); }
      `}</style>

      {/* Header */}
      <header
        style={{
          width: "100%",
          maxWidth: "1300px",
          margin: "0 auto 36px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => window.history.back()}
            className="back-btn-box"
            title="Go Back"
          >
            <ArrowLeft size={22} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#1e293b",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#eab308",
              }}
            >
              <QrCode size={22} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#fff",
                  letterSpacing: "-0.025em",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                ATTENDANCE SCANNER {eventId ? `— ID-${eventId}` : ""}
              </h1>
              {eventName && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: "500",
                    margin: "2px 0 0 0",
                  }}
                >
                  {eventName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Officer badge + Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className={`officer-badge ${officerId ? "loaded" : ""}`}>
            {officerId ? `Officer ID-${officerId}` : "Loading officer..."}
          </span>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              padding: "4px 12px",
              backgroundColor: "#0f172a",
              color: isScanning ? "#10b981" : "#64748b",
              borderRadius: "6px",
              border: `1px solid ${isScanning ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.05)"}`,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: isScanning ? "#10b981" : "#475569",
                display: "inline-block",
              }}
            />
            {isScanning ? "LIVE" : "OFFLINE"}
          </div>
        </div>
      </header>

      <main className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Camera Card */}
          <div
            className="premium-card"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 16px 0",
              }}
            >
              Scan Student QR
            </h3>

            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1/1",
                backgroundColor: "#0b0f19",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isScanning && <div className="cyber-laser" />}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "20px",
                  zIndex: 20,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderTop: "3px solid #eab308",
                      borderLeft: "3px solid #eab308",
                      borderRadius: "2px 0 0 0",
                    }}
                  />
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderTop: "3px solid #eab308",
                      borderRight: "3px solid #eab308",
                      borderRadius: "0 2px 0 0",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderBottom: "3px solid #eab308",
                      borderLeft: "3px solid #eab308",
                      borderRadius: "0 0 0 2px",
                    }}
                  />
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderBottom: "3px solid #eab308",
                      borderRight: "3px solid #eab308",
                      borderRadius: "0 0 2px 0",
                    }}
                  />
                </div>
              </div>
              <div id="reader" ref={scannerRef}></div>
              {!isScanning && (
                <div
                  style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#475569",
                  }}
                >
                  <CameraOff size={44} style={{ marginBottom: "10px" }} />
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: 0,
                    }}
                  >
                    Scanner Off
                  </p>
                </div>
              )}
            </div>

            {scanStatus === "success" && (
              <div className="scan-success-banner">
                <CheckCircle
                  size={16}
                  style={{ color: "#10b981", flexShrink: 0, marginTop: "1px" }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#10b981",
                    fontWeight: "600",
                  }}
                >
                  {scanMessage}
                </span>
              </div>
            )}
            {(scanStatus === "not_found" ||
              scanStatus === "duplicate" ||
              scanStatus === "error") && (
              <div className="scan-error-banner">
                {scanStatus === "not_found" ? (
                  <UserX
                    size={16}
                    style={{
                      color: "#ef4444",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  />
                ) : (
                  <AlertCircle
                    size={16}
                    style={{
                      color: "#ef4444",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: "12px",
                    color: "#ef4444",
                    fontWeight: "600",
                  }}
                >
                  {scanMessage}
                </span>
              </div>
            )}

            <div style={{ marginTop: "16px" }}>
              {!isScanning ? (
                <button
                  onClick={startScanner}
                  style={{
                    width: "100%",
                    backgroundColor: "#eab308",
                    color: "#0f172a",
                    border: "none",
                    padding: "14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(234,179,8,0.2)",
                  }}
                >
                  <Play size={14} fill="currentColor" /> Initialize Scanner
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  style={{
                    width: "100%",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <Square size={14} fill="currentColor" /> Terminate Feed
                </button>
              )}
            </div>
          </div>

          {/* Profile Card */}
          <div
            className={
              scannedProfile.status === "success"
                ? "premium-card pulse-green"
                : scannedProfile.status === "not_found" ||
                    scannedProfile.status === "duplicate"
                  ? "premium-card pulse-red"
                  : "premium-card"
            }
            style={{
              borderLeft: `4px solid ${profileBorderColor}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "140px",
              transition: "border-color 0.3s",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#fff",
                  margin: "0 0 4px 0",
                  letterSpacing: "-0.02em",
                }}
              >
                {scannedProfile.lastName !== "—"
                  ? `${scannedProfile.lastName}, ${scannedProfile.firstName}${scannedProfile.middleName ? " " + scannedProfile.middleName : ""}`
                  : "— Awaiting Scan —"}
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  fontWeight: "500",
                  margin: 0,
                }}
              >
                {scannedProfile.program !== "—"
                  ? `${scannedProfile.program} • Year ${scannedProfile.yearLevel}`
                  : "No student scanned yet"}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  padding: "6px 14px",
                  backgroundColor: statusBadgeStyle.bg,
                  color: statusBadgeStyle.color,
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {statusBadgeStyle.label}
              </span>
              {scanStatus === "success" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#10b981",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  <CheckCircle size={16} /> Entry Logged
                </div>
              )}
              {(scanStatus === "not_found" || scanStatus === "duplicate") && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#ef4444",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  <X size={16} />{" "}
                  {scanStatus === "not_found"
                    ? "Unrecognized QR"
                    : "Already Registered"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div
          className="premium-card"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "22px",
              paddingBottom: "14px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#fff",
                margin: 0,
              }}
            >
              Attendance Log{" "}
              {eventName && (
                <span style={{ color: "#eab308" }}>— {eventName}</span>
              )}
            </h2>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "4px 10px",
                backgroundColor: "#0f172a",
                color: "#eab308",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {attendanceList.length} Scanned
            </span>
          </div>

          <div className="dark-table-container">
            <table className="dark-table">
              <thead>
                <tr>
                  <th style={{ color: "#eab308" }}>Att. ID</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th style={{ textAlign: "center" }}>Program</th>
                  <th style={{ textAlign: "center" }}>Year</th>
                  <th style={{ textAlign: "right" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "64px",
                        textAlign: "center",
                        color: "#4b5563",
                      }}
                    >
                      <Layers
                        size={36}
                        style={{ margin: "0 auto 12px auto", opacity: 0.3 }}
                      />
                      <p style={{ margin: 0, fontSize: "13px" }}>
                        No attendance records yet. Start scanning to log
                        entries.
                      </p>
                    </td>
                  </tr>
                ) : (
                  attendanceList.map((row) => (
                    <tr key={row.id}>
                      <td
                        style={{
                          fontFamily: "monospace",
                          fontWeight: "700",
                          color: "#eab308",
                        }}
                      >
                        {row.id}
                      </td>
                      <td style={{ color: "#fff", fontWeight: "600" }}>
                        {row.lastName}
                      </td>
                      <td>{row.firstName}</td>
                      <td style={{ color: "#64748b" }}>{row.middleName}</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            backgroundColor: "#1f2937",
                            color: "#9ca3af",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          {row.program}
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "#94a3b8",
                        }}
                      >
                        {row.yearLevel}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: "monospace",
                          color: "#94a3b8",
                          fontWeight: "600",
                        }}
                      >
                        {row.time}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
