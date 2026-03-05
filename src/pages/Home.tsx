import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100 rounded-full blur-3xl opacity-60 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Master Any Subject with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              AI Study Helper
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your lecture notes, textbooks, or research papers. Our AI analyzes your content 
            and generates custom exam questions to help you ace your tests.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              Upload PDF Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              See How it Works
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-amber-500" />}
            title="Instant Analysis"
            description="Get your study materials analyzed in seconds using state-of-the-art AI models."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-emerald-500" />}
            title="Smart Questions"
            description="Generated questions focus on key concepts and learning objectives from your text."
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-indigo-500" />}
            title="Progress Tracking"
            description="Monitor your understanding and identify areas that need more focus."
          />
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);
