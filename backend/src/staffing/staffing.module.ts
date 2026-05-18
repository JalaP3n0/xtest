import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { RecommendationEngine } from './recommendation.engine';
import { VerificationService } from './verification.service';
import { StorageService } from '../lib/storage.service';
import { PrismaService } from '../lib/prisma.service';

@Module({
  providers: [AIService, RecommendationEngine, VerificationService, StorageService, PrismaService],
  exports: [RecommendationEngine, VerificationService],
})
export class StaffingModule {}
