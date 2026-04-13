import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { TopicProgressDto } from './dto/topic-progress.dto';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProgress(): Promise<TopicProgressDto[]> {
    // For MVP, assume user ID is hardcoded (would come from auth in real app)
    const userId = 'student@example.com';

    const progress = await this.prisma.topicProgress.findMany({
      where: { userId },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return progress.map((p) => ({
      id: p.id,
      topicId: p.topicId,
      completionPercent: p.completionPercent,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      topic: {
        id: p.topic.id,
        title: p.topic.title,
        difficulty: p.topic.difficulty
      },
      chapter: {
        id: p.topic.chapter.id,
        title: p.topic.chapter.title
      },
      subject: {
        id: p.topic.chapter.subject.id,
        name: p.topic.chapter.subject.name,
        classLevel: p.topic.chapter.subject.classLevel
      }
    }));
  }

  async updateProgress(createProgressDto: CreateProgressDto): Promise<TopicProgressDto> {
    // For MVP, assume user ID is hardcoded (would come from auth in real app)
    const userId = 'student@example.com';

    const progress = await this.prisma.topicProgress.upsert({
      where: {
        userId_topicId: {
          userId,
          topicId: createProgressDto.topicId
        }
      },
      update: {
        completionPercent: createProgressDto.completionPercent
      },
      create: {
        userId,
        topicId: createProgressDto.topicId,
        completionPercent: createProgressDto.completionPercent
      },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true }
            }
          }
        }
      }
    });

    return {
      id: progress.id,
      topicId: progress.topicId,
      completionPercent: progress.completionPercent,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
      topic: {
        id: progress.topic.id,
        title: progress.topic.title,
        difficulty: progress.topic.difficulty
      },
      chapter: {
        id: progress.topic.chapter.id,
        title: progress.topic.chapter.title
      },
      subject: {
        id: progress.topic.chapter.subject.id,
        name: progress.topic.chapter.subject.name,
        classLevel: progress.topic.chapter.subject.classLevel
      }
    };
  }
}
