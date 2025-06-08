import { useState, useEffect, useRef } from "react";
import { TimerDisplay } from "./components/TimerDisplay";
import { TimerControls } from "./components/TimerControls";
import type { TimerState } from "./types/timer";
import { getActiveBank } from "./utils/timer";

const STORAGE_KEY = "breakrupcy-timer-state";
const SAVE_INTERVAL = 10000; // 10 seconds
const TICK_INTERVAL = 1000; // 100ms

const INITIAL_TIMER_STATE: TimerState = {
  bank1: {
    remaining: 25 * 60 * 1000, // 25 minutes in milliseconds
    label: "Work",
    isActive: true,
  },
  bank2: {
    remaining: 5 * 60 * 1000, // 5 minutes in milliseconds
    label: "Break",
    isActive: false,
  },
  isPaused: true,
  lastTick: Date.now(),
};

function App() {
  const [timerState, setTimerState] = useState<TimerState>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, lastTick: Date.now() }; // Reset lastTick on load
      } catch {
        return INITIAL_TIMER_STATE;
      }
    }
    return INITIAL_TIMER_STATE;
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage with debouncing
  const saveToStorage = (state: TimerState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 1000); // Debounce saves by 1 second
  };

  // Timer tick logic
  useEffect(() => {
    if (!timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState((prevState) => {
          const now = Date.now();
          const elapsed = now - prevState.lastTick;
          const activeBank = getActiveBank(prevState);

          const newState = {
            ...prevState,
            lastTick: now,
            [activeBank]: {
              ...prevState[activeBank],
              remaining: Math.max(0, prevState[activeBank].remaining - elapsed),
            },
          };

          // Auto-pause if active bank hits zero
          if (newState[activeBank].remaining <= 0) {
            newState.isPaused = true;
          }

          return newState;
        });
      }, TICK_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.isPaused]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveToStorage(timerState);
    }, SAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, [timerState]);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveToStorage(timerState);
    };
  }, [timerState]);

  const handlePlayPause = () => {
    setTimerState((prevState) => ({
      ...prevState,
      isPaused: !prevState.isPaused,
      lastTick: Date.now(), // Reset tick timestamp
    }));
  };

  const handleSwitch = () => {
    setTimerState((prevState) => ({
      ...prevState,
      bank1: { ...prevState.bank1, isActive: !prevState.bank1.isActive },
      bank2: { ...prevState.bank2, isActive: !prevState.bank2.isActive },
      lastTick: Date.now(), // Reset tick timestamp
    }));
  };

  const handleReset = () => {
    setTimerState({
      ...INITIAL_TIMER_STATE,
      lastTick: Date.now(),
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleBankClick = (bankKey: "bank1" | "bank2") => {
    if (!timerState[bankKey].isActive && !timerState.isPaused) {
      handleSwitch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-gray-800 text-5xl font-bold mb-2">Breakrupcy</h1>
        <p className="text-gray-600 text-xl">Chess Timer for Productivity</p>
      </header>

      <div className="flex justify-center flex-wrap gap-4">
        <TimerDisplay
          bank={timerState.bank1}
          onClick={() => handleBankClick("bank1")}
        />
        <TimerDisplay
          bank={timerState.bank2}
          onClick={() => handleBankClick("bank2")}
        />
      </div>

      <TimerControls
        isPaused={timerState.isPaused}
        onPlayPause={handlePlayPause}
        onSwitch={handleSwitch}
        onReset={handleReset}
      />

      {/* Status indicator */}
      <div className="text-center mt-4 text-gray-600 text-lg">
        {timerState.isPaused
          ? "Paused"
          : `${
              timerState.bank1.isActive
                ? timerState.bank1.label
                : timerState.bank2.label
            } Active`}
      </div>
    </div>
  );
}

export default App;
