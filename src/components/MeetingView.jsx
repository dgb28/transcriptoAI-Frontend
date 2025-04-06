import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import './MeetingView.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';


const MeetingView = () => {
  const location = useLocation();
  const { result } = location.state || {};

  if (!result) {
    return <p>No meeting data available. Please upload a recording first.</p>;
  }

  const initialTranscript = result.transcript?.transcribed_dialogue
    ? result.transcript.transcribed_dialogue
        .map(line => `${line.speaker}: ${line.sentence}`)
        .join("\n")
    : "";

  const [summary, setSummary] = useState(
    result.summary ? result.summary.summary : ""
  );
  const [summaryFilter, setSummaryFilter] = useState("one-line summary");

  const handleSummaryFilterChange = async (e) => {
    const selectedFilter = e.target.value;
    setSummaryFilter(selectedFilter);

    try {
      const response = await fetch(
        "http://localhost:8000/transcriptionai/summarize/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: initialTranscript,
            summary_filter: selectedFilter,
          }),
        }
      );
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error updating summary:", error);
    }
  };

  const handleDownloadTranscript = () => {
    const transcriptData =
      result.sentiment?.sentimentanalysis ||
      result.transcript?.transcribed_dialogue ||
      [];
    const transcriptLines = transcriptData.map((line) => {
      const sentiment = line.sentiment || "neutral";
      return `${line.speaker}: ${line.sentence} [${sentiment}]`;
    });
    const textContent = transcriptLines.join("\n");
    const blob = new Blob([textContent], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "transcript.txt");
  };

  // ← NEW FUNCTION: download the summary text as a .txt file
  const handleDownloadSummary = () => {
    const blob = new Blob([summary], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "summary.txt");
  };

  const navigate = useNavigate();

  const handleDataViz=()=>{
    navigate("/meeting-analysis", { state: { result } });
  }

  const handleDownloadActionsExcel = () => {
    const actionsData = result.actions?.actionextractor || [];
    const worksheet = XLSX.utils.json_to_sheet(actionsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Actions");
    const wbout = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([wbout], {
      type: "application/octet-stream",
    });
    saveAs(blob, "actions.xlsx");
  };

  return (
    <div className="meeting-view-container">
      <h1 className="meeting-view-title">AI‑powered Meeting Notes</h1>
      <div className="main-row">
        {/* Transcription Column */}
        <div className="transcription-col">
          <div className="card transcription-card">
            <div className="card-header">
              <h2>Transcription</h2>
            </div>
            <div className="card-content">
              {(result.sentiment?.sentimentanalysis || []).map((line, i) => {
                const sentiment = line.sentiment || "neutral";
                return (
                  <div key={i} className="transcription-line">
                    <p>
                      <strong>{line.speaker}:</strong> {line.sentence}
                      <span
                        className={`sentiment-box sentiment-${sentiment.toLowerCase()}`}
                      >
                        {sentiment}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="card-footer">
  <button
    className="data-viz-btn"
    style={{ marginRight: 'auto' }}
    onClick={handleDataViz}
  >
    Open Analysis
  </button>
  <button
    className="download-button"
    onClick={handleDownloadTranscript}
  >
    <FaDownload /> Download Transcript
  </button>
</div>
          </div>
        </div>

        {/* Right Column: Summary & Action Items */}
        <div className="right-col">
          {/* Summary Card with Dropdown Filter */}
          <div className="card summary-card">
            <div className="card-header">
              <h2>Summary</h2>
              <select
  className="filter-dropdown"
  value={summaryFilter}
  onChange={handleSummaryFilterChange}
>
  <option value="one-line summary">One Line Summary (20 words)</option>
  <option value="bullet point summary">Bullet Point Summary</option>
  <option value="indepth summary">Indepth Summary (TLDR on top)</option>
  <option value="paragraph summary">Paragraph Summary (50 words)</option>
</select>
            </div>
            <div className="card-content">
              <p>{summary}</p>
            </div>
            <div className="card-footer">
              {/* Hook up the new handler here */}
              <button
                className="download-button"
                onClick={handleDownloadSummary}
              >
                <FaDownload /> Download Summary
              </button>
            </div>
          </div>

          {/* Actions & Decisions Card */}
          <div className="card summary-card">
            <div className="card-header">
              <h2>Actions & Decisions</h2>
            </div>
            <div className="card-content">
              <table className="action-table">
                <thead>
                  <tr>
                    <th>Action Item</th>
                    <th>Assigned To</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {result.actions?.actionextractor &&
                    result.actions.actionextractor.map((item, index) => (
                      <tr key={index}>
                        <td>{item.task}</td>
                        <td>{item.person}</td>
                        <td>{item.deadline}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <button
                className="download-button"
                onClick={handleDownloadActionsExcel}
              >
                <FaDownload /> Download Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingView;
