import React from "react";

export default function PrintableReport({
  students,
  selectedEvent,
  selectedSemester,
  selectedProgram,
  selectedYear,
  selectedSection,
}) {
  const isAutoSort = !selectedProgram && !selectedYear && !selectedSection;

  // 1. I-sort ang mga estudyante base sa Program, Year, at Section (Para sunod-sunod pa rin)
  const sorted = [...(students || [])].sort((a, b) => {
    if (isAutoSort) {
      if (a.program !== b.program) return a.program.localeCompare(b.program);
      if (a.year !== b.year) return a.year - b.year;
      return a.section.localeCompare(b.section);
    }
    return 0;
  });

  // 2. I-grupo pabalik kasama ang Section (Para hiwalay pa rin ang tables kada section!)
  const groupedData = sorted.reduce((groups, student) => {
    const key = `${student.program}||Year ${student.year}||Section ${student.section}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(student);
    return groups;
  }, {});

  // 3. I-sort ang mga pamagat para hindi magulo ang pagkaka-ayos
  const sortedKeys = Object.keys(groupedData).sort((a, b) => {
    const [progA, yearA, secA] = a.split("||");
    const [progB, yearB, secB] = b.split("||");
    if (progA !== progB) return progA.localeCompare(progB);
    if (yearA !== yearB) return yearA.localeCompare(yearB);
    return secA.localeCompare(secB);
  });

  return (
    <>
      <style>{`
        .printable-report-wrapper {
          display: none !important;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 12mm;
          }

          body * {
            visibility: hidden !important;
          }

          nav, aside, header,
          .sidebar, .uni-sidebar,
          [class*="sidebar"],
          [class*="nav-"],
          [class*="layout-sidebar"] {
            display: none !important;
          }

          main, .main-content,
          [class*="main-content"],
          [class*="page-content"] {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          .printable-report-wrapper,
          .printable-report-wrapper * {
            visibility: visible !important;
          }

          .printable-report-wrapper {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }

          .print-main-title {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 2px;
            color: #000 !important;
            font-family: Arial, sans-serif;
          }

          .print-event-subtitle {
            font-size: 13px;
            margin-bottom: 20px;
            color: #000 !important;
            font-family: Arial, sans-serif;
            font-weight: 500;
          }

          .print-table-section {
            width: 100%;
            margin-bottom: 24px;
            page-break-inside: avoid;
          }

          .print-group-label {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 4px;
            color: #000 !important;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .classic-print-table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 12px;
            background: #fff !important;
          }

          .classic-print-table th,
          .classic-print-table td {
            border: 1px solid #000 !important;
            padding: 6px 8px !important;
            text-align: left;
            color: #000 !important;
          }

          .classic-print-table th {
            font-weight: bold;
          }

          .col-no   { width: 10%; }
          .col-name { width: 65%; }
          .col-sec  { width: 25%; }
        }
      `}</style>

      <div className="printable-report-wrapper">
        <div className="print-main-title">Report</div>
        <div className="print-event-subtitle">
          {selectedEvent || "All Events"}{" "}
          {selectedSemester ? `— ${selectedSemester}` : ""}
        </div>

        {sortedKeys.map((key) => {
          const [prog, yr, sec] = key.split("||");
          return (
            <div key={key} className="print-table-section">
              {/* Ibinalik sa orihinal na label style na may Program at Year */}
              <div className="print-group-label">
                {prog} &mdash; {yr}
              </div>

              <table className="classic-print-table">
                <thead>
                  <tr>
                    <th className="col-no">No.</th>
                    <th className="col-name">Name</th>
                    <th className="col-sec">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData[key].map((student, index) => (
                    // Pinalitan ng template string `print-${student.id}-${index}` ang key para kahit magkapareho ang ID sa mock data mo, mag-re-render pa rin siya nang tama at hindi mag-e-error sa React
                    <tr key={`print-${student.id || index}-${index}`}>
                      <td>{index + 1}.</td>
                      <td style={{ fontWeight: "500" }}>{student.name}</td>
                      {/* Dito pa rin lumalabas ang kanyang Section name sa loob ng row */}
                      <td>Section {student.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </>
  );
}
