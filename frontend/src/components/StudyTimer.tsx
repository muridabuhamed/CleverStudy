import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

interface StudyTimerProps {
  fileId: string;
  onTimeUpdate?: (seconds: number) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ fileId, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const startTimeRef = useRef<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Load total time from server on mount
  useEffect(() => {
    loadTotalTime();
  }, [fileId]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const newTime = prev + 1;
          if (onTimeUpdate) onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  // Auto-start timer when component mounts
  useEffect(() => {
    handleStart();
    return () => {
      // Save session when component unmounts
      if (seconds > 0) {
        saveCurrentSession();
      }
    };
  }, []);

  const loadTotalTime = async () => {
    try {
      const data = await api.getStudyTime(fileId);
      setTotalTimeSpent(data.totalSeconds);
    } catch (error) {
      console.error('Failed to load study time:', error);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    if (!startTimeRef.current) {
      startTimeRef.current = new Date().toISOString();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    if (seconds > 0) {
      saveCurrentSession();
    }
  };

  const handleReset = () => {
    if (seconds > 0) {
      saveCurrentSession();
    }
    setSeconds(0);
    setIsRunning(false);
    startTimeRef.current = null;
  };

  const saveCurrentSession = async () => {
    if (seconds > 0 && startTimeRef.current) {
      try {
        await api.saveStudySession(fileId, seconds, startTimeRef.current);
        setTotalTimeSpent(prev => prev + seconds);
        setSeconds(0);
        startTimeRef.current = new Date().toISOString();
      } catch (error) {
        console.error('Failed to save study session:', error);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatTime(seconds)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Total: {formatTime(totalTimeSpent + seconds)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning ? (
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              title="Start Timer"
            >
              <Play className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handlePause}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-amber-600 dark:bg-amber-500 text-white rounded-xl hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
              title="Pause Timer"
            >
              <Pause className="w-5 h-5" />
            </motion.button>
          )}
          
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
