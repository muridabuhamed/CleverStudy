import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Upload, Layout, CheckCircle, HelpCircle, BarChart2, User } from 'lucide-react';
import { AppState } from '../types/globalTypes';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

interface NavbarProps {
  currentState: AppState;
  onNavigate: (state: AppState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentState, onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <nav className="max-w-6xl mx-auto backdrop-blur-2xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-slate-900/40 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all pointer-events-auto overflow-hidden group/nav">
        {/* Subtle mesh background for the Navbar */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] bg-indigo-400/20 rounded-full blur-[40px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[140%] bg-pink-400/20 rounded-full blur-[40px]" />
        </div>

        <div className="relative px-6 h-16 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('HOME')}
          >
            <Logo size="md" variant="auto" className="group-hover:scale-105 transition-transform duration-300" />
          </div>

          <div className="flex items-center gap-6">
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1 rounded-xl border border-slate-200/50 dark:border-white/5">
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
              </div>
            )}

            <div className="flex items-center gap-3 border-l border-slate-200/50 dark:border-white/10 pl-6 h-8">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <motion.button 
                    onClick={() => onNavigate('PROFILE')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5"
                    title="View Profile"
                  >
                    <BarChart2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate('PROFILE')}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all"
                    title={user?.name}
                  >
                    <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold hidden lg:block tracking-tight">
                      {user?.name}
                    </span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => onNavigate('LOGIN')}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.03)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-lg transition-all"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate('SIGNUP')}
                    whileHover={{ scale: 1.05, y: -1, boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

interface NavLinkProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
      active
        ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm'
        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
  </button>
);
