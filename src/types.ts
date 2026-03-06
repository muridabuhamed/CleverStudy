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

export type AppState = 'HOME' | 'LOGIN' | 'SIGNUP' | 'UPLOAD' | 'PROCESSING' | 'TOPICS' | 'QUIZ' | 'RESULTS' | 'LIBRARY' | 'PROFILE';
