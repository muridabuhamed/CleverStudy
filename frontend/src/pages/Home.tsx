import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Zap, Upload, Brain, CheckCircle, FileText, MessageSquare, ListChecks, CreditCard, BarChart3, BookOpenCheck, Highlighter } from 'lucide-react';
import { AppState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedDemo } from '../components/AnimatedDemo';

interface HomeProps {
  onStart: () => void;
  onNavigate: (state: AppState) => void;
}

export const Home: React.FC<HomeProps> = ({ onStart, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-violet-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[20%] left-[30%] w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
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
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
              Transform your PDFs into personalized quizzes, smart flashcards, and AI-powered chat. 
              Master any subject with intelligent study tools designed for your success.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {isAuthenticated ? (
                <>
                  <motion.button
                    onClick={onStart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all\"
                  >
                    Upload PDF
                  </motion.button>
                  <motion.button
                    onClick={() => onNavigate('LIBRARY')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                  >
                    My Library
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-48"
        >
          <AnimatedDemo />
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-32 mb-16"
        >
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold mb-4 backdrop-blur-sm">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Get started in three simple steps and transform your study materials into interactive learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line - aligned with icon centers, hidden on mobile */}
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-purple-500/30 -z-10"></div>
            
            <StepCard
              step={1}
              icon={<Upload className="w-8 h-8 text-white" />}
              title="Upload Your Material"
              description="Drop your PDF lecture notes, textbooks, or study guides. We support all major document formats."
              color="bg-indigo-600"
              delay={0.5}
            />
            
            <StepCard
              step={2}
              icon={<Brain className="w-8 h-8 text-white" />}
              title="AI Analysis"
              description="Our advanced AI extracts key concepts, topics, and generates smart questions tailored to your content."
              color="bg-violet-600"
              delay={0.6}
            />
            
            <StepCard
              step={3}
              icon={<CheckCircle className="w-8 h-8 text-white" />}
              title="Practice & Master"
              description="Take quizzes, review flashcards, and track your progress to ace your exams with confidence."
              color="bg-purple-600"
              delay={0.7}
            />
          </div>
        </motion.div>

        {/* Powerful Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-32 mb-16"
        >
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-sm font-semibold mb-4 backdrop-blur-sm">
              Powerful Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Comprehensive tools designed to enhance your learning experience and boost academic performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-blue-400" />}
              title="Upload PDFs & Documents"
              description="Allow users to upload lecture notes, textbooks, and research papers in formats like PDF, DOCX, and TXT."
              delay={0.9}
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-emerald-400" />}
              title="AI Chat with Your Notes"
              description="Users can ask questions directly about their uploaded materials and receive instant AI explanations."
              delay={1.0}
            />
            <FeatureCard
              icon={<ListChecks className="w-6 h-6 text-purple-400" />}
              title="Automatic Quiz Generation"
              description="The system analyzes the uploaded content and generates multiple-choice questions based on key concepts."
              delay={1.1}
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6 text-pink-400" />}
              title="Smart Flashcards"
              description="Automatically create flashcards from important terms and definitions to support spaced repetition learning."
              delay={1.2}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-amber-400" />}
              title="Progress Analytics"
              description="Track quiz scores, learning progress, and identify weak areas that need more focus."
              delay={1.3}
            />
            <FeatureCard
              icon={<BookOpenCheck className="w-6 h-6 text-indigo-400" />}
              title="Topic Summaries"
              description="Generate clear summaries of important sections to help students review faster."
              delay={1.4}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay || 0, duration: 0.5 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/20 hover:bg-white/10 transition-all text-left cursor-pointer"
  >
    <motion.div 
      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-md transition-shadow border border-indigo-400/20"
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{title}</h3>
    <p className="text-slate-300 leading-relaxed">{description}</p>
  </motion.div>
);

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
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
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
