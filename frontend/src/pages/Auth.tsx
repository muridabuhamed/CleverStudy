import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, User, Loader2, Sparkles, Book, BookOpen, FileText, Pencil, GraduationCap, Notebook } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

type Tab = 'login' | 'signup';

interface AuthProps {
  defaultTab?: Tab;
}

export const Auth: React.FC<AuthProps> = ({ defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const toast = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success('Welcome Back!', `Successfully logged in as ${loginEmail}`);
    } catch (err: any) {
      // Extract error message properly
      let errorMsg = 'Failed to login. Please check your credentials.';
      if (typeof err === 'string') {
        errorMsg = err;
      } else if (err?.message && typeof err.message === 'string') {
        errorMsg = err.message;
      } else if (err?.detail && typeof err.detail === 'string') {
        errorMsg = err.detail;
      } else if (err?.error && typeof err.error === 'string') {
        errorMsg = err.error;
      }
      setLoginError(errorMsg);
      toast.error('Login Failed', errorMsg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    // Validate password strength (match backend requirements)
    if (signupPassword.length < 8) {
      const errorMsg = 'Password must be at least 8 characters long';
      setSignupError(errorMsg);
      toast.warning('Invalid Password', errorMsg);
      return;
    }
    if (!/[A-Z]/.test(signupPassword)) {
      const errorMsg = 'Password must contain at least one uppercase letter';
      setSignupError(errorMsg);
      toast.warning('Invalid Password', errorMsg);
      return;
    }
    if (!/[a-z]/.test(signupPassword)) {
      const errorMsg = 'Password must contain at least one lowercase letter';
      setSignupError(errorMsg);
      toast.warning('Invalid Password', errorMsg);
      return;
    }
    if (!/\d/.test(signupPassword)) {
      const errorMsg = 'Password must contain at least one digit';
      setSignupError(errorMsg);
      toast.warning('Invalid Password', errorMsg);
      return;
    }
    
    if (signupPassword !== signupConfirm) {
      const errorMsg = 'Passwords do not match';
      setSignupError(errorMsg);
      toast.warning('Password Mismatch', errorMsg);
      return;
    }
    setSignupLoading(true);
    try {
      await signup(signupEmail, signupPassword, signupName);
      toast.success('Account Created!', `Welcome ${signupName}! Your account has been created successfully.`);
    } catch (err: any) {
      // Extract error message properly
      let errorMsg = 'Failed to create account. Please try again.';
      if (typeof err === 'string') {
        errorMsg = err;
      } else if (err?.message && typeof err.message === 'string') {
        errorMsg = err.message;
      } else if (err?.detail && typeof err.detail === 'string') {
        errorMsg = err.detail;
      } else if (err?.error && typeof err.error === 'string') {
        errorMsg = err.error;
      }
      setSignupError(errorMsg);
      toast.error('Signup Failed', errorMsg);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 dark:opacity-30 blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-violet-200 dark:bg-violet-800 rounded-full opacity-20 dark:opacity-30 blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, -20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-indigo-300 dark:bg-indigo-700 rounded-full opacity-10 dark:opacity-20 blur-2xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -30, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating Books and Papers */}
      <motion.div
        className="absolute top-32 left-1/4 text-indigo-400 opacity-40"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 15, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <BookOpen size={64} />
      </motion.div>
      
      <motion.div
        className="absolute top-1/4 right-20 text-violet-400 opacity-35"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -20, 0],
          x: [0, 10, 0]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Book size={56} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 left-16 text-indigo-500 opacity-35"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <FileText size={48} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/4 right-1/3 text-violet-500 opacity-30"
        animate={{
          y: [0, 25, 0],
          rotate: [0, -15, 0]
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Notebook size={60} />
      </motion.div>
      
      <motion.div
        className="absolute top-2/3 left-1/3 text-indigo-400 opacity-25"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 25, 0],
          x: [0, -15, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <GraduationCap size={68} />
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 left-12 text-violet-300 opacity-35"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -30, 0]
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Pencil size={44} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 right-24 text-indigo-200 opacity-20"
        animate={{
          y: [0, -35, 0],
          rotate: [0, 20, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <FileText size={38} />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 left-20 text-violet-300 opacity-10"
        animate={{
          y: [0, 25, 0],
          rotate: [0, -25, 0]
        }}
        transition={{
          duration: 9.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Book size={46} />
      </motion.div>
      
      {/* Additional visible elements */}
      <motion.div
        className="absolute top-16 right-1/3 text-indigo-500 opacity-40"
        animate={{
          y: [0, -30, 0],
          rotate: [0, -20, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
      >
        <BookOpen size={72} />
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-16 text-violet-400 opacity-35"
        animate={{
          y: [0, 35, 0],
          rotate: [0, 25, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <Notebook size={64} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-16 left-1/3 text-indigo-400 opacity-40"
        animate={{
          y: [0, -25, 0],
          rotate: [0, -15, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
      >
        <FileText size={56} />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 right-12 text-violet-500 opacity-35"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 30, 0],
          x: [0, -10, 0]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
      >
        <Book size={52} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 left-24 text-indigo-500 opacity-30"
        animate={{
          y: [0, -28, 0],
          rotate: [0, -18, 0]
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2
        }}
      >
        <Pencil size={50} />
      </motion.div>
      
      <motion.div
        className="absolute top-3/4 right-1/4 text-violet-400 opacity-30"
        animate={{
          y: [0, 32, 0],
          rotate: [0, 22, 0]
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6
        }}
      >
        <BookOpen size={58} />
      </motion.div>
      
      <motion.div
        className="absolute top-1/4 left-1/3 text-indigo-400 opacity-35"
        animate={{
          y: [0, -22, 0],
          rotate: [0, -12, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{
          duration: 6.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.8
        }}
      >
        <GraduationCap size={62} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 right-1/3 text-violet-500 opacity-32"
        animate={{
          y: [0, -26, 0],
          rotate: [0, 28, 0]
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.2
        }}
      >
        <FileText size={54} />
      </motion.div>
      
      <motion.div
        className="absolute top-3/4 left-16 text-indigo-300 opacity-38"
        animate={{
          y: [0, 24, 0],
          rotate: [0, -24, 0]
        }}
        transition={{
          duration: 8.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4
        }}
      >
        <Notebook size={60} />
      </motion.div>
      
      <motion.div
        className="absolute top-2/4 left-1/4 text-violet-400 opacity-28"
        animate={{
          y: [0, -33, 0],
          rotate: [0, 19, 0],
          x: [0, 12, 0]
        }}
        transition={{
          duration: 9.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4
        }}
      >
        <Book size={66} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Brand */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Smart Study Platform
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-slate-900 dark:text-slate-100" 
            style={{ fontWeight: 700, letterSpacing: '-0.5px' }}
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'login' ? 'Welcome Back!' : 'Get Started Free'}
          </motion.h1>
          <motion.p 
            className="text-slate-600 dark:text-slate-400 mt-2"
            key={`${activeTab}-subtitle`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {activeTab === 'login'
              ? 'Sign in to continue your learning journey'
              : 'Create your account and start studying smarter'}
          </motion.p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
          style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
          whileHover={{ y: -3, boxShadow: '0 25px 50px rgba(0,0,0,0.12)' }}
          transition={{ duration: 0.2 }}
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 relative">
            <motion.div
              className="absolute bottom-0 h-0.5 bg-indigo-600"
              initial={false}
              animate={{
                left: activeTab === 'login' ? '0%' : '50%',
                width: '50%'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <motion.button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === 'login'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 rounded-t-xl border-b-2 border-indigo-600'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              style={activeTab === 'login' ? { boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' } : {}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={activeTab === 'login' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <LogIn className="w-4 h-4" />
              </motion.div>
              Sign In
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === 'signup'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 rounded-t-xl border-b-2 border-indigo-600'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              style={activeTab === 'signup' ? { boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' } : {}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={activeTab === 'signup' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <UserPlus className="w-4 h-4" />
              </motion.div>
              Sign Up
            </motion.button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {loginError && (
                    <motion.div 
                      className="mb-5 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      {loginError}
                    </motion.div>
                  )}
                  <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.label 
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        Email
                      </motion.label>
                      <div className="relative group">
                        <motion.div
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </motion.div>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          style={{ boxShadow: 'none' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.label 
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        Password
                      </motion.label>
                      <div className="relative group">
                        <motion.div
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </motion.div>
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          style={{ boxShadow: 'none' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                    </motion.div>
                    <motion.button
                      type="submit"
                      disabled={loginLoading}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                        boxShadow: '0 10px 20px rgba(124,58,237,0.3)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 15px 30px rgba(124,58,237,0.4)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(124,58,237,0.3)'}
                    >
                      {loginLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
                      ) : (
                        <><LogIn className="w-5 h-5" /> Sign In</>
                      )}
                    </motion.button>
                  </form>
                  <motion.p 
                    className="mt-6 text-center text-slate-500 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Don't have an account?{' '}
                    <motion.button
                      onClick={() => setActiveTab('signup')}
                      className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create one
                    </motion.button>
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {signupError && (
                    <motion.div 
                      className="mb-5 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      {signupError}
                    </motion.div>
                  )}
                  <form onSubmit={handleSignup} className="space-y-5">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.label 
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        Full Name
                      </motion.label>
                      <div className="relative group">
                        <motion.div
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <User className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </motion.div>
                        <input
                          type="text"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="John Doe"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          style={{ boxShadow: 'none' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.label 
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        Email
                      </motion.label>
                      <div className="relative group">
                        <motion.div
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </motion.div>
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          style={{ boxShadow: 'none' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.label 
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        Password
                      </motion.label>
                      <div className="relative group">
                        <motion.div
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </motion.div>
                        <input
                          type="password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={8}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          style={{ boxShadow: 'none' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        8+ chars, uppercase, lowercase, and a digit
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.label 
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        Confirm Password
                      </motion.label>
                      <div className="relative group">
                        <motion.div
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </motion.div>
                        <input
                          type="password"
                          value={signupConfirm}
                          onChange={(e) => setSignupConfirm(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          style={{ boxShadow: 'none' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      type="submit"
                      disabled={signupLoading}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                        boxShadow: '0 10px 20px rgba(124,58,237,0.3)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 15px 30px rgba(124,58,237,0.4)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(124,58,237,0.3)'}
                    >
                      {signupLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</>
                      ) : (
                        <><UserPlus className="w-5 h-5" /> Create Account</>
                      )}
                    </motion.button>
                  </form>
                  <motion.p 
                    className="mt-6 text-center text-slate-500 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Already have an account?{' '}
                    <motion.button
                      onClick={() => setActiveTab('login')}
                      className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign in
                    </motion.button>
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p 
          className="text-center text-slate-500 text-sm mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Learn smarter, not harder
        </motion.p>
      </motion.div>
    </div>
  );
};
