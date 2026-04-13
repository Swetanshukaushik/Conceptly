import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { QuizDto } from './dto/quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async getQuizByTopic(topicId: string): Promise<QuizDto> {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true, title: true }
    });

    if (!topic) {
      throw new NotFoundException(`Topic not found for id: ${topicId}`);
    }

    const quizQuestions = await this.prisma.quizQuestion.findMany({
      where: { reel: { topicId } },
      include: { reel: true },
      orderBy: { createdAt: 'asc' }
    });

    if (quizQuestions.length === 0) {
      throw new NotFoundException(`No quiz questions found for topic: ${topicId}`);
    }

    const questions = quizQuestions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: JSON.parse(q.optionsJson) as string[],
      reelId: q.reelId,
      reelTitle: q.reel.title
    }));

    return {
      topicId,
      topicTitle: topic.title,
      questions
    };
  }
}
