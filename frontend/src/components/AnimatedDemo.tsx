import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Brain, MessageSquare, CheckCircle, FileText, Sparkles, Highlighter, BookOpen, StickyNote } from 'lucide-react';

const DEMO_STEPS = [
  {
    id: 1,
    title: 'Upload Your PDF',
    description: 'Drag and drop your study materials',
    icon: Upload,
    color: 'from-blue-500 to-indigo-600',
    preview: (
      <div className="space-y-4">
        {/* Upload Area */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
          <div className="relative flex flex-col items-center gap-4 p-8 bg-white rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 transition">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Upload className="w-12 h-12 text-indigo-600" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">Drop your PDF here</p>
              <p className="text-xs text-slate-500">or click to browse</p>
            </div>
          </div>
        </div>
        {/* Sample file card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
        >
          <FileText className="w-8 h-8 text-indigo-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Biology_Chapter_5.pdf</p>
            <p className="text-xs text-slate-500">2.4 MB • Just now</p>
          </div>
          <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'AI Analyzes Content',
    description: 'Our AI extracts key concepts and topics',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    preview: (
      <div className="space-y-4">
        {/* AI Processing Header */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Analyzing document...</p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
              <motion.div
                className="bg-white h-1.5 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>
        </div>
        {/* Topics Grid */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">Topics Identified:</p>
          <div className="grid grid-cols-2 gap-2">
            {["Cell Structure", "Photosynthesis", "DNA Replication", "Mitosis"].map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200"
              >
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-slate-700">{topic}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Smart Highlighting',
    description: 'Highlight and annotate key information',
    icon: Highlighter,
    color: 'from-amber-500 to-orange-600',
    preview: (
      <div className="space-y-3">
        {/* PDF Page Mockup */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-600  leading-relaxed mb-2">
            Mitochondria are the powerhouse of the cell. They produce
            <motion.span
              className="bg-yellow-200 px-1 mx-1 rounded"
              initial={{ backgroundColor: "transparent" }}
              animate={{ backgroundColor: "#fef08a" }}
              transition={{ delay: 0.5 }}
            >
              ATP synthesis
            </motion.span>
            through cellular respiration. This process converts nutrients into
            <motion.span
              className="bg-green-200 px-1 mx-1 rounded"
              initial={{ backgroundColor: "transparent" }}
              animate={{ backgroundColor: "#bbf7d0" }}
              transition={{ delay: 1 }}
            >
              energy production
            </motion.span>
            essential for cell function.
          </p>
          {/* Color Palette */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex gap-1.5">
              {['bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-pink-200'].map((color, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className={`w-6 h-6 ${color} rounded-full border-2 border-white shadow-sm`}
                />
              ))}
            </div>
            <button className="px-2 py-1 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition flex items-center gap-1">
              <StickyNote className="w-3 h-3" />
              Add Note
            </button>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'AI Chat Assistant',
    description: 'Ask questions about your materials',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-600',
    preview: (
      <div className="space-y-3">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="flex items-start gap-2 max-w-[85%]">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-3 py-2 rounded-2xl rounded-tr-sm shadow-sm">
              <p className="text-xs">Explain ATP synthesis</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
              U
            </div>
          </div>
        </div>
        {/* AI Typing Indicator */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* AI Response */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-start gap-2"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
            <p className="text-xs text-slate-700">
              ATP synthesis occurs in mitochondria through a process called oxidative phosphorylation. The electron transport chain creates a proton gradient used by ATP synthase to produce energy molecules.
            </p>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Test Your Knowledge',
    description: 'Practice with AI-generated quizzes',
    icon: CheckCircle,
    color: 'from-teal-500 to-cyan-600',
    preview: (
      <div className="space-y-3">
        {/* Quiz Question Card */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          {/* Question Header */}
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs font-bold rounded-lg">
              Q1
            </div>
            <p className="text-xs font-semibold text-slate-800">
              What is the primary function of mitochondria?
            </p>
          </div>
          {/* Answer Options */}
          <div className="space-y-2">
            {[
              { text: 'Protein synthesis', correct: false },
              { text: 'Energy production (ATP)', correct: true },
              { text: 'DNA storage', correct: false },
            ].map((option, i) => (
              <motion.div
                key={i}
                whileHover={ { scale: 1.02 }}
                className={`p-2 rounded-lg border-2 cursor-pointer transition ${
                  option.correct
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    option.correct ? 'border-teal-500 bg-teal-500' : 'border-slate-300'
                  }`}>
                    {option.correct && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs text-slate-700">{option.text}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Score Display */}
        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '90%' }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <span className="text-xs font-bold text-white">90%</span>
        </div>
      </div>
    ),
  },
];

export const AnimatedDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentStepData = DEMO_STEPS[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="relative">
        {/* Live Demo Badge */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 z-10"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-lg border border-slate-200">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-bold text-slate-700">Live Demo</span>
          </div>
        </motion.div>

        {/* Browser Chrome */}
        <div className="bg-slate-800 rounded-t-2xl p-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-slate-700 rounded px-3 py-1 text-center">
            <span className="text-xs text-slate-300">acadify.com</span>
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-b-2xl p-8 shadow-2xl">
          {/* Step Header */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${currentStepData.color} shadow-lg`}
            >
              <StepIcon className="w-8 h-8 text-white" />
            </motion.div>
            <div className="flex-1">
              <motion.h3
                key={`title-${currentStep}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-slate-900"
              >
                {currentStepData.title}
              </motion.h3>
              <motion.p
                key={`desc-${currentStep}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-slate-600"
              >
                {currentStepData.description}
              </motion.p>
            </div>
          </div>

          {/* Preview Area */}
          <div className="bg-slate-50 rounded-xl p-6 min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {currentStepData.preview}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {DEMO_STEPS.map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  width: idx === currentStep ? 32 : 8,
                  backgroundColor: idx === currentStep ? '#6366f1' : '#cbd5e1',
                }}
                className="h-2 rounded-full cursor-pointer"
                onClick={() => setCurrentStep(idx)}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
            {DEMO_STEPS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => setCurrentStep(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    idx === currentStep
                      ? 'bg-white border-indigo-400 shadow-lg'
                      : 'bg-white/50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    idx === currentStep ? 'text-indigo-600' : 'text-slate-400'
                  }`} />
                  <div className={`text-xs font-medium ${
                    idx === currentStep ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {s.title}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
