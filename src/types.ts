export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

export type QuizResult = {
  score: number;
  total: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
};

export type Flashcard = {
  id: string;
  file_id: string;
  question: string;
  answer: string;
  created_at: string;
};

export type FlashcardStats = {
  id: string;
  question: string;
  answer: string;
  review_count: number;
  last_difficulty: 'easy' | 'medium' | 'hard' | null;
  last_reviewed: string | null;
};

export type AppState = 'HOME' | 'LOGIN' | 'SIGNUP' | 'UPLOAD' | 'PROCESSING' | 'TOPICS' | 'QUIZ' | 'RESULTS' | 'LIBRARY' | 'PROFILE' | 'FLASHCARDS';
