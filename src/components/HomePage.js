import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation
import { FaCloudUploadAlt, FaPlayCircle, FaTasks } from "react-icons/fa";
import './HomePage.css';  // Importing custom CSS for styling

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // Create navigate instance to handle redirection

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };
  

  // Handle file upload and redirect to MeetingView page
  const handleUpload = () => {
    if (file) {
      setLoading(true); // show spinner
  
      // Simulate async operation (like summarization)
      setTimeout(() => {
        setLoading(false); // hide spinner
        alert(`File ${file.name} uploaded successfully!`);
        navigate("/meeting-view");
      }, 3000); // Simulate 3 seconds. Replace with real API call later.
    } else {
      alert("Please select a file first!");
    }
  };
  
    const redirect = () => {
        navigate("/real-time-transcription");
    }

  return (
    <div className="homepage-container">
    <header className="header" >
        <h1>AI-powered Meeting Companion</h1>
    </header>
          <p>Transcribe, summarize, and analyze your meetings effortlessly</p>

          <section className="upload-section">
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
      {file && <p>File selected: {file.name}</p>}
    </div>

    <button className="upload-button" onClick={handleUpload}>
      Upload Recording
    </button>

    {/* Spinner appears when loading is true */}
    {loading && <div className="spinner"></div>}
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


