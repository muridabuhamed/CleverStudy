import React from 'react';
import { motion } from 'motion/react';
import { Book, BookOpen, FileText, Pencil, GraduationCap, Notebook } from 'lucide-react';

const floaters = [
  { Icon: BookOpen, size: 64, cls: 'top-24 left-1/4', opacity: 0.25, dur: 7, dy: -20, rot: 10 },
  { Icon: Book,     size: 52, cls: 'top-1/4 right-16', opacity: 0.20, dur: 9, dy: 20, rot: -10 },
  { Icon: FileText, size: 48, cls: 'bottom-28 left-14', opacity: 0.18, dur: 8, dy: -15, rot: 8 },
  { Icon: Notebook, size: 60, cls: 'bottom-1/4 right-1/3', opacity: 0.15, dur: 6.5, dy: 15, rot: -8 },
] as const;

interface StudyBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const StudyBackground: React.FC<StudyBackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950 relative overflow-hidden ${className}`}>
      {/* Ambient blobs - kept very subtle */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-800/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/20 dark:bg-violet-800/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
