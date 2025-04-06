import React, { useState, useEffect } from 'react';

const RealTimeTranscription = () => {
  const [stream, setStream] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);

  useEffect(() => {
    // Establish WebSocket connection only once
    const ws = new WebSocket("ws://localhost:8000/ws/transcription/");

    ws.onopen = () => {
      console.log('WebSocket connection established.');
      setIsWebSocketOpen(true); // Set WebSocket state to open
    };

    ws.onmessage = (event) => {
      setTranscription(event.data); // Update transcription from backend
    };

    ws.onclose = (event) => {
      console.error('WebSocket connection closed.', event);
      setIsWebSocketOpen(false); // Update WebSocket state to closed
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsWebSocketOpen(false);  // Update WebSocket state to closed if error
    };

    setSocket(ws); // Set socket state to manage it globally

    return () => {
      // Clean up the WebSocket on component unmount
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        console.log("WebSocket connection closed during cleanup.");
      }
    };
  }, []);

  useEffect(() => {
  // Request microphone access for recording
  if (isWebSocketOpen) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((userStream) => {
        setStream(userStream);
        // For recording with WebM Opus format
        const recorder = new MediaRecorder(userStream, { mimeType: 'audio/webm; codecs=opus' });


        // Log the MIME type of the recorded audio format
        console.log("Recorder MIME type: ", recorder.mimeType); // Logs the MIME type of the audio format

        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (isWebSocketOpen) {
            console.log("Sending audio data to backend:", event.data);
            // Split data if it's too large (e.g., > 8 KB)
            const chunkSize = 8192;  // 8 KB chunks
            const chunkCount = Math.ceil(event.data.size / chunkSize);
            for (let i = 0; i < chunkCount; i++) {
              const start = i * chunkSize;
              const end = Math.min(start + chunkSize, event.data.size);
              const chunk = event.data.slice(start, end);
              socket.send(chunk); // Send chunk to backend
            }
          } else {
            console.warn('WebSocket is not open, cannot send data.');
          }
        };

        recorder.onstart = () => {
          console.log('Recording started');
        };

        recorder.onstop = () => {
          console.log('Recording stopped');
        };

        if (isRecording) {
          recorder.start(1000);  // Send data every second
        } else {
          recorder.stop();
        }
      })
      .catch((err) => {
        console.error("Error accessing microphone", err);
      });
  }
}, [isRecording, isWebSocketOpen]);  // Added socket and isWebSocketOpen as dependencies
  // Added socket and isWebSocketOpen as dependencies

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // setTranscription('');  // Clear transcription when stopped
  };

  return (
    <div className="transcription-container" style={styles.container}>
      <h1 style={styles.header}>Real-Time Transcription</h1>
      <p style={styles.status}>{isRecording ? 'Recording in progress...' : 'Click "Start" to begin'}</p>

      <div style={styles.transcriptionBox}>
        <h2 style={styles.transcriptionHeader}>Live Transcription:</h2>
        <p style={styles.transcriptionText}>{transcription}</p>
      </div>

      <div style={styles.controls}>
        {!isRecording ? (
          <button onClick={startRecording} style={styles.button}>Start Transcription</button>
        ) : (
          <button onClick={stopRecording} style={styles.button}>Stop Transcription</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
    borderRadius: '10px',
    textAlign: 'center',
  },
  header: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  status: {
    fontSize: '18px',
    marginBottom: '20px',
  },
  transcriptionBox: {
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    minHeight: '200px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  transcriptionHeader: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  transcriptionText: {
    fontSize: '16px',
    whiteSpace: 'pre-wrap',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    backgroundColor: '#444',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default RealTimeTranscription;
