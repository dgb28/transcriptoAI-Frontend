// MeetingAnalysis.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MeetingAnalytics.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Utils
const getSpeakerData = (dialogue) => {
  const speakerWordCount = {};

  dialogue.forEach((entry) => {
    const speakerText = entry.sentence || "";
    const speaker = entry.speaker || "Anonymous";
    const wordCount = speakerText.trim().split(/\s+/).length;

    if (!speakerWordCount[speaker]) {
      speakerWordCount[speaker] = 0;
    }
    speakerWordCount[speaker] += wordCount;
  });

  const totalWords = Object.values(speakerWordCount).reduce((a, b) => a + b, 0);

  return Object.entries(speakerWordCount).map(([name, count]) => ({
    name,
    value: parseFloat(((count / totalWords) * 100).toFixed(2)),
  }));
};

const getTopicData = (summaryText) => {
  const topics = summaryText.split(", ").map((s) => s.trim());
  const avgDuration = Math.floor(100 / topics.length || 1); // avoid div by 0

  return topics.map((topic) => ({
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    duration: avgDuration,
  }));
};

const getActionItems = (actionsArray) => {
  return actionsArray.map((item) => ({
    text: item.deadline
      ? `${item.task} (Deadline: ${item.deadline})`
      : item.task,
    assignedTo: item.person,
  }));
};

const MeetingAnalysis = () => {
  const location = useLocation();
  const { result } = location.state || {};
  const [speakerData, setSpeakerData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [actionItems, setActionItems] = useState([]);

  useEffect(() => {
    if (result) {
      const dialogue =
        result.sentiment?.sentimentanalysis || result.transcript?.transcribed_dialogue || [];
      const summary = result.summary?.summary || "";
      const actions = result.actions?.actionextractor || [];

      setSpeakerData(getSpeakerData(dialogue));
      setTopicData(getTopicData(summary));
      setActionItems(getActionItems(actions));
    }
  }, [result]);

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Meeting Analysis</h1>

      {/* Top Row: Two Sections Side by Side */}
      <div className="analytics-grid-top">
        <div className="analytics-section">
          <h2 className="section-title">Engagement</h2>
          <div className="speaker-content">
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie data={speakerData} dataKey="value" outerRadius={100} label>
                  {speakerData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="speaker-description">
              {speakerData.map((d, i) => (
                <p key={i}>
                  <span>{d.name}</span>: {d.value}% (~{Math.round(d.value * 2)} words)
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h2 className="section-title">Focus</h2>
          <div className="topic-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicData} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="topic"
                  type="category"
                  tick={{ fill: "#fff", fontSize: 14 }}
                  width={250}
                />
                <Tooltip />
                <Bar dataKey="duration" fill="#00C49F" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="analytics-section analytics-section-bottom">
        <h2 className="section-title">Tasks</h2>
        <div className="action-table-wrapper">
          <table className="action-table">
            <thead>
              <tr>
                <th>Action Item</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.text}</td>
                  <td>{item.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MeetingAnalysis;
