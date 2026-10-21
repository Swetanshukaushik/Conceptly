import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  QuizDetailDto,
  QuizSubmissionRequestDto,
  QuizSubmissionResultDto,
  UserProfileDto,
} from '../../contracts';

@ApiTags('quizzes')
@Controller('topics/:topicId/quiz')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @ApiOperation({ summary: 'Get quiz questions for a topic' })
  @ApiResponse({ status: 200 })
  async getQuizByTopic(@Param('topicId') topicId: string): Promise<QuizDetailDto> {
    return this.quizzesService.getQuizByTopic(topicId);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit answers for evaluation and update progress' })
  @ApiResponse({ status: 200 })
  async submitQuiz(
    @Param('topicId') topicId: string,
    @Body() dto: QuizSubmissionRequestDto,
    @CurrentUser() user: UserProfileDto
  ): Promise<QuizSubmissionResultDto> {
    // Ensure topicId is consistent
    dto.topicId = topicId;
    return this.quizzesService.submitQuiz(user.id, dto);
  }
}
