import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { 
  Brain, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Loader2,
  TrendingUp,
  History,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { flashcardsApi } from '../services/flashcardsApi';
import { FlashcardStats } from '../types';
import { StudyTimer } from '../../../shared/components/StudyTimer';
import { extractErrorMessage } from '@/shared/utils/errors';

interface FlashcardsProps {
  fileId: string;
  fileName: string;
  onBack: () => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ fileId, fileName, onBack }) => {
  const [flashcards, setFlashcards] = useState<FlashcardStats[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'due'>('due');

  useEffect(() => {
    loadFlashcards();
  }, [viewMode]);

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data;
      if (viewMode === 'due') {
        data = await flashcardsApi.getDueFlashcards(fileId);
      } else {
        data = await flashcardsApi.getFlashcards(fileId);
      }
      
      if (data.flashcards.length === 0 && viewMode === 'all') {
        setFlashcards([]);
      } else {
        // @ts-ignore - Handle type differences if any
        setFlashcards(data.stats || data.flashcards);
      }
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err: any) {
      console.error('Failed to load flashcards:', err);
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      await flashcardsApi.generateFlashcards(fileId, 15);
      setViewMode('all');
      await loadFlashcards();
    } catch (err: any) {
      console.error('Failed to generate flashcards:', err);
      setError(extractErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDifficultySelect = async (difficulty: 'easy' | 'good' | 'hard' | 'again') => {
    const currentCard = flashcards[currentIndex];
    
    try {
      await flashcardsApi.reviewFlashcard(currentCard.id, difficulty);
      
      setSwipeDirection(difficulty === 'easy' || difficulty === 'good' ? 'right' : 'left');
      
      setTimeout(() => {
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        } else {
          if (viewMode === 'due') loadFlashcards();
        }
        setSwipeDirection(null);
      }, 300);
      
    } catch (err) {
      console.error('Failed to save review:', err);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold && isFlipped) {
      handleDifficultySelect('good');
    } else if (info.offset.x < -threshold && isFlipped) {
      handleDifficultySelect('again');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Preparing your session...</p>
        </div>
      </div>
    );
  }

  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <StudyTimer fileId={fileId} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                {fileName}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                Flashcard Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('due')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'due' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              Due Today
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'all' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              All Cards
            </button>
          </div>
        </div>

        {flashcards.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {viewMode === 'due' ? 'No Cards Due!' : 'No Flashcards Yet'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {viewMode === 'due' 
                ? 'You\'ve caught up on all your reviews. Great job! Check back later or review all cards.' 
                : 'Generate AI-powered flashcards from your study material to start learning.'}
            </p>
            {viewMode === 'all' && (
              <button
                onClick={handleGenerateFlashcards}
                disabled={isGenerating}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-3 mx-auto shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Generate Flashcards
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {currentIndex + 1} / {flashcards.length}
                </span>
              </div>
              <button
                onClick={() => { setCurrentIndex(0); setIsFlipped(false); }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Restart
              </button>
            </div>

            {/* Flashcard */}
            <div className="relative h-[450px] mb-8">
              <AnimatePresence mode="wait">
                {!swipeDirection && (
                  <motion.div
                    key={currentIndex}
                    drag={isFlipped ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <motion.div
                      onClick={handleFlip}
                      className="relative w-full h-full cursor-pointer preserve-3d"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center backface-hidden">
                        <div className="absolute top-8 left-8 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                          <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center leading-tight">
                          {flashcards[currentIndex].question}
                        </h3>
                        <div className="absolute bottom-8 text-slate-400 text-sm font-medium flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Tap to reveal answer
                        </div>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] shadow-2xl p-12 flex flex-col items-center justify-center text-white backface-hidden rotate-y-180">
                        <div className="absolute top-8 left-8 p-3 bg-white/10 rounded-2xl">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="overflow-y-auto max-h-[250px] custom-scrollbar px-4">
                          <p className="text-xl md:text-2xl font-medium text-center leading-relaxed">
                            {flashcards[currentIndex].answer}
                          </p>
                        </div>
                        <div className="absolute bottom-8 text-indigo-100/70 text-sm font-medium">
                          Rate your recall below
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SRS Controls */}
            <div className="min-h-[100px]">
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
                  >
                    {[
                      { id: 'again', label: 'Again', color: 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200', icon: RotateCcw, sub: '< 10m' },
                      { id: 'hard', label: 'Hard', color: 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200', icon: AlertCircle, sub: '2d' },
                      { id: 'good', label: 'Good', color: 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200', icon: Zap, sub: '4d' },
                      { id: 'easy', label: 'Easy', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200', icon: CheckCircle2, sub: '7d' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={(e) => { e.stopPropagation(); handleDifficultySelect(btn.id as any); }}
                        className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all group active:scale-95 ${btn.color}`}
                      >
                        <btn.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">{btn.label}</span>
                        <span className="text-[10px] opacity-70 font-mono mt-1">{btn.sub}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Nav Controls */}
            <div className="flex items-center justify-between mt-8">
              <button 
                onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setIsFlipped(false); }}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <button 
                onClick={() => { setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1)); setIsFlipped(false); }}
                disabled={currentIndex === flashcards.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
