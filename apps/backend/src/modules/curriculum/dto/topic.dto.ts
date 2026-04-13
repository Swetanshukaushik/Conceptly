import { ApiProperty } from '@nestjs/swagger';

export class TopicDto {
  @ApiProperty({ example: 'math-7-topic-1' })
  id: string;

  @ApiProperty({ example: 'Integers and Whole Numbers' })
  title: string;

  @ApiProperty({ example: 'medium' })
  difficulty: string;

  @ApiProperty({ example: 'math-7-chapter-1' })
  chapterId: string;

  @ApiProperty({ example: 2 })
  reelCount: number;
}
