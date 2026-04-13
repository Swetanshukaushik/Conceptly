import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { HomeFeedDto } from './dto/home-feed.dto';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  private buildTopicItem(topic: any) {
    return {
      id: topic.id,
      title: topic.title,
      difficulty: topic.difficulty,
      reelCount: topic._count?.reels ?? topic.reels?.length ?? 0,
      chapter: {
        id: topic.chapter.id,
        title: topic.chapter.title
      },
      subject: {
        id: topic.chapter.subject.id,
        name: topic.chapter.subject.name,
        classLevel: topic.chapter.subject.classLevel
      }
    };
  }

  async getHomeFeed(examType?: string, classLevel?: number): Promise<HomeFeedDto> {
    const selectedExamType = examType ?? 'SCHOOL';
    const selectedClassLevel = classLevel ?? (selectedExamType === 'SCHOOL' ? await this.resolveDefaultClassLevel() : undefined);

    let subjectFilter: any = { examType: selectedExamType };
    if (selectedClassLevel) {
      subjectFilter.classLevel = selectedClassLevel;
    }

    const [subjects, recentTopics, recommendedTopics, quickRevisionTopics] = await Promise.all([
      this.prisma.subject.findMany({
        where: subjectFilter,
        orderBy: { name: 'asc' },
        take: 6
      }),
      this.prisma.topic.findMany({
        where: { chapter: { subject: subjectFilter } },
        orderBy: { updatedAt: 'desc' },
        include: {
          chapter: {
            include: { subject: true }
          },
          _count: { select: { reels: true } }
        },
        take: 3
      }),
      this.prisma.topic.findMany({
        where: { chapter: { subject: subjectFilter } },
        orderBy: { title: 'asc' },
        include: {
          chapter: {
            include: { subject: true }
          },
          _count: { select: { reels: true } }
        },
        take: 4
      }),
      this.prisma.topic.findMany({
        where: {
          chapter: { subject: { classLevel: selectedClassLevel } },
          reels: { some: {} }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          chapter: {
            include: { subject: true }
          },
          _count: { select: { reels: true } }
        },
        take: 3
      })
    ]);

    if (subjects.length === 0) {
      throw new NotFoundException(`No subjects found for class level ${selectedClassLevel}`);
    }

    return {
      subjectShortcuts: subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        classLevel: subject.classLevel
      })),
      continueLearning: recentTopics.map((topic) => this.buildTopicItem(topic)),
      recommended: recommendedTopics.map((topic) => this.buildTopicItem(topic)),
      quickRevision: quickRevisionTopics.map((topic) => this.buildTopicItem(topic))
    };
  }

  private async resolveDefaultClassLevel(): Promise<number> {
    const subject = await this.prisma.subject.findFirst({
      orderBy: { classLevel: 'asc' }
    });

    if (!subject) {
      throw new NotFoundException('No available subjects found in the curriculum');
    }

    return subject.classLevel;
  }
}
