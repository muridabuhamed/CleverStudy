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
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-4"
        >
          <Lightbulb className="w-4 h-4" />
          Analysis Complete
        </motion.div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Important Topics Found</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          We've identified the core concepts from your document. Review these before starting your quiz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {topics.map((topic, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group p-6 bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                <Tag className="w-6 h-6 text-indigo-600 group-hover:text-white" />
              </div>
              <Star className="w-5 h-5 text-slate-200 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{topic}</h3>
          </motion.div>
        ))}
      </div>

      {/* Progress Tracker */}
      <div className="mb-12">
        <ProgressTracker />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-indigo-600 rounded-[2.5rem] p-12 text-center text-white shadow-2xl shadow-indigo-200 mb-8"
      >
        <BookOpen className="w-12 h-12 mx-auto mb-6 opacity-80" />
        <h3 className="text-3xl font-bold mb-4">Ready to test your knowledge?</h3>
        <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
          We've generated 10 custom questions based on these topics to help you practice.
        </p>
        <button
          onClick={onStartQuiz}
          className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-all flex items-center gap-3 mx-auto shadow-lg"
        >
          Start Practice Quiz
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-[2.5rem] p-12 text-center text-white shadow-2xl shadow-violet-200"
      >
        <Brain className="w-12 h-12 mx-auto mb-6 opacity-80" />
        <h3 className="text-3xl font-bold mb-4">Study with Flashcards</h3>
        <p className="text-violet-100 text-lg mb-10 max-w-xl mx-auto">
          Master these topics with AI-generated flashcards. Swipe through cards and track your progress!
        </p>
        <button
          onClick={onStartFlashcards}
          className="px-10 py-5 bg-white text-violet-600 rounded-2xl font-black text-xl hover:bg-violet-50 transition-all flex items-center gap-3 mx-auto shadow-lg"
        >
          Create Flashcards
          <Brain className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
};
