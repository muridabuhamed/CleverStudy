import React from 'react';
import { motion } from 'motion/react';
import { Tag, BookOpen, ArrowRight, Lightbulb, Star, Brain } from 'lucide-react';
import { ProgressTracker } from '../components/ProgressTracker';

interface TopicsProps {
  topics: string[];
  onStartQuiz: () => void;
  onStartFlashcards: () => void;
}

export const Topics: React.FC<TopicsProps> = ({ topics, onStartQuiz, onStartFlashcards }) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-sm font-bold mb-5 shadow-sm"
        >
          <Lightbulb className="w-4 h-4" />
          Analysis Complete
        </motion.div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Important Topics Found</h2>
        <p className="text-slate-600 text-base max-w-2xl mx-auto">
          We've identified the core concepts from your document. Review these before starting your quiz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {topics.map((topic, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative p-5 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-default overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <Star className="w-4 h-4 text-slate-300 group-hover:text-amber-400 group-hover:fill-amber-400 transition-all" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{topic}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Tracker */}
      <div className="mb-8">
        <ProgressTracker />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-10 text-center text-white shadow-xl overflow-hidden mb-6"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-5">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Ready to test your knowledge?</h3>
          <p className="text-indigo-100 text-base mb-8 max-w-xl mx-auto">
            We've generated 10 custom questions based on these topics to help you practice.
          </p>
          <button
            onClick={onStartQuiz}
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition-all flex items-center gap-2 mx-auto shadow-lg"
          >
            Start Practice Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-10 text-center text-white shadow-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-5">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Study with Flashcards</h3>
          <p className="text-violet-100 text-base mb-8 max-w-xl mx-auto">
            Master these topics with AI-generated flashcards. Swipe through cards and track your progress!
          </p>
          <button
            onClick={onStartFlashcards}
            className="px-8 py-4 bg-white text-violet-600 rounded-xl font-bold text-lg hover:bg-violet-50 hover:scale-105 transition-all flex items-center gap-2 mx-auto shadow-lg"
          >
            Create Flashcards
            <Brain className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
