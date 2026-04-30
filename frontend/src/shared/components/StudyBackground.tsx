import React from 'react';
import { motion } from 'motion/react';
import { Book, BookOpen, FileText, Pencil, GraduationCap, Notebook } from 'lucide-react';

const floaters = [
  { Icon: BookOpen, size: 64, cls: 'top-24 left-1/4', opacity: 0.35, dur: 7, dy: -25, rot: 15 },
  { Icon: Book,     size: 52, cls: 'top-1/4 right-16', opacity: 0.30, dur: 9, dy: 30, rot: -18 },
  { Icon: FileText, size: 48, cls: 'bottom-28 left-14', opacity: 0.28, dur: 8, dy: -20, rot: 10 },
  { Icon: Notebook, size: 60, cls: 'bottom-1/4 right-1/3', opacity: 0.25, dur: 6.5, dy: 25, rot: -14 },
  { Icon: GraduationCap, size: 66, cls: 'top-2/3 left-1/3', opacity: 0.22, dur: 10, dy: -30, rot: 22 },
  { Icon: Pencil,   size: 44, cls: 'top-1/3 left-10', opacity: 0.28, dur: 7.5, dy: 20, rot: -28 },
  { Icon: BookOpen, size: 70, cls: 'top-12 right-1/3', opacity: 0.32, dur: 7, dy: -28, rot: -18 },
  { Icon: Notebook, size: 62, cls: 'top-36 right-12', opacity: 0.28, dur: 8, dy: 32, rot: 22 },
] as const;

interface StudyBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const StudyBackground: React.FC<StudyBackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950 relative overflow-hidden ${className}`}>
      {/* Ambient blobs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-indigo-300 dark:bg-indigo-800 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-300 dark:bg-violet-800 rounded-full opacity-10 blur-3xl pointer-events-none" />

      {/* Floating icons */}
      {floaters.map(({ Icon, size, cls, opacity, dur, dy, rot }, i) => (
        <motion.div
          key={i}
          className={`absolute ${cls} text-indigo-400 dark:text-indigo-500 pointer-events-none`}
          style={{ opacity }}
          animate={{ y: [0, dy, 0], rotate: [0, rot, 0] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
