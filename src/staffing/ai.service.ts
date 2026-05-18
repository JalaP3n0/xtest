import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  async getRankingExplanation(usherProfile: string, eventRequirements: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an AI staffing expert. Explain why an usher is a good fit for an event based on their profile and event requirements. Be concise.',
        },
        {
          role: 'user',
          content: `Usher Profile: ${usherProfile}\nEvent Requirements: ${eventRequirements}`,
        },
      ],
    });

    return response.choices[0].message.content || 'No explanation available.';
  }
}
