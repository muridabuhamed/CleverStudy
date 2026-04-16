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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-48"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Live Demo
            </h2>
          </div>
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
          className="mt-32 mb-20"
        >
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/30 to-purple-500/30 border-2 border-violet-400/50 text-violet-200 text-sm font-bold mb-6 backdrop-blur-xl shadow-xl"
            >
              Live Demo
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Everything You Need{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                to Excel
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive AI-powered tools designed to transform your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FileText className="w-7 h-7" />}
              title="Upload PDFs & Documents"
              description="Drag and drop your lecture notes, textbooks, and research papers. Support for PDF, DOCX, and TXT formats."
              gradient="from-blue-500 to-indigo-600"
              delay={0.9}
            />
            <FeatureCard
              icon={<MessageSquare className="w-7 h-7" />}
              title="AI Chat with Your Notes"
              description="Ask questions about your materials and get instant, intelligent explanations powered by advanced AI."
              gradient="from-emerald-500 to-teal-600"
              delay={1.0}
            />
            <FeatureCard
              icon={<ListChecks className="w-7 h-7" />}
              title="Automatic Quiz Generation"
              description="AI analyzes your content and creates smart multiple-choice questions targeting key concepts."
              gradient="from-purple-500 to-violet-600"
              delay={1.1}
            />
            <FeatureCard
              icon={<CreditCard className="w-7 h-7" />}
              title="Smart Flashcards"
              description="Automatically generate flashcards from important terms with spaced repetition algorithms."
              gradient="from-pink-500 to-rose-600"
              delay={1.2}
            />
            <FeatureCard
              icon={<BarChart3 className="w-7 h-7" />}
              title="Progress Analytics"
              description="Track your quiz scores, monitor learning patterns, and identify areas for improvement."
              gradient="from-amber-500 to-orange-600"
              delay={1.3}
            />
            <FeatureCard
              icon={<BookOpenCheck className="w-7 h-7" />}
              title="Topic Summaries"
              description="Get clear, concise summaries of complex topics to accelerate your review and understanding."
              gradient="from-indigo-500 to-purple-600"
              delay={1.4}
            />
          </div>
        </motion.div>

        {/* Premium Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="relative mt-32 pt-16 pb-8 border-t border-white/10"
        >
          {/* Footer Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-xl">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white">Smart Study Platform</h3>
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
                © 2026 Smart Study Platform. All rights reserved.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  gradient: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: delay || 0, duration: 0.5, type: "spring" }}
    whileHover={{ y: -10, scale: 1.03 }}
    className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-white/30 transition-all overflow-hidden cursor-pointer"
  >
    {/* Animated Gradient Background on Hover */}
    <motion.div 
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      animate={{ 
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
    />
    
    {/* Glow Effect */}
    <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-all duration-500`} />
    
    <div className="relative">
      <motion.div 
        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.15 }}
        transition={{ duration: 0.6 }}
        className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg text-white`}
      >
        {icon}
      </motion.div>
      
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">
        {title}
      </h3>
      
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
        {description}
      </p>

      {/* Arrow indicator */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 right-6 text-white/50 group-hover:text-white/80"
      >
        <ArrowRight className="w-5 h-5" />
      </motion.div>
    </div>

    {/* Shine Effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
      style={{ transform: 'skewX(-20deg)' }}
    />
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
