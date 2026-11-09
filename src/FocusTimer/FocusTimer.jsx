

import { useState, useEffect, useRef } from "react";
import "./FocusTimer.css";

const INITIAL_TIME = 25 * 60;

function getSavedSessions() {
  try {
    const saved = localStorage.getItem("sessions");
    return saved ? Math.max(0, Number(saved) || 0) : 0;
  } catch {
    return 0;
  }
}

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");

  const [sessions, setSessions] = useState(getSavedSessions);

  const intervalRef = useRef(null);

  // Format seconds into MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  // Start timer
  function handleStart() {
    if (isRunning || timeLeft === 0) return;

    setMessage("");
    setIsRunning(true);
  }

  // Pause timer
  function handlePause() {
    setIsRunning(false);
  }

  // Reset timer
  function handleReset() {
    setIsRunning(false);
    setTimeLeft(INITIAL_TIME);
    setMessage("");
  }

  // Countdown effect
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

  // Detect timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setMessage("Time for a break!");
      setSessions((previous) => previous + 1);
    }
  }, [timeLeft, isRunning]);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sessions", String(sessions));
    } catch (error) {
      console.warn("Unable to save sessions:", error);
    }
  }, [sessions]);

  // Update browser tab title
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} | Focus Timer`;

    return () => {
      document.title = "Focus Timer";
    };
  }, [timeLeft]);

  return (
    <main className="timer-container">

      <h1>Focus Timer</h1>

      <p className="timer-subtitle">
        Stay focused. One task at a time.
      </p>

      <div className="timer-display">
        {formatTime(timeLeft)}
      </div>

      <div className="timer-buttons">

        <button
          onClick={handleStart}
          disabled={isRunning || timeLeft === 0}
        >
          Start
        </button>

        <button
          onClick={handlePause}
          disabled={!isRunning}
        >
          Pause
        </button>

        <button onClick={handleReset}>
          Reset
        </button>

      </div>

      <p className="timer-message" aria-live="polite">
        {message}
      </p>

      <div className="session-counter">
        <h3>Sessions completed</h3>
        <span>{sessions}</span>
      </div>

    </main>
  );
}