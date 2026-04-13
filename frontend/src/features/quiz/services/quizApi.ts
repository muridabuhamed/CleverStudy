import { httpClient } from '@/shared/utils/httpClient';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
}

export interface SubmitQuizResponse {
  success: boolean;
  attemptId: string;
}

export const quizApi = {
  async submitQuizAttempt(fileId: string, score: number, total: number): Promise<SubmitQuizResponse> {
    return httpClient.post('/quiz/submit', { fileId, score, total });
  },
};
