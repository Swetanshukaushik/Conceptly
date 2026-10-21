import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  TopicProgressDto,
  UpdateProgressRequestDto,
  DifficultyLevel,
} from '../../contracts';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private mapProgressToDto(p: any): TopicProgressDto {
    return {
      id: p.id,
      topicId: p.topicId,
      completionPercent: p.completionPercent,
      quizScore: p.quizScore ?? undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      topic: {
        id: p.topic.id,
        title: p.topic.title,
        difficulty: (p.topic.difficulty as DifficultyLevel) || 'medium',
      },
      chapter: {
        id: p.topic.chapter.id,
        title: p.topic.chapter.titleEn,
      },
      subject: {
        id: p.topic.chapter.subject.id,
        name: p.topic.chapter.subject.name,
        classLevel: p.topic.chapter.subject.classLevel ?? undefined,
        examType: p.topic.chapter.subject.examType as any,
      },
    };
  }

  async getUserProgress(userId: string): Promise<TopicProgressDto[]> {
    const progress = await this.prisma.topicProgress.findMany({
      where: { userId },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return progress.map((p) => this.mapProgressToDto(p));
  }

  async updateProgress(
    userId: string,
    dto: UpdateProgressRequestDto
  ): Promise<TopicProgressDto> {
    const progress = await this.prisma.topicProgress.upsert({
      where: {
        userId_topicId: {
          userId,
          topicId: dto.topicId,
        },
      },
      update: {
        completionPercent: dto.completionPercent,
      },
      create: {
        userId,
        topicId: dto.topicId,
        completionPercent: dto.completionPercent,
      },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true },
            },
          },
        },
      },
    });

    return this.mapProgressToDto(progress);
  }
}
