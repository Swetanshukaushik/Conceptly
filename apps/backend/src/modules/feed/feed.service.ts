import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ExamType } from '@prisma/client';
import {
  HomeFeedDto,
  TopicDetailDto,
  DifficultyLevel,
} from '../../contracts';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  private mapTopicToDetailDto(topic: any): TopicDetailDto {
    let cheatSheetSummary: string[] | undefined;
    if (topic.cheatSheetJson) {
      try {
        cheatSheetSummary = JSON.parse(topic.cheatSheetJson);
      } catch {
        cheatSheetSummary = undefined;
      }
    }

    return {
      id: topic.id,
      title: topic.title,
      difficulty: (topic.difficulty as DifficultyLevel) || 'medium',
      chapterId: topic.chapterId,
      reelCount: topic._count?.reels ?? topic.reels?.length ?? 1,
      chapter: {
        id: topic.chapter.id,
        title: topic.chapter.titleEn,
      },
      subject: {
        id: topic.chapter.subject.id,
        name: topic.chapter.subject.name,
        classLevel: topic.chapter.subject.classLevel ?? undefined,
        examType: topic.chapter.subject.examType as any,
      },
      cheatSheetSummary,
    };
  }

  async getHomeFeed(
    userId: string,
    examTypeStr?: string,
    classLevel?: number
  ): Promise<HomeFeedDto> {
    // 1. Normalize exam type
    let normalizedExamType: ExamType = 'TECH';
    if (examTypeStr) {
      const upper = examTypeStr.toUpperCase();
      if (upper.includes('TECH')) normalizedExamType = 'TECH';
      else if (upper.includes('PM')) normalizedExamType = 'PM';
      else if (upper.includes('FIN')) normalizedExamType = 'FINANCE';
      else if (upper.includes('UPSC')) normalizedExamType = 'UPSC';
      else if (upper.includes('JEE')) normalizedExamType = 'IIT_JEE';
      else if (upper.includes('NEET')) normalizedExamType = 'NEET';
      else if (upper.includes('SCHOOL')) normalizedExamType = 'SCHOOL';
    }

    // 2. Build subject filter
    const subjectFilter: any = { examType: normalizedExamType };
    if (normalizedExamType === 'SCHOOL' && classLevel) {
      subjectFilter.classLevel = classLevel;
    }

    // 3. Query subjects for shortcuts
    const subjects = await this.prisma.subject.findMany({
      where: subjectFilter,
      orderBy: { name: 'asc' },
      take: 6,
    });

    const subjectShortcuts = subjects.map((s) => ({
      id: s.id,
      name: s.name,
      classLevel: s.classLevel ?? undefined,
      examType: s.examType as any,
    }));

    // 4. Query user's real progress for "continueLearning"
    const userProgress = await this.prisma.topicProgress.findMany({
      where: {
        userId,
        topic: {
          chapter: {
            subject: subjectFilter,
          },
        },
      },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true },
            },
            _count: { select: { reels: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    });

    let continueLearning: TopicDetailDto[] = userProgress.map((p) =>
      this.mapTopicToDetailDto(p.topic)
    );

    // If user has no progress yet in this track, fallback to initial topics
    if (continueLearning.length === 0) {
      const fallbackTopics = await this.prisma.topic.findMany({
        where: {
          chapter: {
            subject: subjectFilter,
          },
        },
        include: {
          chapter: {
            include: { subject: true },
          },
          _count: { select: { reels: true } },
        },
        orderBy: { title: 'asc' },
        take: 3,
      });
      continueLearning = fallbackTopics.map((t) => this.mapTopicToDetailDto(t));
    }

    // 5. Query Recommended topics
    const recommendedTopics = await this.prisma.topic.findMany({
      where: {
        chapter: {
          subject: subjectFilter,
        },
      },
      include: {
        chapter: {
          include: { subject: true },
        },
        _count: { select: { reels: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    });

    // 6. Query Quick Revision topics (those with active reels)
    const quickRevisionTopics = await this.prisma.topic.findMany({
      where: {
        chapter: {
          subject: subjectFilter,
        },
        reels: { some: {} },
      },
      include: {
        chapter: {
          include: { subject: true },
        },
        _count: { select: { reels: true } },
      },
      orderBy: { title: 'desc' },
      take: 3,
    });

    return {
      subjectShortcuts,
      continueLearning,
      recommended: recommendedTopics.map((t) => this.mapTopicToDetailDto(t)),
      quickRevision: quickRevisionTopics.map((t) => this.mapTopicToDetailDto(t)),
    };
  }
}
