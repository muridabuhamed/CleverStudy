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
    throw new Error('API key environment variable is required');
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
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze document');
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

export async function chatWithDocument(
  documentText: string,
  userMessage: string,
  history: { role: 'user' | 'model'; parts: string }[] = []
): Promise<string> {
  try {
    const genAI = getGenAI();

    // System prompt with strict document context
    const systemPrompt = `You are a study assistant helping a student understand a specific document.

STRICT RULES:
1. ONLY answer questions based on the provided document content.
2. If the user asks something NOT related to the document, politely say: "I'm sorry, I can only help you with questions related to your study document. Please ask something about the content of the file."
3. Be concise and academic.
4. If appropriate, offer to:
   - Create a practice exam/quiz
   - Create flashcards
   - Summarize a section

Document Content:
${documentText.slice(0, 30000)}

Conversation History:
${history.map(h => `${h.role === 'user' ? 'Student' : 'Assistant'}: ${h.parts}`).join('\n')}
`;

    // @ts-ignore - models property exists at runtime
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\nStudent: ${userMessage}\nAssistant:`
    });

    return result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

  } catch (error) {
    console.error('Chat error:', error);
    throw new Error('Failed to process chat request');
  }
}

export async function generateFlashcards(text: string, count: number = 15): Promise<Array<{ question: string; answer: string }>> {
  try {
    const genAI = getGenAI();

    // Use first chunk if text is too long
    const chunks = chunkText(text, 30000);
    const analysisText = chunks[0];

    const prompt = `Generate ${count} flashcards from this educational document. Create question-answer pairs that help students learn key concepts.

Document:
${analysisText}

Requirements:
- Create ${count} flashcards
- Questions should be clear and focused on one concept
- Answers should be concise but complete (2-4 sentences)
- Cover different topics from the document
- Mix question types: definitions, concepts, applications, comparisons

Return ONLY a JSON array in this format:
[
  {
    "question": "What is X?",
    "answer": "X is defined as..."
  },
  {
    "question": "Explain the concept of Y",
    "answer": "Y refers to..."
  }
]

JSON:`;

    // @ts-ignore - models property exists at runtime
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const flashcards = parseJSONResponse<Array<{ question: string; answer: string }>>(responseText, []);

    console.log(`🗂️ Generated ${flashcards.length} flashcards`);

    return flashcards.slice(0, count);

  } catch (error) {
    console.error('Flashcard generation error:', error);
    throw new Error('Failed to generate flashcards');
  }
}

