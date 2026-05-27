import React, { useEffect, useRef, useState } from 'react';
import { QrCode, CameraOff, Play, Square, Layers, CheckCircle, X, ArrowLeft } from 'lucide-react'; // Idinagdag ang ArrowLeft
import { Html5Qrcode } from 'html5-qrcode';
import { useLocation, useNavigate } from "react-router-dom";

import axios from 'axios';

const INITIAL_ATTENDANCE_RECORDS = [
  { id: 101, lastName: "Antipado", firstName: "Justine", middleName: "Magpantay", program: "BSIT", yearLevel: 2, time: "08:01 AM" },
  { id: 102, lastName: "Mulingbayan", firstName: "Ranjetayn", middleName: "Unknown", program: "BSIT", yearLevel: 1, time: "08:05 AM" },
  { id: 103, lastName: "Gomez", firstName: "Ricardo", middleName: "Santiago", program: "BEED", yearLevel: 1, time: "08:12 AM" },
  { id: 104, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:18 AM" },
  { id: 105, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:27 AM" },
  { id: 106, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:34 AM" },
  { id: 108, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:50 AM" },
    { id: 109, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:57 AM" },
    { id: 110, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:43 AM" },
    { id: 111, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:29 AM" },
    { id: 112, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:22 AM" },
    { id: 113, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:16 AM" },
    { id: 114, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:09 AM" },
    { id: 115, lastName: "Cera", firstName: "Robert", middleName: "Unknown", program: "BSOA", yearLevel: 4, time: "08:03 AM" },
];

export default function QrScannerDashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceList, setAttendanceList] = useState(INITIAL_ATTENDANCE_RECORDS);
  const [showToast, setShowToast] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("eventId") || "";

  const [scannedProfile, setScannedProfile] = useState({
    lastName: "Gomez",
    firstName: "Ricardo",
    middleName: "S.",
    program: "BS Information Technology",
    status: "Present"
  });
  
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const lastScannedTextRef = useRef("");
  const throttleTimeoutRef = useRef(null);

  const handleBack = () => {
    // Dito mo ilalagay ang pabalik na logic, halimbawa: window.history.back() o router navigation mo
    window.history.back();
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio feedback failed:", e);
    }
  };

  const startScanner = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("reader");
      }
      setIsScanning(true);

      const config = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          return { width: Math.floor(minEdge * 0.7), height: Math.floor(minEdge * 0.7) };
        },
        aspectRatio: 1.0
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (decodedText === lastScannedTextRef.current && throttleTimeoutRef.current) return;

          clearTimeout(throttleTimeoutRef.current);
          lastScannedTextRef.current = decodedText;
          throttleTimeoutRef.current = setTimeout(() => { lastScannedTextRef.current = ""; }, 2000);

          playBeep();
          setShowToast(true);
          
          const now = new Date();
          const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          let parsedLastName = "Unknown";
          let parsedFirstName = "Student";
          let parsedMiddleName = "";
          let parsedProgram = "Unassigned";
          let parsedYear = "1";

          if (decodedText.includes(',')) {
            const parts = decodedText.split('|');
            const nameParts = parts[0]?.split(',');
            parsedLastName = nameParts[0]?.trim() || "Unknown";
            parsedFirstName = nameParts[1]?.trim() || "Student";
            parsedProgram = parts[1]?.trim() || "BSIT";
            parsedYear = parts[2]?.trim() || "1";
          } else {
            parsedFirstName = decodedText;
          }

          setScannedProfile({
            lastName: parsedLastName,
            firstName: parsedFirstName,
            middleName: parsedMiddleName,
            program: parsedProgram.length <= 5 ? `BS ${parsedProgram}` : parsedProgram,
            status: "Present"
          });

          setAttendanceList(prev => [
            {
              id: prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 101,
              lastName: parsedLastName,
              firstName: parsedFirstName,
              middleName: parsedMiddleName || "Unknown",
              program: parsedProgram,
              yearLevel: parseInt(parsedYear) || 1,
              time: timestamp
            },
            ...prev
          ]);
        }
      );
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Failed to initialize camera stream.");
      stopScanner();
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner smoothly:", err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop();
      }
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', padding: '32px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Premium Dashboard Global Style Injector */}
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
          max-width: 1300px;
          width: 100%;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 4.5fr 7.5fr;
          }
        }
        .premium-card {
          background-color: #1e293b;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
        }
        .back-btn-box {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          transition: all 0.2s ease;
          margin-right: 8px;
        }
        .back-btn-box:hover {
          background-color: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }
        .dark-table-container {
          width: 100%;
          overflow-x: auto;
          background-color: #111827;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .dark-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }
        .dark-table th {
          background-color: #1f2937;
          color: #9ca3af;
          padding: 14px 18px;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .dark-table td {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          color: #e5e7eb;
        }
        .dark-table tr:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
        @keyframes laser-glow {
          0% { top: 4%; opacity: 0.3; }
          50% { opacity: 1; }
          100% { top: 94%; opacity: 0.3; }
        }
        .cyber-laser {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, transparent, #eab308, transparent);
          box-shadow: 0 0 12px #eab308;
          animation: laser-glow 2.2s ease-in-out infinite;
          pointer-events: none;
          z-index: 10;
        }
        #reader {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
        #reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 8px !important;
        }
        #reader __dashboard_section_csr__, #reader img {
          display: none !important;
        }
      `}</style>

      {/* Header Bar Area */}
      <header style={{ width: '100%', maxWidth: '1300px', margin: '0 auto 36px auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          
          {/* ARROW BACK BUTTON CONTAINER */}
          <button onClick={handleBack} className="back-btn-box" title="Go Back">
            <ArrowLeft size={22} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#1e293b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', color: '#eab308' }}>
              <QrCode size={22} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.025em', margin: 0 }}>ATTENDANCE SCANNER {eventId ? `ID-${eventId}` : ""}</h1>
          </div>
        </div>
      </header>

      {/* Grid Blueprint */}
      <main className="dashboard-grid">
        
        {/* LEFT COMPONENT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Card Module 1: Cam Engine View */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>Scan Student QR</h3>
            
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: '#0b0f19', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isScanning && <div className="cyber-laser" />}
              
              {/* HUD Frame Box Corners */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', zIndex: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ width: '18px', height: '18px', borderTop: '3px solid #eab308', borderLeft: '3px solid #eab308', borderRadius: '2px 0 0 0' }} />
                  <div style={{ width: '18px', height: '18px', borderTop: '3px solid #eab308', borderRight: '3px solid #eab308', borderRadius: '0 2px 0 0' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto' }}>
                  <div style={{ width: '18px', height: '18px', borderBottom: '3px solid #eab308', borderLeft: '3px solid #eab308', borderRadius: '0 0 0 2px' }} />
                  <div style={{ width: '18px', height: '18px', borderBottom: '3px solid #eab308', borderRight: '3px solid #eab308', borderRadius: '0 0 2px 0' }} />
                </div>
              </div>

              <div id="reader" ref={scannerRef}></div>
              
              {!isScanning && (
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#475569' }}>
                  <CameraOff size={44} style={{ marginBottom: '10px' }} />
                  <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Scanner Off</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px' }}>
              {!isScanning ? (
                <button 
                  onClick={startScanner}
                  style={{ width: '100%', backgroundColor: '#eab308', color: '#0f172a', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(234,179,8,0.2)' }}
                >
                  <Play size={14} fill="currentColor" /> Initialize Scanner
                </button>
              ) : (
                <button 
                  onClick={stopScanner}
                  style={{ width: '100%', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Square size={14} fill="currentColor" /> Terminate Feed
                </button>
              )}
            </div>
          </div>

          {/* Card Module 2: Live Profile Monitoring Card */}
          <div className="premium-card" style={{ borderLeft: '4px solid #eab308', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                {scannedProfile.lastName}, {scannedProfile.firstName} {scannedProfile.middleName}
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', margin: 0 }}>{scannedProfile.program}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ display: 'inline-flex', padding: '6px 14px', backgroundColor: 'rgba(234,179,8,0.1)', color: '#eab308', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {scannedProfile.status}
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px', fontWeight: '600', transition: 'opacity 0.3s', opacity: showToast ? 1 : 0 }}>
                <CheckCircle size={16} />
                <span>Verified Entry Logged</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COMPONENT COLUMN: Main Table Spreadsheet */}
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Attended Log Sheet <span style={{ color: '#64748b', fontWeight: '400', fontSize: '13px' }}>(dapat kung anong pangalan ng pinindot na event ang lalabas dito)</span>
            </h2>
            <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', backgroundColor: '#0f172a', color: '#eab308', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {attendanceList.length} Rows
            </span>
          </div>

          <div className="dark-table-container">
            <table className="dark-table">
              <thead>
                <tr>
                  <th style={{ color: '#eab308' }}>Attendance ID</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th style={{ textAlign: 'center' }}>Program</th>
                  <th style={{ textAlign: 'center' }}>Year</th>
                  <th style={{ textAlign: 'right' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '64px', textAlign: 'center', color: '#4b5563' }}>
                      <Layers size={36} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
                      No logs fetched for this cycle.
                    </td>
                  </tr>
                ) : (
                  attendanceList.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: '700', color: '#eab308' }}>{row.id}</td>
                      <td style={{ color: '#ffffff' }}>{row.lastName}</td>
                      <td>{row.firstName}</td>
                      <td style={{ color: '#64748b' }}>{row.middleName}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '3px 8px', backgroundColor: '#1f2937', color: '#9ca3af', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>{row.program}</span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '700', color: '#94a3b8' }}>{row.yearLevel}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8', fontWeight: '600' }}>{row.time}</td>
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