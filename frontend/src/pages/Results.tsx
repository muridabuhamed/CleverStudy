import React from 'react';
import { motion } from 'motion/react';
import { Trophy, CheckCircle2, XCircle, RotateCcw, Upload } from 'lucide-react';
import { Question, QuizResult } from '../types';

interface ResultsProps {
  questions: Question[];
  result: QuizResult;
  onRestart: () => void;
  onNewUpload: () => void;
}

export const Results: React.FC<ResultsProps> = ({ questions, result, onRestart, onNewUpload }) => {
  const percentage = Math.round((result.score / result.total) * 100);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Score Header */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm mb-12"
      >
        <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">Here's how you performed on your study material.</p>
        
        <div className="flex justify-center gap-12 mb-10">
          <div className="text-center">
            <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-1">{percentage}%</div>
            <div className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-slate-900 dark:text-slate-100 mb-1">{result.score}/{result.total}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button 
            onClick={onRestart}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50 hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </motion.button>
          <motion.button 
            onClick={onNewUpload}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:shadow-md"
          >
            <Upload className="w-5 h-5" />
            Upload New PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Detailed Review */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 px-2">Detailed Review</h3>
        {questions.map((q, idx) => {
          const userAns = result.answers.find(a => a.questionId === q.id);
          const isCorrect = userAns?.isCorrect;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-3xl border ${
                isCorrect ? "border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-900/20" : "border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/20"
              }`}
            >
              <div className="flex gap-4">
                <div className="mt-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{q.text}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAns?.selectedAnswer === optIdx;
                      const isCorrectOpt = q.correctAnswer === optIdx;
                      
                      let statusClass = "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-slate-300";
                      if (isCorrectOpt) statusClass = "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 font-bold";
                      else if (isSelected && !isCorrect) statusClass = "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100 font-bold";

                      return (
                        <div key={optIdx} className={`p-4 rounded-xl border text-sm ${statusClass}`}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                  
                  {q.explanation && (
                    <div className="mt-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl text-sm text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 italic">
                      <span className="font-bold not-italic text-slate-900 dark:text-slate-100 mr-2">Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
