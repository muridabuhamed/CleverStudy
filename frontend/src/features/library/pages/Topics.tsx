import React from 'react';
import { motion } from 'motion/react';
import { Tag, BookOpen, ArrowRight, Lightbulb, Star, Brain, Sparkles, Zap } from 'lucide-react';
import { ProgressTracker } from '@/shared/components/ProgressTracker';
import { StudyTimer } from '@/shared/components/StudyTimer';

interface TopicsProps {
  topics: string[];
  fileId: number | null;
  onStartQuiz: () => void;
  onStartFlashcards: () => void;
}

export const Topics: React.FC<TopicsProps> = ({ topics, fileId, onStartQuiz, onStartFlashcards }) => {
  return (
    <div className="relative min-h-screen py-12 px-6">
      {/* Study Timer */}
      {fileId && (
        <div className="fixed top-20 right-6 z-50">
          <StudyTimer fileId={fileId} />
        </div>
      )}
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.04, 0.07, 0.04],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-700 text-sm font-bold mb-6 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            Analysis Complete
          </motion.div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Key Topics Discovered
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Master these essential concepts to excel in your studies
          </p>
        </motion.div>

        {/* Topics Grid with Enhanced Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {topics.map((topic, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: idx * 0.08,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
            >
              {/* Animated Gradient Background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              
              {/* Glow Effect */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/20 group-hover:to-purple-400/20 rounded-full blur-3xl transition-all duration-500"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Tag className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div
                    whileHover={{ rotate: 72, scale: 1.2 }}
                    transition={{ type: "spring" }}
                  >
                    <Star className="w-5 h-5 text-slate-300 group-hover:text-amber-400 group-hover:fill-amber-400 transition-all duration-300" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                  {topic}
                </h3>
                
                {/* Topic Number Badge */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center text-xs font-black text-slate-500 dark:text-slate-400 group-hover:from-indigo-100 group-hover:to-purple-100 dark:group-hover:from-indigo-900 dark:group-hover:to-purple-900 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                  {idx + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compact Progress Tracker */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <ProgressTracker />
        </motion.div>

        {/* Enhanced CTA Cards in Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-10 text-white shadow-2xl overflow-hidden cursor-pointer"
          >
            {/* Animated Glow */}
            <motion.div 
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-60 h-60 bg-purple-400 rounded-full blur-3xl group-hover:bg-pink-400 transition-colors"
            />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            
            <div className="relative text-center">
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="inline-flex p-4 bg-white/15 backdrop-blur-sm rounded-3xl mb-5 shadow-xl"
              >
                <BookOpen className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-black mb-3">Test Your Knowledge</h3>
              <p className="text-indigo-100 text-base mb-8 leading-relaxed">
                Challenge yourself with 10 AI-generated questions designed to reinforce your understanding.
              </p>
              <motion.button
                onClick={onStartQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all flex items-center gap-3 mx-auto shadow-2xl group/btn"
              >
                Start Quiz Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5 group-hover/btn:text-amber-500 transition-colors" />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-10 text-white shadow-2xl overflow-hidden cursor-pointer"
          >
            {/* Animated Glow */}
            <motion.div 
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia-400 rounded-full blur-3xl group-hover:bg-pink-400 transition-colors"
            />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            
            <div className="relative text-center">
              <motion.div 
                whileHover={{ rotate: -12, scale: 1.1 }}
                className="inline-flex p-4 bg-white/15 backdrop-blur-sm rounded-3xl mb-5 shadow-xl"
              >
                <Brain className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-black mb-3">Master with Flashcards</h3>
              <p className="text-violet-100 text-base mb-8 leading-relaxed">
                Practice smart with AI-powered flashcards. Swipe, learn, and track your progress effortlessly.
              </p>
              <motion.button
                onClick={onStartFlashcards}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-violet-600 rounded-2xl font-black text-lg hover:bg-violet-50 transition-all flex items-center gap-3 mx-auto shadow-2xl group/btn"
              >
                Create Flashcards
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 group-hover/btn:text-pink-500 transition-colors" />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
