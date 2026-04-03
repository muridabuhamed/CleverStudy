import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { 
  Brain, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Sparkles,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { FlashcardStats } from '../types';

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

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getFlashcards(fileId);
      
      if (data.flashcards.length === 0) {
        // No flashcards yet, need to generate
        setFlashcards([]);
      } else {
        setFlashcards(data.stats || data.flashcards);
      }
    } catch (err: any) {
      console.error('Failed to load flashcards:', err);
      setError(err.message || 'Failed to load flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      await api.generateFlashcards(fileId, 15);
      await loadFlashcards();
    } catch (err: any) {
      console.error('Failed to generate flashcards:', err);
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDifficultySelect = async (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentCard = flashcards[currentIndex];
    
    try {
      await api.reviewFlashcard(currentCard.id, difficulty);
      
      // Show swipe animation
      setSwipeDirection(difficulty === 'easy' ? 'right' : 'left');
      
      // Wait for animation then move to next card
      setTimeout(() => {
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
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

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold && isFlipped) {
      // Swipe right = Easy
      handleDifficultySelect('easy');
    } else if (info.offset.x < -threshold && isFlipped) {
      // Swipe left = Hard
      handleDifficultySelect('hard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <p className="text-slate-600 font-medium">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-indigo-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">No Flashcards Yet</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Generate AI-powered flashcards from "{fileName}" to start learning effectively!
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerateFlashcards}
              disabled={isGenerating}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-lg shadow-indigo-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Flashcards
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentIndex + 1}</span> / {flashcards.length}
            </div>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Reset to first card"
            >
              <RotateCcw className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative mb-8" style={{ height: '400px' }}>
          <AnimatePresence>
            {!swipeDirection && (
              <motion.div
                key={currentIndex}
                drag={isFlipped ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <motion.div
                  onClick={handleFlip}
                  className="relative w-full h-full cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-indigo-200 dark:border-indigo-700 p-12 flex flex-col items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <Brain className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-4">
                      {currentCard.question}
                    </h3>
                    <p className="text-slate-500 text-sm">Click to reveal answer</p>
                    
                    {currentCard.review_count > 0 && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                        <TrendingUp className="w-3 h-3" />
                        Reviewed {currentCard.review_count}x
                      </div>
                    )}
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center text-white"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <CheckCircle2 className="w-12 h-12 mb-6" />
                    <p className="text-xl leading-relaxed text-center">
                      {currentCard.answer}
                    </p>
                    <p className="text-indigo-200 text-sm mt-6">Swipe or tap buttons below</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <button
              onClick={() => handleDifficultySelect('hard')}
              className="px-6 py-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-2xl font-semibold text-red-700 transition-all flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Hard
            </button>
            <button
              onClick={() => handleDifficultySelect('medium')}
              className="px-6 py-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 rounded-2xl font-semibold text-amber-700 transition-all flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              Medium
            </button>
            <button
              onClick={() => handleDifficultySelect('easy')}
              className="px-6 py-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 rounded-2xl font-semibold text-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Easy
            </button>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="text-center">
            <p className="text-sm text-slate-500">
              {currentIndex === flashcards.length - 1 ? '🎉 Last card!' : 'Keep going!'}
            </p>
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
