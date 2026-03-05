declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(apiKey: string);
    getGenerativeModel(options: { model: string }): GenerativeModel;
  }

  export interface GenerativeModel {
    generateContent(prompt: string): Promise<GenerateContentResult>;
  }

  export interface GenerateContentResult {
    response: GenerateContentResponse;
  }

  export interface GenerateContentResponse {
    text(): string;
  }
}
