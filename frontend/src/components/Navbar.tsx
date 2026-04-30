import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Upload, Layout, CheckCircle, HelpCircle, BarChart2, User } from 'lucide-react';
import { AppState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from '../shared/components/Logo';

interface NavbarProps {
  currentState: AppState;
  onNavigate: (state: AppState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentState, onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/10 dark:border-slate-700/50 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('HOME')}
          >
            <Logo size="md" variant="auto" />
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              <NavLink
                active={currentState === 'HOME'}
                onClick={() => onNavigate('HOME')}
                icon={<Layout className="w-4 h-4" />}
                label="Home"
              />
              <NavLink
                active={currentState === 'UPLOAD'}
                onClick={() => onNavigate('UPLOAD')}
                icon={<Upload className="w-4 h-4" />}
                label="Upload"
              />
              <NavLink
                active={currentState === 'LIBRARY'}
                onClick={() => onNavigate('LIBRARY')}
                icon={<BookOpen className="w-4 h-4" />}
                label="Library"
              />
              {currentState === 'QUIZ' && (
                <NavLink
                  active={true}
                  onClick={() => { }}
                  icon={<HelpCircle className="w-4 h-4" />}
                  label="Quiz"
                />
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <motion.button 
                  onClick={() => onNavigate('PROFILE')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
                  title="View Profile"
                >
                  <BarChart2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('PROFILE')}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-all"
                  title={user?.name}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white hidden lg:block">
                    {user?.name}
                  </span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => onNavigate('SIGNUP')}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                >
                  Sign Up
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('LOGIN')}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-white/10 text-white border border-white/20 dark:border-slate-700 rounded-lg font-semibold text-sm hover:bg-white/20 dark:hover:bg-slate-700/50 hover:border-white/30 transition-all"
                >
                  Login
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-sm font-medium transition-colors ${active ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
      }`}
  >
    {icon}
    {label}
  </button>
);
