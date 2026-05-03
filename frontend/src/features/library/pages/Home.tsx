import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Zap, Upload, Brain, CheckCircle, FileText, MessageSquare, ListChecks, CreditCard, BarChart3, BookOpenCheck, BookOpen, Highlighter, Star } from 'lucide-react';
import { AppState } from '@/App';
import { useAuth } from '@/shared/contexts/AuthContext';
import { AnimatedDemo } from '@/shared/components/AnimatedDemo';
import { Logo } from '@/shared/components/Logo';
import { StudyBackground } from '@/shared/components/StudyBackground';
import { Pricing } from '@/components/Pricing';

interface HomeProps {
  onStart: () => void;
  onNavigate: (state: AppState) => void;
}

export const Home: React.FC<HomeProps> = ({ onStart, onNavigate }) => {
  const { isAuthenticated } = useAuth();

  return (
    <>


      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-10 leading-[0.85] flex flex-col">
              <motion.span
                initial={{ opacity: 0, x: -40, rotate: -2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 60, damping: 15 }}
              >
                Study Smarter,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.4, type: "spring", stiffness: 60, damping: 15 }}
                className="relative inline-block mt-4 md:mt-2"
              >
                <span className="text-[#f59e0b]">
                  Not Harder
                </span>
                <svg className="absolute -bottom-3 left-0 w-full h-6 text-[#f59e0b]/40" viewBox="0 0 400 40" preserveAspectRatio="none">
                  <motion.path
                    d="M 10 30 Q 100 10 200 30 Q 300 50 390 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 2.5, duration: 2.0, ease: "easeInOut" }}
                  />
                </svg>
              </motion.span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl font-medium tracking-tight">
              Transform your study materials into personalized quizzes, smart flashcards, and AI-powered chat.
              Master any subject with intelligent tools designed for your success.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {isAuthenticated ? (
                <>
                  <motion.button
                    onClick={onStart}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -4,
                      boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white rounded-2xl font-black text-xl transition-all flex items-center gap-3 overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(79,70,229,0.3)]"
                  >
                    {/* Animated Shine Effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite] pointer-events-none" />

                    <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10 tracking-tight">Upload PDF Now</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate('LIBRARY')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-8 py-5 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-lg hover:bg-white dark:hover:bg-white/10 hover:border-indigo-500/30 transition-all flex items-center gap-3"
                  >
                    <FileText className="w-5 h-5 opacity-60" />
                    My Library
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => onNavigate('SIGNUP')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-10 py-4 bg-[#003f88] hover:bg-[#004fa8] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#003f88]/20 transition-all flex items-center gap-3"
                  >
                    <span className="tracking-tight">Start Learning for Free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>

          {/* Right side - Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[500px]">
              {/* Card 1 - AI Analysis (Top Right) */}
              <div className="absolute top-0 right-0 w-64 p-6 bg-white/80 dark:bg-slate-900 border border-indigo-100 dark:border-white/10 rounded-[2rem] shadow-xl overflow-hidden z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-[2rem] pointer-events-none" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#0a194f] rounded-lg shadow-lg shadow-indigo-900/30">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">AI Analysis</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Instantly extracts key concepts</div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0a194f] dark:bg-white"
                      initial={{ width: '0%' }}
                      animate={{ width: '85%' }}
                      transition={{ delay: 1, duration: 1.5 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#0a194f] dark:text-white">85%</span>
                </div>
              </div>

              {/* Card 2 - Smart Highlights (Center Left) */}
              <div className="absolute top-32 -left-12 w-64 p-6 bg-white/80 dark:bg-slate-900 border border-violet-100 dark:border-white/10 rounded-[2rem] shadow-xl overflow-hidden z-30">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-[2rem] pointer-events-none" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-violet-500 rounded-lg shadow-lg shadow-violet-500/30">
                    <Highlighter className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">Smart Highlights</div>
                </div>
                <div className="space-y-2">
                  {['Cellular respiration', 'Photosynthesis'].map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-yellow-400' : 'bg-green-400'}`} />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3 - Quiz Score (Bottom Right) */}
              <div className="absolute bottom-12 right-12 w-56 p-6 bg-white/80 dark:bg-slate-900 border border-pink-100 dark:border-white/10 rounded-[2rem] shadow-xl overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-[2rem] pointer-events-none" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-500 rounded-lg shadow-lg shadow-pink-500/30">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold text-sm">Quiz Score</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-pink-600 dark:text-white mb-1">94%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Average improvement</div>
                </div>
              </div>

              {/* Card 4 - AI Chat (Bottom Left) */}
              <div className="absolute bottom-0 left-0 w-64 p-5 bg-white/80 dark:bg-slate-900 border border-emerald-100 dark:border-white/10 rounded-[2rem] shadow-xl overflow-hidden z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2rem] pointer-events-none" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-slate-900 dark:text-white font-bold">AI Chat Assistant</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-slate-100 dark:bg-white/10 rounded-lg p-2 text-xs text-slate-600 dark:text-slate-200">
                    "Explain photosynthesis"
                  </div>
                  <div className="bg-emerald-500/20 dark:bg-emerald-500/30 rounded-lg p-2 text-xs text-emerald-900 dark:text-white">
                    Photosynthesis converts light energy into chemical energy...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div> {/* End of max-w-7xl */}

      {/* Animated Demo Section - Full Width Dark Blue */}
      <div id="demo" className="relative w-full bg-[#0a1930] py-14 overflow-hidden scroll-mt-20">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle Glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

          {/* Contour / Wavy Lines Pattern (SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 20 Q 25 10 50 20 T 100 20" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M0 40 Q 25 30 50 40 T 100 40" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M0 60 Q 25 50 50 60 T 100 60" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M0 80 Q 25 70 50 80 T 100 80" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <div className="text-center mb-10">
              {/* Title */}
              <div className="flex items-center justify-center gap-x-3 text-5xl md:text-6xl font-black tracking-tight mb-4">
                <motion.span
                  initial={{ opacity: 0, x: -30, rotate: -5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white"
                >
                  Live
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 30, rotate: 5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-orange-500"
                >
                  Demo
                </motion.span>
              </div>

              {/* Animated gradient underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                className="mx-auto mb-5 h-1.5 w-24 rounded-full bg-orange-500 origin-center"
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-slate-400 whitespace-nowrap mx-auto leading-relaxed"
              >
                Watch CleverStudy turn a PDF into quizzes, flashcards, and AI chat — in seconds.
              </motion.p>
            </div>

            <AnimatedDemo />
          </motion.div>
        </div>
      </div>



      {/* How It Works Section - Off-white Background */}
      <div id="how-it-works" className="bg-[#fcfbf7] py-24 scroll-mt-20 relative overflow-hidden">

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="text-center mb-20">
            {/* Title */}
            <div className="flex items-center justify-center gap-x-4 text-5xl md:text-7xl font-black tracking-tight mb-4">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-slate-900"
              >
                How it
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="text-orange-500 inline-block"
              >
                works
              </motion.span>
            </div>

            {/* Animated gradient underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="mx-auto mb-5 h-1.5 w-24 rounded-full bg-orange-500 origin-center"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
              className="text-lg md:text-xl text-slate-500 whitespace-nowrap mx-auto leading-relaxed"
            >
              Three steps to turn any study material into an interactive learning experience.
            </motion.p>
          </div>

          <div className="relative">
            {/* Connection Line - Desktop */}
            <div className="hidden lg:flex absolute top-12 left-[15%] right-[15%] h-[2px] bg-indigo-50 items-center -z-0 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 bg-indigo-200 origin-left"
              />
              <div className="relative w-full h-full flex items-center justify-between pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-300 -translate-x-1/2 ml-[25%]" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-300 translate-x-1/2 mr-[25%]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative z-10">
              <StepCard
                step="1"
                icon={<Upload className="w-10 h-10 text-white" />}
                title="Upload your material"
                description="PDF lecture notes, textbooks, or study guides — we support all major formats."
                badge="PDF, DOCX, TXT"
                badgeColor="bg-indigo-50 text-indigo-600"
                color="bg-[#4f46e5]"
                delay={0}
              />
              <StepCard
                step="2"
                icon={<Brain className="w-10 h-10 text-white" />}
                title="AI analysis"
                description="Our AI extracts key concepts and generates smart questions tailored to your content."
                badge="Runs in seconds"
                badgeColor="bg-emerald-50 text-emerald-600"
                color="bg-[#3730a3]"
                delay={0.2}
              />
              <StepCard
                step="3"
                icon={<CheckCircle className="w-10 h-10 text-white" />}
                title="Practice and master"
                description="Take quizzes, review flashcards, and track your progress to ace your exams."
                badge="Avg. 94% score lift"
                badgeColor="bg-pink-50 text-pink-600"
                color="bg-[#9d174d]"
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-20">

        {/* ── FEATURES SECTION ── */}
        <div id="features" className="mt-8 mb-20 scroll-mt-32">

          {/* Section heading */}
          <div className="text-center mb-20">
            {/* Title */}
            <div className="flex flex-col items-center mb-4 text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2"
              >
                Everything you need to
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="text-2xl md:text-3xl font-bold italic pr-1 inline-block"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400">
                  study smarter, not harder
                </span>
              </motion.span>
            </div>

            {/* Animated gradient underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="mx-auto mb-5 h-1.5 w-40 rounded-full bg-orange-500 origin-center"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
              className="text-lg text-slate-500 dark:text-slate-400 whitespace-nowrap mx-auto"
            >
              From upload to mastery — Acadify handles every step.
            </motion.p>
          </div>

          {/* ── 3 PRIMARY FEATURES (alternating) ── */}
          <div className="space-y-24">

            {/* Feature 1 — Upload */}
            <motion.div
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="text-center flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Upload your materials and start instantly</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-md">
                  Drop any lecture note or textbook. CleverStudy processes it in seconds.
                </p>
                <ul className="space-y-2 flex flex-col items-center">
                  {['PDF, DOCX, and TXT formats', 'Drag-and-drop or file picker', 'Processes in under 30 seconds'].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mockup */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] p-6 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-xs text-slate-500">Upload</span>
                </div>
                <div className="border-2 border-dashed border-slate-300 dark:border-white/15 rounded-xl p-10 flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-indigo-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Drop any document here</p>
                  <p className="text-xs text-slate-500">or click to browse files</p>
                  <span className="mt-2 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold">Choose File</span>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-900 dark:text-white font-medium mb-1">lecture_notes.pdf</div>
                    <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-indigo-500 rounded-full" initial={{ width: '0%' }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 }} />
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </motion.div>

            {/* Feature 2 — AI Chat (reversed) */}
            <motion.div
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Mockup first on desktop */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] p-6 backdrop-blur md:order-first order-last">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-xs text-slate-500">AI Chat</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <span className="bg-indigo-600 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[75%]">Explain photosynthesis in simple terms</span>
                  </div>
                  <div className="flex justify-start">
                    <span className="bg-slate-200 dark:bg-white/8 border dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[80%]">Photosynthesis is how plants convert sunlight into energy. They use CO₂ and water to produce glucose and oxygen.</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="bg-indigo-600 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[75%]">What are the two main stages?</span>
                  </div>
                  <div className="flex justify-start">
                    <span className="bg-slate-200 dark:bg-white/8 border dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[80%]">The light-dependent reactions and the Calvin cycle (light-independent reactions).</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input readOnly placeholder="Ask anything about your notes…" className="flex-1 bg-slate-100 dark:bg-white/6 border dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-500 dark:text-slate-400 outline-none" />
                    <span className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">Send</span>
                  </div>
                </div>
              </div>
              <div className="md:order-last text-center flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Chat directly with your notes</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-md">
                  Ask anything about your material and get an instant, accurate answer.
                </p>
                <ul className="space-y-2 flex flex-col items-center">
                  {['Context-aware AI responses', 'Cite exact page references', 'Works across all your documents'].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Feature 3 — Quizzes */}
            <motion.div
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="text-center flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Auto-generated quizzes and flashcards</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-md">
                  Generates targeted questions from your content — so you study what matters.
                </p>
                <ul className="space-y-2 flex flex-col items-center">
                  {['Multiple-choice questions from your PDF', 'Spaced-repetition flashcards', 'Track scores and progress over time'].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mockup */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] p-6 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-xs text-slate-500">Quiz</span>
                </div>
                <p className="text-sm text-slate-900 dark:text-white font-semibold mb-4">What is the primary function of mitochondria?</p>
                <div className="space-y-2">
                  {[
                    { label: 'A', text: 'Protein synthesis', correct: false },
                    { label: 'B', text: 'Energy production (ATP)', correct: true },
                    { label: 'C', text: 'DNA replication', correct: false },
                    { label: 'D', text: 'Cell division', correct: false },
                  ].map(opt => (
                    <div key={opt.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-medium ${opt.correct
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-white/4 border-slate-200 dark:border-white/8 text-slate-600 dark:text-slate-300'
                      }`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${opt.correct ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                        }`}>{opt.label}</span>
                      {opt.text}
                      {opt.correct && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Question 3 of 12</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">2 / 2 correct</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── SECONDARY FEATURES — modern cards ── */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Smart Flashcards',
                  desc: 'Key terms auto-generated with spaced repetition for long-term retention.',
                },
                {
                  title: 'Progress Analytics',
                  desc: 'Track your scores and watch your performance improve session over session.',
                },
                {
                  title: 'Topic Summaries',
                  desc: 'AI-written summaries of complex topics, ready to review in minutes.',
                },
              ].map(({ title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col gap-3 p-6 rounded-2xl border border-slate-200 dark:border-white/8 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h4 className="text-slate-900 dark:text-white text-base font-bold">{title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Pricing Section */}
        <Pricing onNavigate={onNavigate} />



        {/* Premium Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mt-0 pt-16 pb-8 border-t border-slate-200 dark:border-white/10"
        >
          {/* Footer Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo size="xl" variant="auto" />
              </div>
              <p className="text-slate-400 text-base leading-relaxed max-w-md">
                Empowering students worldwide to achieve academic excellence through AI-powered learning tools.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Pricing', 'About Us'].map((link) => (
                  <li key={link}>
                    <button 
                      onClick={() => onNavigate(link === 'About Us' ? 'ABOUT_US' : 'HOME')} 
                      className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-violet-400 transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/10">
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                © 2026 Acadify. All rights reserved.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
};


const StepCard = ({ step, icon, title, description, color, delay, badge, badgeColor }: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
  badge?: string;
  badgeColor?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="text-center flex flex-col items-center group"
  >
    {/* Circular Icon with Step Number */}
    <div className="relative mb-10">
      {/* Step Number Circle with Spring Pop */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: delay + 0.3 }}
        className="absolute -top-2 -right-2 w-10 h-10 bg-white border-2 border-indigo-50 rounded-full flex items-center justify-center shadow-lg z-20"
      >
        <span className="text-base font-black text-indigo-600">{step}</span>
      </motion.div>

      {/* Pulsing Outer Glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0, 0.3, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay }}
        className={`absolute inset-0 rounded-full ${color} blur-xl -z-10`}
      />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: delay * 1.5 }}
        whileHover={{ scale: 1.1, rotate: 5, y: -12 }}
        className={`w-28 h-28 rounded-full ${color} flex items-center justify-center text-white shadow-2xl relative z-10 transition-shadow hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] cursor-default`}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, delay }}
        >
          {icon}
        </motion.div>
      </motion.div>
    </div>

    <div className="space-y-4 max-w-[280px]">
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="text-2xl font-bold text-slate-900 tracking-tight"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
        className="text-slate-600 font-medium leading-relaxed"
      >
        {description}
      </motion.p>

      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + 0.4 }}
          className="pt-2"
        >
          <span className={`inline-block px-4 py-1.5 rounded-full ${badgeColor} text-xs font-bold uppercase tracking-wider shadow-sm`}>
            {badge}
          </span>
        </motion.div>
      )}
    </div>
  </motion.div>
);
