import React from 'react';
import { motion } from 'motion/react';
import { Question } from '../types';
import { ChevronRight, HelpCircle, Clock } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onComplete: (answers: { questionId: string; selectedAnswer: number }[]) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({});
  
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (isLast) {
      const answers = questions.map(q => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id]
      }));
      onComplete(answers);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">Question {currentIndex + 1} of {questions.length}</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">Practice Quiz</h2>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Clock className="w-4 h-4" />
            15:00
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-indigo-600 dark:bg-indigo-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm"
      >
        <div className="flex gap-4 mb-6">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
            {currentQuestion.text}
          </h3>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                selectedAnswers[currentQuestion.id] === idx
                  ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100"
                  : "border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedAnswers[currentQuestion.id] === idx
                  ? "border-indigo-600 bg-indigo-600"
                  : "border-slate-300"
              }`}>
                {selectedAnswers[currentQuestion.id] === idx && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={selectedAnswers[currentQuestion.id] === undefined}
          onClick={handleNext}
          className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all ${
            selectedAnswers[currentQuestion.id] === undefined
              ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              : "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50 hover:bg-indigo-700 dark:hover:bg-indigo-600"
          }`}
        >
          {isLast ? "Finish Quiz" : "Next Question"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
