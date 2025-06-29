import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Settings } from 'lucide-react';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'work' | 'break';
  sessions: number;
}

export function PomodoroTimer() {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    mode: 'work',
    sessions: 0
  });

  const [settings, setSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  });

  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAz6Xz+/PdiUEKYfN69aJOgiYb8nr6ZrEcxZfWunbtnMbE2yF5dSBP0k4o4G+gGVJ+kB6J/lnJ6/x0WUAjWOl+fvPhZVc5QJ1XxJyP7FG9V5aPNWj+WPLqd1jM1EBdV1P8Cul6Y1hNvpfwjWV2Wj7Xe6n8MGBB3ZQFPG9+MQG5nJ5VQJL6SLILyPwh+kPo0A;');
    audioRef.current.volume = 0.5;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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
            // Timer finished
            playNotification();
            const newMode = prev.mode === 'work' ? 'break' : 'work';
            const newSessions = prev.mode === 'work' ? prev.sessions + 1 : prev.sessions;
            
            let newMinutes;
            if (newMode === 'break') {
              newMinutes = newSessions % settings.sessionsUntilLongBreak === 0 
                ? settings.longBreakDuration 
                : settings.breakDuration;
            } else {
              newMinutes = settings.workDuration;
            }

            return {
              ...prev,
              minutes: newMinutes,
              seconds: 0,
              isRunning: false,
              mode: newMode,
              sessions: newSessions
            };
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, settings]);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio play failed, ignore
      });
    }
    
    // Browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(
        timer.mode === 'work' ? 'Work session completed!' : 'Break time over!',
        {
          body: timer.mode === 'work' ? 'Time for a break!' : 'Ready to get back to work?',
          icon: '/favicon.ico'
        }
      );
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      minutes: prev.mode === 'work' ? settings.workDuration : settings.breakDuration,
      seconds: 0,
      isRunning: false
    }));
  };

  const switchMode = (mode: 'work' | 'break') => {
    const minutes = mode === 'work' ? settings.workDuration : settings.breakDuration;
    setTimer(prev => ({
      ...prev,
      minutes,
      seconds: 0,
      isRunning: false,
      mode
    }));
  };

  const totalMinutes = timer.mode === 'work' ? settings.workDuration : 
    (timer.sessions % settings.sessionsUntilLongBreak === 0 && timer.mode === 'break') 
      ? settings.longBreakDuration 
      : settings.breakDuration;

  const progress = ((totalMinutes * 60) - (timer.minutes * 60 + timer.seconds)) / (totalMinutes * 60) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pomodoro Timer</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay focused with the Pomodoro Technique
        </p>
      </div>

      {/* Timer Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <div className="mb-6">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => switchMode('work')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timer.mode === 'work'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Work
            </button>
            <button
              onClick={() => switchMode('break')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timer.mode === 'break'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Coffee className="w-4 h-4 inline mr-2" />
              Break
            </button>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className={timer.mode === 'work' ? 'text-red-500' : 'text-green-500'}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
            </div>
            <div className={`text-sm font-medium mt-2 ${
              timer.mode === 'work' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {timer.mode === 'work' ? 'Focus Time' : 'Break Time'}
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`btn btn-lg flex items-center space-x-2 ${
              timer.mode === 'work' ? 'btn-primary' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {timer.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{timer.isRunning ? 'Pause' : 'Start'}</span>
          </button>
          
          <button
            onClick={resetTimer}
            className="btn btn-secondary btn-lg flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="btn btn-secondary btn-lg flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Session Counter */}
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Sessions Completed: {timer.sessions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {settings.sessionsUntilLongBreak - (timer.sessions % settings.sessionsUntilLongBreak)} more until long break
          </div>
        </div>

        {/* Notification Permission */}
        {Notification.permission === 'default' && (
          <button
            onClick={requestNotificationPermission}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Enable notifications for timer alerts
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          Pomodoro Technique Tips
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-300">
          <li>• Work for 25 minutes with complete focus</li>
          <li>• Take a 5-minute break after each work session</li>
          <li>• After 4 sessions, take a longer 15-30 minute break</li>
          <li>• Eliminate distractions during work sessions</li>
          <li>• Use breaks to stretch, hydrate, or rest your eyes</li>
        </ul>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Timer Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="input w-full"
                  value={settings.workDuration}
                  onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) || 25 })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="input w-full"
                  value={settings.breakDuration}
                  onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) || 5 })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="input w-full"
                  value={settings.longBreakDuration}
                  onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 15 })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sessions until Long Break
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  className="input w-full"
                  value={settings.sessionsUntilLongBreak}
                  onChange={(e) => setSettings({ ...settings, sessionsUntilLongBreak: parseInt(e.target.value) || 4 })}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="btn btn-primary btn-md flex-1"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="btn btn-secondary btn-md flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}