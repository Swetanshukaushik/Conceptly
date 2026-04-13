import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ReelDto } from './dto/reel.dto';

@Injectable()
export class ReelsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReelsByTopic(topicId: string): Promise<ReelDto[]> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true }
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
              include: { subject: true }
            }
          }
        }
      }
    });

    return reels.map((reel) => ({
      id: reel.id,
      title: reel.title,
      videoUrl: reel.videoUrl,
      durationSec: reel.durationSec,
      topicId: reel.topicId,
      topic: {
        id: reel.topic.id,
        title: reel.topic.title,
        difficulty: reel.topic.difficulty
      },
      chapter: {
        id: reel.topic.chapter.id,
        title: reel.topic.chapter.title
      },
      subject: {
        id: reel.topic.chapter.subject.id,
        name: reel.topic.chapter.subject.name,
        classLevel: reel.topic.chapter.subject.classLevel
      }
    }));
  }

  async getReelById(id: string): Promise<ReelDto> {
    const reel = await this.prisma.reel.findUnique({
      where: { id },
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

    if (!reel) {
      throw new NotFoundException(`Reel not found for id: ${id}`);
    }

    return {
      id: reel.id,
      title: reel.title,
      videoUrl: reel.videoUrl,
      durationSec: reel.durationSec,
      topicId: reel.topicId,
      topic: {
        id: reel.topic.id,
        title: reel.topic.title,
        difficulty: reel.topic.difficulty
      },
      chapter: {
        id: reel.topic.chapter.id,
        title: reel.topic.chapter.title
      },
      subject: {
        id: reel.topic.chapter.subject.id,
        name: reel.topic.chapter.subject.name,
        classLevel: reel.topic.chapter.subject.classLevel
      }
    };
  }
}
