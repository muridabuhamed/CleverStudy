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

export type Highlight = {
  id: string;
  file_id: string;
  user_id: string;
  page_number: number;
  text_content: string;
  color: string;
  position_data: string;
  created_at: string;
};

export type Annotation = {
  id: string;
  file_id: string;
  user_id: string;
  page_number: number;
  note_text: string;
  position_data: string;
  created_at: string;
  updated_at: string;
};

export type Bookmark = {
  id: string;
  file_id: string;
  user_id: string;
  page_number: number;
  title: string;
  created_at: string;
};

export type AnnotationSearchResult = {
  id: string;
  file_id: string;
  file_name: string;
  page_number: number;
  type: 'highlight' | 'annotation';
  text_content?: string;
  note_text?: string;
  created_at: string;
};

export type AppState = 'HOME' | 'LOGIN' | 'SIGNUP' | 'UPLOAD' | 'PROCESSING' | 'TOPICS' | 'QUIZ' | 'RESULTS' | 'LIBRARY' | 'PROFILE' | 'FLASHCARDS';
