import { GoogleGenAI } from '@google/genai';
import { Question } from '../../src/types.js';
import { chunkText } from './pdf-parser.js';

interface DocumentAnalysis {
  topics: string[];
  questions: Question[];
}

function getGenAI(): any {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  // @ts-ignore - Constructor signature mismatch in type definitions
  return new GoogleGenAI({ apiKey });
}

export async function analyzeDocument(text: string): Promise<DocumentAnalysis> {
  try {
    // @ts-ignore - Type definitions incomplete
    const genAI = getGenAI();

    // If text is too long, use only the first chunk for analysis
    const chunks = chunkText(text, 30000);
    const analysisText = chunks[0];

    // Step 1: Extract key topics
    const topicsPrompt = `Analyze the following educational document and extract 6-8 key topics or concepts that a student should understand. 

Document:
${analysisText}

Return ONLY a JSON array of topics, for example:
["Topic 1", "Topic 2", "Topic 3"]

JSON:`;

    // @ts-ignore - models property exists at runtime
    const topicsResult = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: topicsPrompt
    });

    const topicsText = topicsResult.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const topics = parseJSONResponse<string[]>(topicsText, []);

    console.log(`🎯 Extracted ${topics.length} topics`);

    // Step 2: Generate quiz questions
    const questionsPrompt = `Based on this educational document, generate exactly 10 multiple-choice questions to test a student's understanding.

Document:
${analysisText}

Key topics to cover:
${topics.join(', ')}

For each question, provide:
1. A clear question text
2. Four answer options (A, B, C, D)
3. The correct answer index (0, 1, 2, or 3)
4. A brief explanation of why the answer is correct

Return ONLY a JSON array in this exact format:
[
  {
    "id": "1",
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1,
    "explanation": "Explanation here."
  }
]

JSON:`;
    // @ts-ignore - models property exists at runtime

    const questionsResult = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: questionsPrompt
    });

    const questionsText = questionsResult.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const questions = parseJSONResponse<Question[]>(questionsText, []);

    // Ensure all questions have IDs
    questions.forEach((q, idx) => {
      if (!q.id) q.id = String(idx + 1);
    });

    console.log(`❓ Generated ${questions.length} questions`);

    return {
      topics: topics.slice(0, 8),
      questions: questions.slice(0, 10)
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to analyze document with AI');
  }
}

function parseJSONResponse<T>(text: string, fallback: T): T {
  try {
    // Try to find JSON in code blocks
    const jsonMatch = text.match(/```json?\n?([\s\S]*?)\n?```/) || text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const jsonText = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonText.trim());
    }

    // Try parsing the whole text
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.error('Raw text:', text);
    return fallback;
  }
}
