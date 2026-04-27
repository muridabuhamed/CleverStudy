import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogIn, UserPlus, Mail, Lock, User, Loader2,
  AlertCircle, X, Eye, EyeOff,
  Book, BookOpen, FileText, Pencil, GraduationCap, Notebook,
} from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';
import { Logo } from '@/shared/components/Logo';

type Tab = 'login' | 'signup';

interface AuthProps {
  defaultTab?: Tab;
}

// ─── Reusable field wrapper ────────────────────────────────────────────────
const inputBase =
  'w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/60 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-all duration-200';
const inputNormal = 'border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15';
const inputError  = 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/15';

// ─── Email validator ───────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// ─── Password strength (0-4) ───────────────────────────────────────────────
function pwStrength(p: string): number {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  return s;
}
const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-400', 'bg-emerald-600'];

export const Auth: React.FC<AuthProps> = ({ defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const toast = useToast();
  const { login, signup } = useAuth();

  // ── Login state ────────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail]           = useState('');
  const [loginPassword, setLoginPassword]     = useState('');
  const [showLoginPw, setShowLoginPw]         = useState(false);
  const [loginError, setLoginError]           = useState('');
  const [loginErrorKey, setLoginErrorKey]     = useState(0);
  const [loginLoading, setLoginLoading]       = useState(false);
  const [loginFieldErrors, setLoginFieldErrors] = useState<{ email?: string; password?: string }>({});
  const loginErrorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss login error after 6 s
  useEffect(() => {
    if (!loginError) return;
    if (loginErrorTimer.current) clearTimeout(loginErrorTimer.current);
    loginErrorTimer.current = setTimeout(() => setLoginError(''), 6000);
    return () => { if (loginErrorTimer.current) clearTimeout(loginErrorTimer.current); };
  }, [loginError, loginErrorKey]);

  // ── Signup state ───────────────────────────────────────────────────────
  const [signupName, setSignupName]           = useState('');
  const [signupEmail, setSignupEmail]         = useState('');
  const [signupPassword, setSignupPassword]   = useState('');
  const [signupConfirm, setSignupConfirm]     = useState('');
  const [showSignupPw, setShowSignupPw]       = useState(false);
  const [showConfirmPw, setShowConfirmPw]     = useState(false);
  const [signupError, setSignupError]         = useState('');
  const [signupLoading, setSignupLoading]     = useState(false);
  const [signupFieldErrors, setSignupFieldErrors] = useState<{
    name?: string; email?: string; password?: string; confirm?: string;
  }>({});
  const clearSF = (k: string) => setSignupFieldErrors(p => ({ ...p, [k]: undefined }));

  // ── Login handler ──────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const fieldErrs: { email?: string; password?: string } = {};
    if (!loginEmail.trim()) fieldErrs.email = 'Email is required.';
    else if (!isValidEmail(loginEmail)) fieldErrs.email = 'Enter a valid email address.';
    if (!loginPassword) fieldErrs.password = 'Password is required.';
    if (Object.keys(fieldErrs).length) {
      setLoginFieldErrors(fieldErrs);
      return;
    }
    setLoginFieldErrors({});
    setLoginLoading(true);

    try {
      await login(loginEmail.trim().toLowerCase(), loginPassword);
      setLoginError('');
      toast.success('Welcome back!', `Signed in as ${loginEmail.trim().toLowerCase()}`);
    } catch {
      // Generic message — never reveal which field is wrong
      setLoginError('Invalid email or password. Please try again.');
      setLoginErrorKey(k => k + 1);
      setLoginPassword(''); // clear password on failure (UX + security)
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Signup handler ─────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    // Per-field validation
    const fe: typeof signupFieldErrors = {};
    if (!signupName.trim())          fe.name     = 'Full name is required.';
    if (!signupEmail.trim())         fe.email    = 'Email address is required.';
    else if (!isValidEmail(signupEmail)) fe.email = 'Enter a valid email address.';
    if (!signupPassword)             fe.password = 'Password is required.';
    else if (pwStrength(signupPassword) < 4) fe.password = 'Password does not meet all requirements.';
    if (!signupConfirm)              fe.confirm  = 'Please confirm your password.';
    else if (signupConfirm !== signupPassword) fe.confirm = 'Passwords do not match.';
    if (Object.keys(fe).length) { setSignupFieldErrors(fe); return; }
    setSignupFieldErrors({});

    setSignupLoading(true);
    try {
      await signup(signupEmail.trim().toLowerCase(), signupPassword, signupName.trim());
      toast.success('Account created!', `Welcome, ${signupName.trim()}!`);
    } catch {
      setSignupError('Unable to create account. Please check your details and try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  // ── Shared input style helper ──────────────────────────────────────────
  const fieldCls = (hasErr: boolean) => `${inputBase} ${hasErr ? inputError : inputNormal}`;

  // ── Floating bg icons data ─────────────────────────────────────────────
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950 flex items-center justify-center p-4 relative overflow-hidden">

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

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand */}
        <div className="text-center mb-8 flex flex-col items-center">
          <motion.div
            className="mb-4"
            whileHover={{ scale: 1.08 }}
          >
            <Logo size="xl" variant="light" />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeTab}
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
               {activeTab === 'login' ? 'Sign in to Acadify' : 'Create your account'}
            </motion.h1>
          </AnimatePresence>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {activeTab === 'login' ? 'Welcome back — enter your credentials below.' : 'Start studying smarter today.'}
          </p>
        </div>

        <div
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          style={{ boxShadow: '0 20px 48px rgba(0,0,0,0.09)' }}
        >
          {/* Tab bar */}
          <div className="flex border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 relative">
            <motion.div
              className="absolute bottom-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
              animate={{ left: activeTab === 'login' ? '0%' : '50%', width: '50%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            />
            {(['login', 'signup'] as Tab[]).map(tab => (
              <button
                key={tab}
                id={`auth-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 ${
                  activeTab === tab
                    ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {tab === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="p-7">
            <AnimatePresence mode="wait">

              {/* ── LOGIN FORM ── */}
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {/* Error banner */}
                  <AnimatePresence>
                    {loginError && (
                      <motion.div
                        key={loginErrorKey}
                        role="alert"
                        aria-live="assertive"
                        className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-700 rounded-xl"
                        style={{ boxShadow: '0 2px 12px rgba(220,38,38,0.10)' }}
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: [0, -5, 5, -3, 3, 0] }}
                        exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="flex-1 text-sm text-red-700 dark:text-red-300 font-medium">
                          {loginError}
                        </p>
                        <button
                          type="button"
                          onClick={() => setLoginError('')}
                          aria-label="Dismiss"
                          className="text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form id="login-form" onSubmit={handleLogin} noValidate className="space-y-4">
                    {/* Email */}
                    <div>
                      <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          value={loginEmail}
                          onChange={e => { setLoginEmail(e.target.value); setLoginFieldErrors(p => ({ ...p, email: undefined })); }}
                          placeholder="you@example.com"
                          className={fieldCls(!!loginFieldErrors.email)}
                          disabled={loginLoading}
                        />
                      </div>
                      {loginFieldErrors.email && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{loginFieldErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="login-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Password
                        </label>
                        <button
                          type="button"
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                          onClick={() => toast.info('Forgot password', 'Password reset is not yet available. Please contact support.')}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          id="login-password"
                          type={showLoginPw ? 'text' : 'password'}
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={e => { setLoginPassword(e.target.value); setLoginFieldErrors(p => ({ ...p, password: undefined })); }}
                          placeholder="••••••••"
                          className={`${fieldCls(!!loginFieldErrors.password)} pr-10`}
                          disabled={loginLoading}
                        />
                        <button
                          type="button"
                          aria-label={showLoginPw ? 'Hide password' : 'Show password'}
                          onClick={() => setShowLoginPw(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {loginFieldErrors.password && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{loginFieldErrors.password}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <motion.button
                      id="login-submit"
                      type="submit"
                      disabled={loginLoading}
                      whileHover={{ scale: loginLoading ? 1 : 1.015, y: loginLoading ? 0 : -1 }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full mt-2 py-3 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                        boxShadow: '0 6px 20px rgba(124,58,237,0.30)',
                      }}
                    >
                      {loginLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                        : <><LogIn className="w-4 h-4" /> Sign In</>}
                    </motion.button>
                  </form>

                  {/* Separator */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => toast.info('Google Sign-In', 'Google authentication is being integrated. Please use email for now.')}
                    className="w-full py-2.5 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600/80 transition-all flex items-center justify-center gap-2.5"
                    style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </motion.button>

                  <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setActiveTab('signup')}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Create account
                    </button>
                  </p>
                </motion.div>

              ) : (

              /* ── SIGNUP FORM ── */
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {/* Signup error */}
                  <AnimatePresence>
                    {signupError && (
                      <motion.div
                        role="alert"
                        className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-700 rounded-xl"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                      >
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="flex-1 text-sm text-red-700 dark:text-red-300 font-medium">{signupError}</p>
                        <button type="button" onClick={() => setSignupError('')} aria-label="Dismiss" className="text-red-400 hover:text-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form id="signup-form" onSubmit={handleSignup} noValidate className="space-y-4">
                    {/* Full name */}
                    <div>
                      <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          id="signup-name" type="text" autoComplete="name"
                          value={signupName}
                          onChange={e => { setSignupName(e.target.value); clearSF('name'); }}
                          onBlur={() => { if (!signupName.trim()) setSignupFieldErrors(p => ({ ...p, name: 'Full name is required.' })); }}
                          placeholder="Jane Doe"
                          className={fieldCls(!!signupFieldErrors.name)}
                          disabled={signupLoading}
                        />
                      </div>
                      {signupFieldErrors.name && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{signupFieldErrors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          id="signup-email" type="email" autoComplete="email"
                          value={signupEmail}
                          onChange={e => { setSignupEmail(e.target.value); clearSF('email'); }}
                          onBlur={() => {
                            if (!signupEmail.trim()) setSignupFieldErrors(p => ({ ...p, email: 'Email address is required.' }));
                            else if (!isValidEmail(signupEmail)) setSignupFieldErrors(p => ({ ...p, email: 'Enter a valid email address.' }));
                          }}
                          placeholder="you@example.com"
                          className={fieldCls(!!signupFieldErrors.email)}
                          disabled={signupLoading}
                        />
                      </div>
                      {signupFieldErrors.email && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{signupFieldErrors.email}</p>
                      )}
                    </div>

                    {/* Password + strength meter */}
                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          id="signup-password" type={showSignupPw ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={signupPassword}
                          onChange={e => {
                            const v = e.target.value;
                            setSignupPassword(v);
                            // Clear error only once all requirements are met
                            if (pwStrength(v) === 4) clearSF('password');
                          }}
                          placeholder="••••••••"
                          className={`${fieldCls(!!signupFieldErrors.password)} pr-10`}
                          disabled={signupLoading}
                        />
                        <button type="button" aria-label={showSignupPw ? 'Hide password' : 'Show password'}
                          onClick={() => setShowSignupPw(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          {showSignupPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength meter */}
                      {signupPassword.length > 0 && (() => {
                        const s = pwStrength(signupPassword);
                        return (
                          <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                              {[1,2,3,4].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= s ? strengthColor[s] : 'bg-slate-200 dark:bg-slate-600'}`} />
                              ))}
                            </div>
                            <p className={`text-xs font-medium ${s <= 1 ? 'text-red-500' : s === 2 ? 'text-yellow-500' : s === 3 ? 'text-emerald-500' : 'text-emerald-600'}`}>
                              {strengthLabel[s]}
                            </p>
                          </div>
                        );
                      })()}
                      {!signupPassword && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">8+ characters · uppercase · lowercase · digit</p>}
                      {signupFieldErrors.password && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{signupFieldErrors.password}</p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          id="signup-confirm" type={showConfirmPw ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={signupConfirm}
                          onChange={e => {
                            const v = e.target.value;
                            setSignupConfirm(v);
                            // Clear mismatch error as soon as values match
                            if (v === signupPassword) clearSF('confirm');
                          }}
                          onBlur={() => {
                            if (signupConfirm && signupConfirm !== signupPassword)
                              setSignupFieldErrors(p => ({ ...p, confirm: 'Passwords do not match.' }));
                            if (!signupConfirm)
                              setSignupFieldErrors(p => ({ ...p, confirm: 'Please confirm your password.' }));
                          }}
                          placeholder="••••••••"
                          className={`${fieldCls(!!signupFieldErrors.confirm)} pr-10`}
                          disabled={signupLoading}
                        />
                        <button type="button" aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                          onClick={() => setShowConfirmPw(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signupFieldErrors.confirm && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{signupFieldErrors.confirm}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <motion.button
                      id="signup-submit"
                      type="submit"
                      disabled={signupLoading}
                      whileHover={{ scale: signupLoading ? 1 : 1.015, y: signupLoading ? 0 : -1 }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full mt-2 py-3 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 6px 20px rgba(124,58,237,0.30)' }}
                    >
                      {signupLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                        : <><UserPlus className="w-4 h-4" /> Create Account</>}
                    </motion.button>
                  </form>

                  {/* Separator */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => toast.info('Google Sign-In', 'Google authentication is being integrated. Please use email for now.')}
                    className="w-full py-2.5 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600/80 transition-all flex items-center justify-center gap-2.5"
                    style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </motion.button>

                  <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </motion.div>

              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5">
          Learn smarter, not harder · Acadify
        </p>
      </motion.div>
    </div>
  );
};
