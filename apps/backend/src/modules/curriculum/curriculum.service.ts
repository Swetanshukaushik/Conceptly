import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ExamType } from '@prisma/client';
import {
  ExamTypeInfoDto,
  ClassLevelDto,
  SubjectSummaryDto,
  ChapterSummaryDto,
  TopicSummaryDto,
  TopicDetailDto,
  FlashcardDto,
  DifficultyLevel,
} from '../../contracts';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  async getExamTypes(): Promise<ExamTypeInfoDto[]> {
    return [
      {
        id: 'TECH',
        label: 'Software Engineering & System Design',
        description: 'Distributed systems, consensus, caching, low-latency architectures.',
        icon: '💻',
        popularTopics: ['CAP Theorem', 'Cache Invalidation', 'Raft Consensus'],
      },
      {
        id: 'PM',
        label: 'Product Management & Strategy',
        description: 'CIRCLES framework, North Star metrics, A/B experiment design.',
        icon: '🎯',
        popularTopics: ['CIRCLES Framework', 'North Star Metric', 'GTM Strategy'],
      },
      {
        id: 'FINANCE',
        label: 'Quantitative Finance & Valuation',
        description: 'Discounted Cash Flow (DCF), LBO multiples, option pricing.',
        icon: '📈',
        popularTopics: ['DCF Valuation', 'WACC Mechanics', 'LBO Modeling'],
      },
      {
        id: 'UPSC',
        label: 'UPSC Civil Services',
        description: 'Polity & Constitution, Macroeconomics, Indian Modern History.',
        icon: '🏛️',
        popularTopics: ['Article 32 & Writs', 'Fiscal Deficit', '1857 Revolt'],
      },
      {
        id: 'IIT_JEE',
        label: 'IIT-JEE (Advanced)',
        description: 'Rotational dynamics, organic synthesis, calculus proofs.',
        icon: '⚛️',
        popularTopics: ['Moment of Inertia', 'SN1 vs SN2', 'Definite Integrals'],
      },
      {
        id: 'NEET',
        label: 'NEET Medical Entrance',
        description: 'Cardiac cycle, Mendelian genetics, chemical bonding.',
        icon: '🧬',
        popularTopics: ['Cardiac Cycle ECG', 'DNA Transcription', 'Glycolysis'],
      },
      {
        id: 'SCHOOL',
        label: 'CBSE Foundations (Class 6-10)',
        description: 'NCERT aligned high-yield video summaries and flashcards.',
        icon: '📚',
        popularTopics: ['Real Numbers', 'Light & Optics', 'Acids & Bases'],
      },
    ];
  }

  async getClassLevels(): Promise<ClassLevelDto[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { examType: 'SCHOOL' },
      distinct: ['classLevel'],
      select: { classLevel: true },
      orderBy: { classLevel: 'asc' },
    });

    const existingLevels = subjects
      .filter((s) => s.classLevel !== null)
      .map((s) => s.classLevel as number);

    // Ensure 6, 7, 8, 9, 10 are represented
    const allLevels = Array.from(new Set([...existingLevels, 6, 7, 8, 9, 10])).sort(
      (a, b) => a - b
    );

    return allLevels.map((lvl) => ({
      id: lvl,
      label: {
        en: `Class ${lvl}`,
        hi: `कक्षा ${lvl}`,
      },
    }));
  }

  async getSubjectsByClassLevel(classLevel: number): Promise<SubjectSummaryDto[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { examType: 'SCHOOL', classLevel },
      orderBy: { name: 'asc' },
      include: {
        chapters: {
          select: { id: true },
        },
      },
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      label: {
        en: subject.labelEn || subject.name,
        hi: subject.labelHi || subject.name,
      },
      examType: subject.examType as any,
      classLevel: subject.classLevel ?? undefined,
      chapterCount: subject.chapters.length,
      iconName: subject.iconName ?? 'book-outline',
    }));
  }

  async getSubjectsByExamType(examTypeStr: string): Promise<SubjectSummaryDto[]> {
    // Normalize aliases like TECH_INTERVIEW -> TECH
    let normalizedExamType = examTypeStr.toUpperCase();
    if (normalizedExamType.includes('TECH')) normalizedExamType = 'TECH';
    if (normalizedExamType.includes('PM')) normalizedExamType = 'PM';
    if (normalizedExamType.includes('FIN')) normalizedExamType = 'FINANCE';
    if (normalizedExamType.includes('JEE')) normalizedExamType = 'IIT_JEE';

    const subjects = await this.prisma.subject.findMany({
      where: { examType: normalizedExamType as ExamType },
      orderBy: { name: 'asc' },
      include: {
        chapters: {
          select: { id: true },
        },
      },
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      label: {
        en: subject.labelEn || subject.name,
        hi: subject.labelHi || subject.name,
      },
      examType: subject.examType as any,
      classLevel: subject.classLevel ?? undefined,
      chapterCount: subject.chapters.length,
      iconName: subject.iconName ?? 'school-outline',
    }));
  }

  async getChaptersBySubject(subjectId: string): Promise<ChapterSummaryDto[]> {
    const chapters = await this.prisma.chapter.findMany({
      where: { subjectId },
      orderBy: { order: 'asc' },
      include: {
        topics: {
          select: { id: true },
        },
      },
    });

    return chapters.map((c) => ({
      id: c.id,
      subjectId: c.subjectId,
      title: {
        en: c.titleEn,
        hi: c.titleHi,
      },
      order: c.order,
      topicCount: c.topics.length,
    }));
  }

  async getTopicsByChapter(chapterId: string): Promise<TopicSummaryDto[]> {
    const topics = await this.prisma.topic.findMany({
      where: { chapterId },
      orderBy: { title: 'asc' },
      include: {
        reels: {
          select: { id: true },
        },
      },
    });

    return topics.map((t) => ({
      id: t.id,
      chapterId: t.chapterId,
      title: t.title,
      difficulty: (t.difficulty as DifficultyLevel) || 'medium',
      reelCount: t.reels.length,
    }));
  }

  async getTopicById(topicId: string): Promise<TopicDetailDto> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
        reels: {
          select: { id: true },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException(`Topic not found for id: ${topicId}`);
    }

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
      reelCount: topic.reels.length,
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

  async getTopicFlashcards(topicId: string): Promise<FlashcardDto[]> {
    const flashcards = await this.prisma.flashcard.findMany({
      where: { topicId },
    });

    return flashcards.map((fc) => {
      let bullets: string[] | undefined;
      if (fc.bulletsJson) {
        try {
          bullets = JSON.parse(fc.bulletsJson);
        } catch {
          bullets = undefined;
        }
      }
      return {
        id: fc.id,
        topicId: fc.topicId,
        frontQuestion: fc.frontQuestion,
        backAnswer: fc.backAnswer,
        bullets,
      };
    });
  }
}
