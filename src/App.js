import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import MeetingView from "./components/MeetingView";  // Import MeetingView page
import RealTimeTranscription from "./components/RealTimeTranscription";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/meeting-view" element={<MeetingView />} />  {/* Route for MeetingView */}
        <Route path="/real-time-transcription" element={<RealTimeTranscription />} />  {/* Route for MeetingView */}
      </Routes>
    </Router>
  );
}

export default App;
