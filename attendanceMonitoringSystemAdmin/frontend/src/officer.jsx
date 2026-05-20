import React, { useState, useRef, useEffect } from "react";

export default function Officer() {
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="uni-view fade-in">
        <header className="uni-header">
          <h1 className="main-title">SEMESTER</h1>
        </header>

        <div className="uni-table-container">
          <div className="table-grid-header">
            <span>Officers ID</span>
            <span>Student ID</span>
            <span>Org ID</span>
            <span>Position</span>
            <span>Action</span>
          </div>
          <div className="uni-list">
            <div className="uni-table-grid-row">
              <span>1</span>
              <span>1</span>
              <span>1</span>
              <span>1</span>
              <span>1</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
