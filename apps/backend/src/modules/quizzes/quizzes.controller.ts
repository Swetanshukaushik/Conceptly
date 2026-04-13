import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { QuizDto } from './dto/quiz.dto';

@ApiTags('quizzes')
@Controller('topics/:topicId/quiz')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @ApiOkResponse({ type: QuizDto })
  async getQuizByTopic(@Param('topicId') topicId: string) {
    return this.quizzesService.getQuizByTopic(topicId);
  }
}
