import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaPlayCircle } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("audio_file", file);

    fetch("http://localhost:8000/transcriptionai/run_pipeline/", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        navigate("/meeting-view", { state: { result: data } });
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
        setLoading(false);
      });
  };

  const handleLiveTranscription = () => {
    // adjust URL to wherever your Streamlit app is hosted
    window.open("http://localhost:8501", "_blank");
  };

  return (
    <div className="homepage-container">
      <header className="header">
        <h1>AI-powered Meeting Companion</h1>
        <p>Transcribe, summarize, and analyze your meetings effortlessly</p>
      </header>

      <section className="upload-section">
        {/* File‑Upload Box */}
        <div className="upload-box">
          <div className="upload-area">
            <input
              type="file"
              accept=".mp3,.wav,.mp4"
              onChange={handleFileChange}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-label">
              <FaCloudUploadAlt size={40} />
              <span>Upload a meeting recording</span>
            </label>
            {file && <p className="file-name">File selected: {file.name}</p>}
          </div>
          <button className="upload-button" onClick={handleUpload}>
            {loading ? "Uploading…" : "Upload Recording"}
          </button>
          {loading && <div className="spinner"></div>}
        </div>

        {/* Live‑Transcription Box */}
        <div className="upload-box live-box">
          <div className="upload-area">
            <FaPlayCircle size={40} />
            <span>Click here for live transcription</span>
          </div>
          <button
            className="upload-button"
            onClick={handleLiveTranscription}
          >
            Start Live Transcription
          </button>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <FaPlayCircle size={40} onClick={redirect}/>
          <h3>Real-Time Transcription</h3>
          <p>Transcribe meetings live as they happen.</p>
        </div>
        <div className="feature-card">
          <FaTasks size={40} />
          <h3>Action Items & Decisions</h3>
          <p>Automatically extract key action items and decisions.</p>
        </div>
        <div className="feature-card">
          <FaCloudUploadAlt size={40} />
          <h3>Summarization</h3>
          <p>Get quick summaries of what was discussed.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;