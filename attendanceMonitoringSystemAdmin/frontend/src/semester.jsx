import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

const INITIAL_MOCK_SEMESTERS = [
  { id: "SEM2023-1", schoolYearId: "SY2023-2024", name: "First Semester" },
  { id: "SEM2023-2", schoolYearId: "SY2023-2024", name: "Second Semester" },
  { id: "SEM2024-SUM", schoolYearId: "SY2023-2024", name: "Summer Semester" },
];

export default function Semester() {
  //const [search, setSearch] = useState('');

  // Style for dynamic grid columns (ID, School Year ID, Semester Name)
  const semesterColumns = "2fr 2fr 2fr";

  /*const filteredSemesters = semester.filter(r => {

  });*/
  return (
    <>
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">SEMESTER</h1>
        </header>

        {/* Page filter and btn 
        <div className="filter-container">
          {/*<div className="search-wrapper"></div>

          <div className="filter-row">
            <button className="uni-btn-primary">
              {/*onClick=handleOpenAddForm...
              <Plus size={16} />
              Add Semester
            </button>
          </div>
        </div>*/}

        <div className="uni-table-container">
          <div
            className="table-grid-header"
            style={{ gridTemplateColumns: semesterColumns }}
          >
            <span>Semester ID</span>
            <span>School Year ID</span>
            <span>Semester Name</span>
          </div>
          <div className="uni-list">
            {INITIAL_MOCK_SEMESTERS.map((semester) => (
              <div
                key={semester.id}
                className="uni-table-grid-row"
                style={{ gridTemplateColumns: semesterColumns }}
              >
                <span className="uni-id-text">{semester.id}</span>
                <span>{semester.schoolYearId}</span>
                <span className="uni-highlight-text">{semester.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
