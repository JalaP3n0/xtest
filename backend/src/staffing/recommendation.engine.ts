import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { AIService } from './ai.service';

@Injectable()
export class RecommendationEngine {
  constructor(
    private prisma: PrismaService,
    private ai: AIService,
  ) {}

  async recommendUshers(eventId: string, limit: number = 10) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new Error('Event not found');

    // Generate embedding for event requirements
    // For now, we use the event name and language as a proxy for requirements
    const eventText = `${event.name} language: ${event.language}`;
    const embedding = await this.ai.generateEmbedding(eventText);

    // Vector search using pgvector
    // We use cosine distance (<=>)
    const vectorString = `[${embedding.join(',')}]`;
    
    const ushers: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        u.id, 
        u."userId",
        u.bio,
        u.experience,
        u.rating,
        u."reliabilityScore",
        (u.embedding <=> $1::vector) as distance
      FROM "Usher" u
      JOIN "User" user_account ON u."userId" = user_account.id
      WHERE user_account."companyId" = $2
      ORDER BY distance ASC
      LIMIT $3
    `, vectorString, event.companyId, limit);

    // Enrich with AI explanation
    const enrichedUshers = await Promise.all(
      ushers.map(async (usher) => {
        const explanation = await this.ai.getRankingExplanation(
          `${usher.bio} experience: ${usher.experience}`,
          eventText
        );
        return {
          ...usher,
          similarity: 1 - usher.distance,
          explanation,
        };
      })
    );

    return enrichedUshers;
  }
}
