import React, { useState } from 'react';
import { LayoutDashboard, History, Settings, User, Check, X, Camera, LogOut, Info, CalendarCheck, TrendingUp } from 'lucide-react';
import './dashboard.css';
import omscLogo from './assets/omsc.logo.png';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [focusedField, setFocusedField] = useState(null);
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });

  const validate = (p) => ({
    length: p.length >= 8,
    number: /\d/.test(p),
    special: /[!@#$%^&*]/.test(p),
    upperLower: /[a-z]/.test(p) && /[A-Z]/.test(p),
  });

  const reqs = validate(passData.new);
  const allMet = Object.values(reqs).every(Boolean);

  return (
    <div className="app-layout">
      {/* Background Blobs for Aesthetic */}
       <div className="blob blob-1"></div>
       <div className="blob blob-2"></div>
 
       {/* --- SIDEBAR NAVIGATION --- */}
       <aside className="sidebar">
         <div className="sidebar-header">
             {/* Logo placeholder - replace with your actual logo path */}
             <div className="system-logo">
                <img src={omscLogo} alt="OMSC Logo"  /> 
             </div>
             <div className="system-info">
                <h2 className="system-name">Events Attendance System</h2>
             </div>
         </div>
 
         <nav className="nav-menu">
           <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
             <LayoutDashboard size={20} /> Dashboard
           </div>
           <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
             <History size={20} /> Attendance History
           </div>
           <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
             <Settings size={20} /> Settings
           </div>
         </nav>
 
         <div className="logout-section">
           <div className="nav-item logout-btn">
             <LogOut size={20} /> Logout
           </div>
         </div>
       </aside>
 
       {/* --- MAIN CONTENT --- */}
       <main className="main-content">
         
         {/* VIEW 1: UPDATED BENTO DASHBOARD */}
         {activeTab === 'dashboard' && (
           <div className="dashboard-view fade-in">
             <header className="welcome-header">
               <p className="sub-text">Welcome back! 👋</p>
               <h1 className="main-title">DASHBOARD</h1>
             </header>
 
             <div className="bento-grid">
               {/* Card 1: User Profile Information */}
               <div className="bento-card profile-info-card">
                 <div className="card-header">
                    <Info size={18} className="icon-muted" />
                    <span>Student Information</span>
                 </div>
                 <div className="profile-details">
                   <h2 className="student-name">Gomez, <br />Ricardo Santiago</h2>
                   <div className="detail-group">
                     <label>ID</label>
                     <p>24-1-03962</p>
                   </div>
                   <div className="detail-group">
                     <label>Program</label>
                     <p>Bachelor of Science in Information Technology</p>
                   </div>
                   <div className="detail-group">
                     <label>Year Level</label>
                     <p>1st Year</p>
                   </div>
                 </div>
               </div>
 
               {/* Card 2: QR Code Section */}
               <div className="bento-card qr-card">
                 <div className="qr-container">
                   {/* Actual QR Image Placeholder */}
                   <img src="/qr-placeholder.png" alt="Student QR Code" className="qr-image" />
                 </div>
                 <p className="qr-hint">Scan for Attendance</p>
               </div>
 
               {/* Card 3: Total Events */}
               <div className="bento-card stats-card">
                 <div className="card-header">
                   <CalendarCheck size={18} className="icon-blue" />
                   <span>Total Events Attended</span>
                 </div>
                 <div className="stats-content">
                   <h2 className="stats-value">12</h2>
                   <p className="stats-label">Events</p>
                 </div>
               </div>
 
               {/* Card 4: Attendance Rating */}
               <div className="bento-card stats-card">
                 <div className="card-header">
                   <TrendingUp size={18} className="icon-green" />
                   <span>Attendance Rating</span>
                 </div>
                 <div className="stats-content">
                   <h2 className="stats-value">95%</h2>
                   <p className="stats-label rating-excellent">— Excellent</p>
                 </div>
               </div>
             </div>
           </div>
         )}
 
         {/* --- SETTINGS & HISTORY views remain the same below --- */}
         {activeTab === 'settings' && ( 
           <div className="fade-in" style={{maxWidth: '800px'}}>
             <h2 style={{marginBottom: '1.5rem'}}>Account Settings</h2>
             
             <div className="bento-grid">
               {/* Profile Change */}
               <div className="glass-card profile-upload-section">
                 <p className="label-text">Profile Picture</p>
                 <div className="avatar-circle">
                   <User size={50} style={{marginTop: '30px', color: '#ccc'}} />
                   <div style={{position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', padding: '5px'}}>
                     <Camera size={16} color="white" />
                   </div>
                 </div>
                 <button className="btn-save" style={{background: '#f1f5f9', color: 'var(--omsc-dark)'}}>Upload Photo</button>
               </div>
 
               {/* Password Change Form (Same Logic/Style as Auth) */}
               <div className="glass-card" style={{gridColumn: 'span 1'}}>
                 <h4 style={{marginBottom: '1rem'}}>Change Password</h4>
                 
                 <div className="field-group">
                   <label className="label-text">Current Password</label>
                   <input type="password" className="form-input" placeholder="••••••••" />
                 </div>
 
                 <div className="field-group">
                   <label className="label-text">New Password</label>
                   <input 
                     type="password" 
                     className="form-input" 
                     placeholder="••••••••"
                     value={passData.new}
                     onChange={(e) => setPassData({...passData, new: e.target.value})}
                     onFocus={() => setFocusedField('new')}
                     onBlur={() => setFocusedField(null)}
                   />
                   
                   {/* POPUP LOGIC UI */}
                   <div className={`password-requirements-popup ${focusedField === 'new' && !allMet ? 'visible' : ''}`}>
                     <h5 style={{fontSize: '12px', marginBottom: '8px'}}>Must follow:</h5>
                     <div className={`req-item ${reqs.length ? 'met' : ''}`}>
                       {reqs.length ? <Check size={14}/> : <X size={14}/>} 8+ Characters
                     </div>
                     <div className={`req-item ${reqs.number ? 'met' : ''}`}>
                       {reqs.number ? <Check size={14}/> : <X size={14}/>} Contains Number
                     </div>
                     <div className={`req-item ${reqs.upperLower ? 'met' : ''}`}>
                       {reqs.upperLower ? <Check size={14}/> : <X size={14}/>} Mixed Case
                     </div>
                   </div>
                 </div>
 
                 <div className="field-group">
                   <label className="label-text">Confirm New Password</label>
                   <input 
                     type="password" 
                     className="form-input" 
                     placeholder="••••••••"
                     value={passData.confirm}
                     onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                   />
                   {passData.confirm && passData.new !== passData.confirm && (
                     <span style={{fontSize: '10px', color: 'red', marginLeft: '10px'}}>Passwords do not match</span>
                   )}
                 </div>
 
                 <button className="btn-save">Save Changes</button>
               </div>
             </div>
           </div>
  )}
         {activeTab === 'history' && ( 
  <div className="glass-card fade-in">
             <h2 style={{marginBottom: '1rem'}}>Attendance History</h2>
             <table style={{width: '100%', borderCollapse: 'collapse'}}>
               <thead>
                 <tr style={{textAlign: 'left', borderBottom: '2px solid #eee'}}>
                   <th style={{padding: '12px'}}>Date</th>
                   <th style={{padding: '12px'}}>Event</th>
                   <th style={{padding: '12px'}}>Status</th>
                 </tr>
               </thead>
               <tbody>
                 <tr style={{borderBottom: '1px solid #eee'}}>
                   <td style={{padding: '12px'}}>Sept 02, 2025</td>
                   <td style={{padding: '12px'}}>General Assembly</td>
                   <td style={{padding: '12px', color: 'var(--color-met)'}}>Present</td>
                 </tr>
               </tbody>
             </table>
           </div>
  )}
       </main>
     </div>
   );
 };
 
 export default Dashboard;