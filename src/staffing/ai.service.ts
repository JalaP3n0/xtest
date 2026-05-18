import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AIService.name);

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your-openai-api-key') {
      try {
        this.openai = new OpenAI({
          apiKey: apiKey,
        });
        this.logger.log('OpenAI Service initialized successfully.');
      } catch (error) {
        this.logger.error('Failed to initialize OpenAI Service:', error.message);
      }
    } else {
      this.logger.warn('OPENAI_API_KEY is missing. AI features will use mock data.');
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      // Return a dummy embedding (1536 dimensions for text-embedding-3-small)
      return new Array(1536).fill(0);
    }

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  async getRankingExplanation(usherProfile: string, eventRequirements: string): Promise<string> {
    if (!this.openai) {
      return 'AI explanation is disabled (OpenAI key missing). This usher matches the basic requirements.';
    }

    try {
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
    } catch (error) {
      this.logger.error('Error getting AI explanation:', error.message);
      return 'Unable to generate AI explanation at this time.';
    }
  }
}
