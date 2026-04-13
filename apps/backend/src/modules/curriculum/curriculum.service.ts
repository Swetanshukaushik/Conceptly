import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ExamType } from '@prisma/client';
import { ClassLevelDto } from './dto/class-level.dto';
import { SubjectSummaryDto } from './dto/subject-summary.dto';
import { ChapterDto } from './dto/chapter.dto';
import { TopicDto } from './dto/topic.dto';
import { TopicDetailDto } from './dto/topic-detail.dto';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  async getExamTypes(): Promise<{ examType: string; label: string }[]> {
    // Return available exam types
    return [
      { examType: 'SCHOOL', label: 'School Curriculum' },
      { examType: 'UPSC', label: 'UPSC Preparation' },
      { examType: 'IIT_JEE', label: 'IIT JEE Preparation' },
      { examType: 'NEET', label: 'NEET Preparation' }
    ];
  }

  async getClassLevels(): Promise<ClassLevelDto[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { examType: 'SCHOOL' },
      distinct: ['classLevel'],
      select: {
        classLevel: true
      },
      orderBy: {
        classLevel: 'asc'
      }
    });

    return subjects
      .filter(subject => subject.classLevel !== null)
      .map((subject) => ({
        classLevel: subject.classLevel!,
        label: `Class ${subject.classLevel}`
      }));
  }

  async getSubjectsByClassLevel(classLevel: number): Promise<SubjectSummaryDto[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { examType: 'SCHOOL', classLevel },
      orderBy: { name: 'asc' },
      include: {
        chapters: {
          select: {
            id: true
          }
        }
      }
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      classLevel: subject.classLevel,
      chapterCount: subject.chapters.length
    }));
  }

  async getSubjectsByExamType(examType: string): Promise<SubjectSummaryDto[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { examType: examType as ExamType },
      orderBy: { name: 'asc' },
      include: {
        chapters: {
          select: {
            id: true
          }
        }
      }
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      classLevel: subject.classLevel ?? undefined,
      chapterCount: subject.chapters.length
    }));
  }

  async getChaptersBySubject(subjectId: string): Promise<ChapterDto[]> {
    const chapters = await this.prisma.chapter.findMany({
      where: { subjectId },
      orderBy: { order: 'asc' },
      include: {
        topics: {
          select: {
            id: true
          }
        }
      }
    });

    return chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.order,
      topicCount: chapter.topics.length
    }));
  }

  async getTopicsByChapter(chapterId: string): Promise<TopicDto[]> {
    const topics = await this.prisma.topic.findMany({
      where: { chapterId },
      orderBy: { title: 'asc' },
      include: {
        reels: {
          select: {
            id: true
          }
        }
      }
    });

    return topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      difficulty: topic.difficulty,
      chapterId: topic.chapterId,
      reelCount: topic.reels.length
    }));
  }

  async getTopicById(topicId: string): Promise<TopicDetailDto> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        chapter: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!topic) {
      throw new NotFoundException(`Topic not found for id: ${topicId}`);
    }

    const reelCount = await this.prisma.reel.count({
      where: { topicId }
    });

    return {
      id: topic.id,
      title: topic.title,
      difficulty: topic.difficulty,
      chapterId: topic.chapterId,
      reelCount,
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
}
