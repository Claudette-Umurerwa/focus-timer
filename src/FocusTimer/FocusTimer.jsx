
import { useState, useEffect, useRef } from "react";
import "./focusTimer.css";

export default function FocusTimer() {
  const INITIAL_TIME = 25 * 60;

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");

  const [sessions, setSessions] = useState(() => {
    return Number(localStorage.getItem("sessions")) || 0;
  });

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
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Detect timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setMessage("Time for a break!");

      setSessions((previousSessions) => previousSessions + 1);
    }
  }, [timeLeft, isRunning]);

  // Save sessions in localStorage
  useEffect(() => {
    localStorage.setItem("sessions", sessions);
  }, [sessions]);

  // Update browser tab title
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} | Focus Timer`;

    return () => {
      document.title = "Focus Timer";
    };
  }, [timeLeft]);

  return (
    <div className="timer-container">

      <h1>Focus Timer</h1>

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

      <p className="timer-message">
        {message}
      </p>

      <h3>
        Sessions completed: {sessions}
      </h3>

    </div>
  );
}