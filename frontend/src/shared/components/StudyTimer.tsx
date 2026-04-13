import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Clock, Play, Pause, RotateCcw, X, Minimize2, Maximize2, GripVertical } from 'lucide-react';
import { api } from '../services/api';

interface StudyTimerProps {
  fileId: string;
  onTimeUpdate?: (seconds: number) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ fileId, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const startTimeRef = useRef<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Load total time from server on mount
  useEffect(() => {
    loadTotalTime();
    // Load saved visibility state
    const savedVisible = localStorage.getItem('timer-visible');
    if (savedVisible !== null) {
      setIsVisible(savedVisible === 'true');
    }
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
      const data = await studyApi.getStudyTime(fileId);
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

  const handleClose = () => {
    if (seconds > 0) {
      saveCurrentSession();
    }
    setIsVisible(false);
    localStorage.setItem('timer-visible', 'false');
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const saveCurrentSession = async () => {
    if (seconds > 0 && startTimeRef.current) {
      try {
        await studyApi.saveStudySession(fileId, seconds, startTimeRef.current);
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

  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => {
          setIsVisible(true);
          localStorage.setItem('timer-visible', 'true');
        }}
        className="fixed bottom-6 right-6 p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Show Timer"
      >
        <Clock className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        top: -400,
        left: -800,
        right: 800,
        bottom: 400,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-6 z-50 cursor-move"
      whileHover={{ scale: 1.02 }}
    >
      <div className="bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Drag Handle */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-700 dark:to-violet-700 px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-white/70" />
            <span className="text-xs font-semibold text-white">Study Timer</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleMinimize}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? (
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              ) : (
                <Minimize2 className="w-3.5 h-3.5 text-white" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              title="Hide Timer"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Timer Content */}
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4"
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
        )}

        {/* Minimized View */}
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-2 flex items-center gap-3"
          >
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatTime(seconds)}
            </span>
            {isRunning && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full"
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
