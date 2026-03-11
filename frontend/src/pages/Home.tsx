import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Zap, Upload, Brain, CheckCircle, FileText, MessageSquare, ListChecks, CreditCard, BarChart3, BookOpenCheck } from 'lucide-react';
import { AppState } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  onStart: () => void;
  onNavigate: (state: AppState) => void;
}

export const Home: React.FC<HomeProps> = ({ onStart, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      {/* Lightweight animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100 rounded-full blur-3xl opacity-60 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Smart Study Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Master Any Subject with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Smart Study Platform
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your lecture notes, textbooks, or research papers. Our platform analyzes your content
            and generates custom exam questions to help you ace your tests.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <motion.button
                  onClick={onStart}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  Upload PDF Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('LIBRARY')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:shadow-lg hover:border-slate-300 transition-all flex items-center gap-2"
                >
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
                  className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('LOGIN')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:shadow-lg hover:border-slate-300 transition-all flex items-center gap-2"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-32 mb-16"
        >
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-700 text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get started in three simple steps and transform your study materials into interactive learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line - aligned with icon centers, hidden on mobile */}
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-purple-200 -z-10"></div>
            
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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-700 text-sm font-semibold mb-4">
              Powerful Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools designed to enhance your learning experience and boost academic performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-blue-500" />}
              title="Upload PDFs & Documents"
              description="Allow users to upload lecture notes, textbooks, and research papers in formats like PDF, DOCX, and TXT."
              delay={0.9}
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-green-500" />}
              title="AI Chat with Your Notes"
              description="Users can ask questions directly about their uploaded materials and receive instant AI explanations."
              delay={1.0}
            />
            <FeatureCard
              icon={<ListChecks className="w-6 h-6 text-purple-500" />}
              title="Automatic Quiz Generation"
              description="The system analyzes the uploaded content and generates multiple-choice questions based on key concepts."
              delay={1.1}
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6 text-pink-500" />}
              title="Smart Flashcards"
              description="Automatically create flashcards from important terms and definitions to support spaced repetition learning."
              delay={1.2}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-orange-500" />}
              title="Progress Analytics"
              description="Track quiz scores, learning progress, and identify weak areas that need more focus."
              delay={1.3}
            />
            <FeatureCard
              icon={<BookOpenCheck className="w-6 h-6 text-indigo-500" />}
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
    className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all text-left cursor-pointer"
  >
    <motion.div 
      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="w-12 h-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-md transition-shadow"
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
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
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-white border-3 border-slate-200 rounded-full flex items-center justify-center z-20 shadow-lg">
          <span className="text-sm font-bold text-slate-700">{step}</span>
        </div>
        
        {/* Icon Badge */}
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-xl`}>
          {icon}
        </div>
      </div>
    </div>

    <div className="text-center">
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);
