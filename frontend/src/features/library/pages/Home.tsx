import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Zap, Upload, Brain, CheckCircle, FileText, MessageSquare, ListChecks, CreditCard, BarChart3, BookOpenCheck, Highlighter, Star } from 'lucide-react';
import { AppState } from '@/App';
import { useAuth } from '@/shared/contexts/AuthContext';
import { AnimatedDemo } from '@/shared/components/AnimatedDemo';
import { Logo } from '@/shared/components/Logo';

interface HomeProps {
  onStart: () => void;
  onNavigate: (state: AppState) => void;
}

export const Home: React.FC<HomeProps> = ({ onStart, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-indigo-500 dark:bg-indigo-600 rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse" />
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-violet-500 dark:bg-violet-600 rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[20%] left-[30%] w-64 h-64 bg-pink-500 dark:bg-pink-600 rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-23 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
              Study Smarter,{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
                  Not Harder
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
              Transform your PDFs into personalized quizzes, smart flashcards, and AI-powered chat. 
              Master any subject with intelligent study tools designed for your success.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {isAuthenticated ? (
                <>
                  <motion.button
                    onClick={onStart}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-bold text-lg shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload PDF Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate('LIBRARY')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/30 transition-all flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    My Library
                    <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => onNavigate('SIGNUP')}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-bold text-lg shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate('LOGIN')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/30 transition-all flex items-center gap-2"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
            <div className="relative">
              {/* Card 1 - AI Analysis */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-0 right-12 w-64 p-6 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 backdrop-blur-xl border border-indigo-400/30 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-bold">AI Analysis</div>
                </div>
                <div className="text-sm text-slate-300">Instantly extracts key concepts and generates smart questions</div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-400 to-violet-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '85%' }}
                      transition={{ delay: 1, duration: 1.5 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-indigo-300">85%</span>
                </div>
              </motion.div>

              {/* Card 2 - Smart Highlights */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute top-48 -left-8 w-72 p-6 bg-gradient-to-br from-violet-500/20 to-pink-500/20 backdrop-blur-xl border border-violet-400/30 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-violet-500 rounded-lg">
                    <Highlighter className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-bold">Smart Highlights</div>
                </div>
                <div className="space-y-2">
                  {['Cellular respiration', 'Photosynthesis', 'DNA replication'].map((topic, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + i * 0.2 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-green-400' : 'bg-blue-400'}`} />
                      <span className="text-slate-300">{topic}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3 - Quiz Score */}
              <motion.div
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute bottom-12 right-0 w-56 p-6 bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl border border-pink-400/30 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-500 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-bold">Quiz Score</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-1">94%</div>
                  <div className="text-sm text-slate-300">Average improvement</div>
                </div>
              </motion.div>

              {/* Card 4 - AI Chat Assistant */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-0 -left-12 w-64 p-5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-bold">AI Chat Assistant</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/10 rounded-lg p-2 text-xs text-slate-200">
                    "Explain photosynthesis"
                  </div>
                  <div className="bg-emerald-500/30 rounded-lg p-2 text-xs text-white">
                    Photosynthesis converts light energy into chemical energy...
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Animated Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mt-48"
        >
          <AnimatedDemo />
        </motion.div>

        {/* How It Works Section */}
        <div className="mt-32 mb-16">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold mb-4 backdrop-blur-sm">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Get started in three simple steps and transform your study materials into interactive learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-purple-500/30 -z-10"></div>
            <StepCard step={1} icon={<Upload className="w-8 h-8 text-white" />} title="Upload Your Material" description="Drop your PDF lecture notes, textbooks, or study guides. We support all major document formats." color="bg-indigo-600" delay={0} />
            <StepCard step={2} icon={<Brain className="w-8 h-8 text-white" />} title="AI Analysis" description="Our advanced AI extracts key concepts, topics, and generates smart questions tailored to your content." color="bg-violet-600" delay={0.15} />
            <StepCard step={3} icon={<CheckCircle className="w-8 h-8 text-white" />} title="Practice & Master" description="Take quizzes, review flashcards, and track your progress to ace your exams with confidence." color="bg-purple-600" delay={0.3} />
          </div>
        </div>

        {/* ── FEATURES SECTION ── */}
        <div className="mt-32 mb-20">

          {/* Section heading */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 text-slate-300 text-xs font-semibold mb-5 uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" /> Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Everything you need to study smarter
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From upload to mastery — Acadify handles every step.
            </p>
          </motion.div>

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
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 border border-white/10 mb-6">
                  <FileText className="w-5 h-5 text-indigo-300" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Upload PDFs and start instantly</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Drop any lecture note or textbook. CleverStudy processes it in seconds.
                </p>
                <ul className="space-y-2">
                  {['PDF, DOCX, and TXT formats', 'Drag-and-drop or file picker', 'Processes in under 30 seconds'].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mockup */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-xs text-slate-500">Upload</span>
                </div>
                <div className="border-2 border-dashed border-white/15 rounded-xl p-10 flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-indigo-400" />
                  <p className="text-sm text-slate-300 font-medium">Drop your PDF here</p>
                  <p className="text-xs text-slate-500">or click to browse files</p>
                  <span className="mt-2 px-4 py-1.5 rounded-lg bg-indigo-600/80 text-white text-xs font-semibold">Choose File</span>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-300 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-white font-medium mb-1">lecture_notes.pdf</div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-indigo-500 rounded-full" initial={{ width: '0%' }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 }} />
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:order-first order-last">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-xs text-slate-500">AI Chat</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <span className="bg-indigo-600/80 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[75%]">Explain photosynthesis in simple terms</span>
                  </div>
                  <div className="flex justify-start">
                    <span className="bg-white/8 border border-white/10 text-slate-200 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[80%]">Photosynthesis is how plants convert sunlight into energy. They use CO₂ and water to produce glucose and oxygen.</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="bg-indigo-600/80 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[75%]">What are the two main stages?</span>
                  </div>
                  <div className="flex justify-start">
                    <span className="bg-white/8 border border-white/10 text-slate-200 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[80%]">The light-dependent reactions and the Calvin cycle (light-independent reactions).</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input readOnly placeholder="Ask anything about your notes…" className="flex-1 bg-white/6 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 outline-none" />
                    <span className="px-3 py-2 rounded-xl bg-indigo-600/80 text-white text-xs font-semibold">Send</span>
                  </div>
                </div>
              </div>
              <div className="md:order-last">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 border border-white/10 mb-6">
                  <MessageSquare className="w-5 h-5 text-emerald-300" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Chat directly with your notes</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Ask anything about your material and get an instant, accurate answer.
                </p>
                <ul className="space-y-2">
                  {['Context-aware AI responses', 'Cite exact page references', 'Works across all your documents'].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />{t}
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
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 border border-white/10 mb-6">
                  <ListChecks className="w-5 h-5 text-violet-300" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Auto-generated quizzes and flashcards</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Generates targeted questions from your content — so you study what matters.
                </p>
                <ul className="space-y-2">
                  {['Multiple-choice questions from your PDF', 'Spaced-repetition flashcards', 'Track scores and progress over time'].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Mockup */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-xs text-slate-500">Quiz</span>
                </div>
                <p className="text-sm text-white font-semibold mb-4">What is the primary function of mitochondria?</p>
                <div className="space-y-2">
                  {[
                    { label: 'A', text: 'Protein synthesis', correct: false },
                    { label: 'B', text: 'Energy production (ATP)', correct: true },
                    { label: 'C', text: 'DNA replication', correct: false },
                    { label: 'D', text: 'Cell division', correct: false },
                  ].map(opt => (
                    <div key={opt.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-medium ${
                      opt.correct
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                        : 'bg-white/4 border-white/8 text-slate-300'
                    }`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        opt.correct ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
                      }`}>{opt.label}</span>
                      {opt.text}
                      {opt.correct && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Question 3 of 12</span>
                  <span className="text-emerald-400 font-semibold">2 / 2 correct</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── SECONDARY FEATURES — inline stat row ── */}
          <motion.div
            className="mt-24 pt-12 border-t border-white/8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/8">
              {[
                { icon: <CreditCard className="w-4 h-4 text-pink-300" />, title: 'Smart Flashcards', desc: 'Key terms, auto-generated with spaced repetition.' },
                { icon: <BarChart3 className="w-4 h-4 text-amber-300" />, title: 'Progress Analytics', desc: 'See your scores improve session over session.' },
                { icon: <BookOpenCheck className="w-4 h-4 text-sky-300" />, title: 'Topic Summaries', desc: 'AI-written summaries ready to review in minutes.' },
              ].map(({ icon, title, desc }, i) => (
                <div key={title} className={`flex flex-col gap-2 py-6 ${i === 0 ? 'md:pr-10' : i === 1 ? 'md:px-10' : 'md:pl-10'}`}>
                  <div className="flex items-center gap-2 text-white text-sm font-semibold">
                    {icon}{title}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ── PRICING SECTION ── */}
        <div className="mt-32 mb-20">
          {/* Heading */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-4 backdrop-blur-sm">
              <Star className="w-4 h-4" /> Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Choose the plan that fits your study needs
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0 }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col p-10 bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Free</p>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-5xl font-black text-white leading-none">$0</span>
                  <span className="text-slate-400 text-sm mb-1.5">/month</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">Perfect to get started</p>
              </div>
              <div className="h-px bg-white/8 mb-8" />
              <ul className="space-y-3.5 flex-1">
                {['Upload limited PDFs', 'Basic AI analysis', 'Limited quizzes', 'Standard support'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('SIGNUP')}
                className="mt-10 w-full py-3.5 rounded-xl border border-white/15 text-slate-300 text-sm font-semibold hover:border-white/30 hover:text-white transition-all duration-200"
              >
                Get Started Free
              </motion.button>
            </motion.div>

            {/* Pro — highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col p-10 rounded-3xl border-2 border-indigo-500/80 scale-[1.05] z-10 transition-all duration-300"
              style={{ background: 'linear-gradient(150deg,rgba(79,70,229,0.22) 0%,rgba(109,40,217,0.18) 100%)' }}
            >
              {/* Most Popular badge */}
              <div className="absolute -top-[17px] left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 14px rgba(99,102,241,0.5)' }}>
                  <Star className="w-3 h-3 fill-white" /> Most Popular
                </span>
              </div>
              {/* Subtle glow */}
              <div className="absolute inset-0 rounded-3xl bg-indigo-600/5 blur-2xl -z-10 pointer-events-none" />

              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-3">Pro</p>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-5xl font-black text-white leading-none">$9.99</span>
                  <span className="text-indigo-200 text-sm mb-1.5">/month</span>
                </div>
                <p className="text-indigo-300/70 text-xs mt-2">Best for serious students</p>
              </div>
              <div className="h-px bg-indigo-400/20 mb-8" />
              <ul className="space-y-3.5 flex-1">
                {['Unlimited PDF uploads', 'Full AI analysis', 'Unlimited quizzes & flashcards', 'AI Chat Assistant', 'Progress analytics'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-200 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('SIGNUP')}
                className="mt-10 w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all duration-200"
                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 6px 24px rgba(99,102,241,0.45)' }}
              >
                Upgrade to Pro
              </motion.button>
            </motion.div>

            {/* Premium */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col p-10 bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/10 hover:border-violet-400/30 transition-all duration-300"
            >
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-300 mb-3">Premium</p>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-5xl font-black text-white leading-none">$19.99</span>
                  <span className="text-slate-400 text-sm mb-1.5">/month</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">For power users & teams</p>
              </div>
              <div className="h-px bg-white/8 mb-8" />
              <ul className="space-y-3.5 flex-1">
                {['Everything in Pro', 'Faster AI responses', 'Advanced analytics', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('SIGNUP')}
                className="mt-10 w-full py-3.5 rounded-xl border border-violet-400/30 text-slate-300 text-sm font-semibold hover:border-violet-400/60 hover:text-white hover:bg-violet-500/10 transition-all duration-200"
              >
                Go Premium
              </motion.button>
            </motion.div>
          </div>

          {/* Trust line */}
          <motion.p
            className="text-center text-slate-400 text-sm mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            No credit card required. Cancel anytime.
          </motion.p>
        </div>

        {/* Premium Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mt-32 pt-16 pb-8 border-t border-white/10"
        >
          {/* Footer Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo size="lg" variant="dark" />
              </div>
              <p className="text-slate-400 text-base leading-relaxed max-w-md">
                Empowering students worldwide to achieve academic excellence through AI-powered learning tools.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Pricing', 'About Us'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Support</h4>
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
          <div className="pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                © 2026 Acadify. All rights reserved.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};


const StepCard = ({ step, icon, title, description, color, delay }: { 
  step: number; 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ delay, duration: 0.55, ease: 'easeOut' }}
    className="relative"
  >
    {/* Icon Badge with Step Number */}
    <div className="flex justify-center mb-6">
      <div className="relative">
        {/* Step Number - positioned on top-left of icon */}
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-white border-3 border-indigo-400 rounded-full flex items-center justify-center z-20 shadow-lg">
          <span className="text-sm font-bold text-indigo-600">{step}</span>
        </div>
        
        {/* Icon Badge */}
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-xl`}>
          {icon}
        </div>
      </div>
    </div>

    <div className="text-center">
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);
