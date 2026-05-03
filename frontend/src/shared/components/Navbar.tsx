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
  
  const scrollToSection = (id: string) => {
    if (currentState !== 'HOME') {
      onNavigate('HOME');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-8 pointer-events-none">
      <nav className="max-w-[1440px] mx-auto backdrop-blur-3xl saturate-[1.8] border border-white/40 dark:border-white/10 bg-white/20 dark:bg-slate-900/40 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all pointer-events-auto overflow-hidden group/nav">
        {/* Subtle mesh background for the Navbar */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] bg-indigo-400/15 rounded-full blur-[50px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[140%] bg-pink-400/15 rounded-full blur-[50px]" />
        </div>

        <div className="relative px-8 h-20 flex justify-between items-center">
          {/* Left: Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              if (currentState === 'HOME') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                onNavigate('HOME');
                window.scrollTo({ top: 0 });
              }
            }}
          >
            <Logo size="lg" variant="auto" className="group-hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <NavMenuLink label="About Us" onClick={() => onNavigate('ABOUT_US')} />
            <NavMenuLink label="How It Works" onClick={() => scrollToSection('how-it-works')} />
            <NavMenuLink label="Demo" onClick={() => scrollToSection('demo')} />
            <NavMenuLink label="Pricing" onClick={() => scrollToSection('pricing')} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 border-r border-slate-300/50 dark:border-white/10 pr-5 h-8">
              <ThemeToggle />
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <motion.button 
                  onClick={() => onNavigate('PROFILE')}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5"
                  title="View Profile"
                >
                  <BarChart2 className="w-4.5 h-4.5" />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('PROFILE')}
                  whileHover={{ scale: 1.02, y: -1, boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all"
                  title={user?.name}
                >
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold hidden xl:block tracking-tight">
                    {user?.name}
                  </span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => onNavigate('LOGIN')}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.04)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2 text-black dark:text-slate-300 font-bold text-base rounded-xl transition-all"
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('SIGNUP')}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 24px -6px rgba(79, 70, 229, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-7 py-2.5 bg-[#003f88] hover:bg-[#004fa8] text-white rounded-xl font-bold text-base shadow-xl shadow-[#003f88]/30 transition-all"
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

const NavMenuLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="relative px-1 py-1 text-base font-bold text-black dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all group/link"
  >
    {label}
    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 scale-x-0 transition-transform duration-300 origin-right group-hover/link:scale-x-100 group-hover/link:origin-left rounded-full" />
  </button>
);

interface NavLinkProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      active
        ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm'
        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
  </button>
);
