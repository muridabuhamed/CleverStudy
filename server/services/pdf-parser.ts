import fs from 'fs';
import pdf from 'pdf-parse';
import { ERROR_MESSAGES } from '../../src/config/constants.js';

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    // Clean up the extracted text
    const text = data.text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
      .trim();

    console.log(`📄 Extracted ${text.length} characters from PDF`);
    if (!text || text.length < 50) {
      throw new Error(ERROR_MESSAGES.NO_TEXT_FOUND);
    }

    return text;
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    throw new Error(error.message || 'Failed to extract text from PDF');
  }
}

export function chunkText(text: string, maxChunkSize: number = 30000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
