import { httpClient } from '@/shared/utils/httpClient';

export interface Flashcard {
  id: string;
  file_id: string;
  question: string;
  answer: string;
  created_at: string;
  next_review_at?: string;
  interval?: number;
  ease_factor?: number;
  repetitions?: number;
}

export interface FlashcardStats extends Flashcard {
  review_count: number;
  last_difficulty: 'easy' | 'good' | 'hard' | 'again' | null;
  last_reviewed: string | null;
}

export interface GenerateFlashcardsResponse {
  success: boolean;
  flashcards: Flashcard[];
  message: string;
}

export interface GetFlashcardsResponse {
  flashcards: Flashcard[];
  stats?: FlashcardStats[];
}

export interface ReviewFlashcardResponse {
  success: boolean;
  message: string;
}

export const flashcardsApi = {
  async generateFlashcards(fileId: string, count: number = 15): Promise<GenerateFlashcardsResponse> {
    return httpClient.post(`/flashcards/generate/${fileId}`, { count });
  },

  async getFlashcards(fileId: string): Promise<GetFlashcardsResponse> {
    return httpClient.get(`/flashcards/${fileId}`);
  },

  async reviewFlashcard(flashcardId: string, difficulty: 'easy' | 'good' | 'hard' | 'again'): Promise<ReviewFlashcardResponse> {
    return httpClient.post('/flashcards/review', { flashcardId, difficulty });
  },

  async getDueFlashcards(fileId?: string): Promise<{ flashcards: Flashcard[]; count: number }> {
    const url = fileId ? `/flashcards/review/due?file_id=${fileId}` : '/flashcards/review/due';
    return httpClient.get(url);
  },
};
