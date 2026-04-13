import { ApiProperty } from '@nestjs/swagger';

class QuizQuestionDto {
  @ApiProperty({ example: 'quiz-1' })
  id: string;

  @ApiProperty({ example: 'Which of these is an integer?' })
  prompt: string;

  @ApiProperty({ example: ['2.5', '−3', '1/2', 'π'] })
  options: string[];

  @ApiProperty({ example: 'math-7-reel-1' })
  reelId: string;

  @ApiProperty({ example: 'Integers: What They Are' })
  reelTitle: string;
}

export class QuizDto {
  @ApiProperty({ example: 'math-7-topic-1' })
  topicId: string;

  @ApiProperty({ example: 'Integers and Whole Numbers' })
  topicTitle: string;

  @ApiProperty({ type: [QuizQuestionDto] })
  questions: QuizQuestionDto[];
}
