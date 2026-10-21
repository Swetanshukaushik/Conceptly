import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ReelDto, ReelViewEventDto, DifficultyLevel } from '../../contracts';

@Injectable()
export class ReelsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapReelToDto(reel: any): ReelDto {
    let summaryNotes: string[] | undefined;
    let pitfalls: string[] | undefined;

    if (reel.summaryNotesJson) {
      try {
        summaryNotes = JSON.parse(reel.summaryNotesJson);
      } catch {
        summaryNotes = undefined;
      }
    }

    if (reel.pitfallsJson) {
      try {
        pitfalls = JSON.parse(reel.pitfallsJson);
      } catch {
        pitfalls = undefined;
      }
    }

    return {
      id: reel.id,
      title: reel.title,
      videoUrl: reel.videoUrl,
      durationSec: reel.durationSec,
      topicId: reel.topicId,
      keyTakeaway: reel.keyTakeaway ?? undefined,
      summaryNotes,
      architectureDiagram: reel.architectureDiagram ?? undefined,
      interviewPitch: reel.interviewPitch ?? undefined,
      pitfalls,
      topic: {
        id: reel.topic.id,
        title: reel.topic.title,
        difficulty: (reel.topic.difficulty as DifficultyLevel) || 'medium',
      },
      chapter: {
        id: reel.topic.chapter.id,
        title: reel.topic.chapter.titleEn,
      },
      subject: {
        id: reel.topic.chapter.subject.id,
        name: reel.topic.chapter.subject.name,
        classLevel: reel.topic.chapter.subject.classLevel ?? undefined,
        examType: reel.topic.chapter.subject.examType as any,
      },
    };
  }

  async getReelsByTopic(topicId: string): Promise<ReelDto[]> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });

    if (!topic) {
      throw new NotFoundException(`Topic not found for id: ${topicId}`);
    }

    const reels = await this.prisma.reel.findMany({
      where: { topicId },
      orderBy: { createdAt: 'asc' },
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

    return reels.map((r) => this.mapReelToDto(r));
  }

  async getReelById(id: string): Promise<ReelDto> {
    const reel = await this.prisma.reel.findUnique({
      where: { id },
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

    if (!reel) {
      throw new NotFoundException(`Reel not found for id: ${id}`);
    }

    return this.mapReelToDto(reel);
  }

  async recordReelView(
    userId: string,
    reelId: string,
    event: ReelViewEventDto
  ): Promise<{ status: string }> {
    const reel = await this.prisma.reel.findUnique({
      where: { id: reelId },
      select: { topicId: true },
    });

    if (reel && event.completed) {
      // Auto-increment topic progress on reel completion
      await this.prisma.topicProgress.upsert({
        where: {
          userId_topicId: {
            userId,
            topicId: reel.topicId,
          },
        },
        update: {
          completionPercent: 100,
        },
        create: {
          userId,
          topicId: reel.topicId,
          completionPercent: 50,
        },
      });
    }

    await this.prisma.analyticsEvent.create({
      data: {
        userId,
        eventName: 'reel_viewed',
        payload: JSON.stringify({
          reelId,
          watchDurationSec: event.watchDurationSec,
          completed: event.completed,
        }),
      },
    });

    return { status: 'recorded' };
  }
}
