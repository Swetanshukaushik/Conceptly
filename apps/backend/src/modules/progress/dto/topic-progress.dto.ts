import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

class TopicReference {
  @ApiProperty({ example: 'math-7-topic-1' })
  id: string;

  @ApiProperty({ example: 'Integers and Whole Numbers' })
  title: string;

  @ApiProperty({ example: 'medium' })
  difficulty: string;
}

class ChapterReference {
  @ApiProperty({ example: 'math-7-chapter-1' })
  id: string;

  @ApiProperty({ example: 'Number Systems' })
  title: string;
}

class SubjectReference {
  @ApiProperty({ example: 'math-7' })
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  name: string;

  @ApiProperty({ example: 7 })
  classLevel: number;
}

export class TopicProgressDto {
  @ApiProperty({ example: 'progress-1' })
  id: string;

  @ApiProperty({ example: 'math-7-topic-1' })
  topicId: string;

  @ApiProperty({ example: 75 })
  completionPercent: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: TopicReference })
  topic: TopicReference;

  @ApiProperty({ type: ChapterReference })
  chapter: ChapterReference;

  @ApiProperty({ type: SubjectReference })
  subject: SubjectReference;
}

export class CreateProgressDto {
  @IsString()
  @ApiProperty({ example: 'math-7-topic-1' })
  topicId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @ApiProperty({ example: 75 })
  completionPercent: number;
}
