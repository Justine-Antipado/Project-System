import React, { useState, useEffect } from "react";
import axios from "axios";

const API =
  "http://localhost/Attendance%20Project%20System/attendanceMonitoringSystemAdmin/backend";

export default function Semester() {
  const semesterColumns = "2fr 2fr 2fr";
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/showSemester.php`)
      .then((res) => {
        if (res.data.status === "success") {
          const mapped = res.data.data.map((row) => ({
            id: row.SemesterID,
            yearId: row.YearID,
            yearRange: row.YearRange,
            name: row.SemesterName,
          }));
          setSemesters(mapped);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <>
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">SEMESTER</h1>
        </header>

        <div className="uni-table-container">
          <div
            className="table-grid-header"
            style={{ gridTemplateColumns: semesterColumns }}
          >
            <span>Semester ID</span>
            <span>School Year</span>
            <span>Semester Name</span>
          </div>

          <div className="uni-list">
            {semesters.map((semester) => (
              <div
                key={semester.id}
                className="uni-table-grid-row"
                style={{ gridTemplateColumns: semesterColumns }}
              >
                <span className="uni-id-text">ID-{semester.id}</span>
                <span>SY{semester.yearRange}</span>
                <span className="uni-highlight-text">{semester.name}</span>
              </div>
            ))}

            {semesters.length === 0 && (
              <div className="uni-no-records">No semester records found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
