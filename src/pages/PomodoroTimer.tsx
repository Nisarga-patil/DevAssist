// src/components/PomodoroTimer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Settings } from 'lucide-react';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'work' | 'break';
  sessions: number;
}
interface SettingsState {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export function PomodoroTimer() {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    mode: 'work',
    sessions: 0,
  });
  const [settings, setSettings] = useState<SettingsState>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    audioRef.current.src = 'data:audio/wav;base64,...'; // Audio data omitted
    audioRef.current.load();
  }, []);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            audioRef.current.play().catch(() => {});
            const newMode = prev.mode === 'work' ? 'break' : 'work';
            const newSessions = prev.mode === 'work' ? prev.sessions + 1 : prev.sessions;
            const isLong = newMode === 'break' && newSessions % settings.sessionsUntilLongBreak === 0;
            const newMinutes = newMode === 'work'
              ? settings.workDuration
              : isLong
                ? settings.longBreakDuration
                : settings.breakDuration;
            return {
              ...prev,
              minutes: newMinutes,
              seconds: 0,
              isRunning: false,
              mode: newMode,
              sessions: newSessions,
            };
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => clearInterval(intervalRef.current!);
  }, [timer.isRunning, settings]);

  const toggleTimer = () => setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  const resetTimer = () => {
    const d = timer.mode === 'work' ? settings.workDuration : settings.breakDuration;
    setTimer(prev => ({ ...prev, minutes: d, seconds: 0, isRunning: false }));
  };
  const switchMode = (mode: 'work' | 'break') => {
    setTimer(prev => ({
      ...prev,
      mode,
      minutes: mode === 'work' ? settings.workDuration : settings.breakDuration,
      seconds: 0,
      isRunning: false,
    }));
  };

  const totalSeconds =
    timer.mode === 'work'
      ? settings.workDuration * 60
      : timer.sessions % settings.sessionsUntilLongBreak === 0
      ? settings.longBreakDuration * 60
      : settings.breakDuration * 60;
  const currentSeconds = timer.minutes * 60 + timer.seconds;
  const progress = (1 - currentSeconds / totalSeconds) * 100;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Pomodoro Timer</h1>
      <p className="text-center text-gray-600">Stay focused with the Pomodoro technique</p>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => switchMode('work')}
            className={`px-3 py-1 rounded ${
              timer.mode === 'work'
                ? 'bg-red-200 text-red-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <BookOpen className="inline-block mr-1" /> Work
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-3 py-1 rounded ${
              timer.mode === 'break'
                ? 'bg-green-200 text-green-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Coffee className="inline-block mr-1" /> Break
          </button>
        </div>

        <div className="relative w-full aspect-square mb-6">

         
  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
    <circle
      cx="50%"
      cy="50%"
      r="45%"
      className="stroke-current text-gray-200 dark:text-gray-700"
      strokeWidth="8"
      fill="none"
    />
    <circle
      cx="50%"
      cy="50%"
      r="45%"
      className={`stroke-current ${timer.mode === 'work' ? 'text-red-500' : 'text-green-500'}`}
      strokeWidth="10"
      fill="none"
      strokeDasharray={`${2 * Math.PI * 45}`}
      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
      style={{ transition: 'stroke-dashoffset 1s' }}
    />
  </svg>
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-4xl font-bold">
      {timer.minutes.toString().padStart(2, '0')}:{timer.seconds.toString().padStart(2, '0')}
    </span>
    <span className="text-sm mt-1">{timer.mode === 'work' ? 'Focus Time' : 'Break Time'}</span>
  </div>
</div>


        <div className="flex justify-center gap-4 mb-4">
          <button onClick={toggleTimer} className="flex-1 bg-blue-600 text-white rounded py-2 flex items-center justify-center space-x-2">
            {timer.isRunning ? <Pause /> : <Play />} <span>{timer.isRunning ? 'Pause' : 'Start'}</span>
          </button>
          <button onClick={resetTimer} className="flex-1 bg-gray-300 dark:bg-gray-700 rounded py-2 flex items-center justify-center space-x-2">
            <RotateCcw /> Reset
          </button>
        </div>
        <button onClick={() => setShowSettings(true)} className="text-sm text-blue-600 hover:underline">
          <Settings className="inline-block mr-1" />
          Settings
        </button>

        <p className="text-center text-sm mt-4">
          Sessions completed: {timer.sessions}
        </p>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold text-center">Settings</h2>
            {([
              { label: 'Work (min)', key: 'workDuration' },
              { label: 'Short Break (min)', key: 'breakDuration' },
              { label: 'Long Break (min)', key: 'longBreakDuration' },
              { label: 'Sessions till long break', key: 'sessionsUntilLongBreak' },
            ] as const).map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm mb-1">{label}</label>
                <input
                  type="number"
                  min={label.includes('Sessions') ? 2 : 1}
                  value={settings[key]}
                  onChange={e => setSettings({
                    ...settings,
                    [key]: Math.max(1, parseInt(e.target.value) || 1)
                  })}
                  className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            ))}
            <div className="flex justify-between space-x-2">
              <button onClick={() => setShowSettings(false)} className="flex-1 bg-indigo-600 text-white rounded py-2">
                Save
              </button>
              <button onClick={() => setShowSettings(false)} className="flex-1 bg-gray-300 dark:bg-gray-700 rounded py-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
