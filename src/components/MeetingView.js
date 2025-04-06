import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import './MeetingView.css';

const MeetingView = () => {
  const [filter, setFilter] = useState('1-line-filter');

  const transcriptionLines = [
    { speaker: 'Speaker A', text: 'Welcome to the meeting, everyone. Let’s discuss the upcoming project.' },
    { speaker: 'Speaker B', text: 'I think we should start by reviewing the client’s requirements and setting our goals accordingly.' },
    { speaker: 'Speaker C', text: 'I offer to transcribe key points and share them after the meeting.' },
    { speaker: 'Speaker D', text: 'I volunteer to create a task list and assign responsibilities.' },
    { speaker: 'Speaker A', text: 'This week, finalize initial plans by the end of the week.' },
    { speaker: 'Speaker A', text: 'Welcome to the meeting, everyone. Let’s discuss the upcoming project.' },
    { speaker: 'Speaker B', text: 'I think we should start by reviewing the client’s requirements and setting our goals accordingly.' },
    { speaker: 'Speaker C', text: 'I offer to transcribe key points and share them after the meeting.' },
    { speaker: 'Speaker D', text: 'I volunteer to create a task list and assign responsibilities.' },
    { speaker: 'Speaker A', text: 'This week, finalize initial plans by the end of the week.' },
    { speaker: 'Speaker A', text: 'Welcome to the meeting, everyone. Let’s discuss the upcoming project.' },
    { speaker: 'Speaker B', text: 'I think we should start by reviewing the client’s requirements and setting our goals accordingly.' },
    { speaker: 'Speaker C', text: 'I offer to transcribe key points and share them after the meeting.' },
    { speaker: 'Speaker D', text: 'I volunteer to create a task list and assign responsibilities.' },
    { speaker: 'Speaker A', text: 'This week, finalize initial plans by the end of the week.' },
    { speaker: 'Speaker A', text: 'Welcome to the meeting, everyone. Let’s discuss the upcoming project.' },
    { speaker: 'Speaker B', text: 'I think we should start by reviewing the client’s requirements and setting our goals accordingly.' },
    { speaker: 'Speaker C', text: 'I offer to transcribe key points and share them after the meeting.' },
    { speaker: 'Speaker D', text: 'I volunteer to create a task list and assign responsibilities.' },
    { speaker: 'Speaker A', text: 'This week, finalize initial plans by the end of the week.' },
    { speaker: 'Speaker A', text: 'Welcome to the meeting, everyone. Let’s discuss the upcoming project.' },
    { speaker: 'Speaker B', text: 'I think we should start by reviewing the client’s requirements and setting our goals accordingly.' },
    { speaker: 'Speaker C', text: 'I offer to transcribe key points and share them after the meeting.' },
    { speaker: 'Speaker D', text: 'I volunteer to create a task list and assign responsibilities.' },
    { speaker: 'Speaker A', text: 'This week, finalize initial plans by the end of the week.' },
  ];

  return (
    <div className="meeting-view-container">
      <h1 className="meeting-view-title">AI‑powered Meeting Notes</h1>
      
      <div className="main-row">
        {/* Left column: Transcription */}
        <div className="transcription-col">
          <div className="card transcription-card">
            <div className="card-header"><h2>Transcription</h2></div>
            <div className="card-content">
              {transcriptionLines.map((line, i) => (
                <p key={i}>
                  <strong>{line.speaker}:</strong> {line.text}
                </p>
              ))}
            </div>
            <div className="card-footer">
              <button className="download-button">
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Summary above Tasks */}
        <div className="right-col">
          <div className="card summary-card">
            <div className="card-header summary-header">
              <h2>Summary</h2>
              <select
                className="filter-dropdown"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="1-line-filter">1 line filter</option>
                <option value="2-filter">2 filter</option>
                <option value="3-line-filter">3 line filter</option>
              </select>
            </div>
            <div className="card-content">
              <p>
                The meeting focused on reviewing client requirements, setting goals,
                transcribing key points, and creating a task list with assigned responsibilities.
              </p>
            </div>
            <div className="card-footer">
              <button className="download-button">
                <FaDownload /> Download
              </button>
            </div>
          </div>

          <div className="card tasks-card">
            <div className="card-header"><h2>Tasks & Decisions</h2></div>
            <div className="card-content">
              <p>
                This week, finalize initial project plans after reviewing client needs and setting goals.
              </p>
            </div>
            <div className="card-footer">
              <button className="download-button">
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingView;
