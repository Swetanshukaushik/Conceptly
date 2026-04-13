import { ApiProperty } from '@nestjs/swagger';

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

export class TopicDetailDto {
  @ApiProperty({ example: 'math-7-topic-1' })
  id: string;

  @ApiProperty({ example: 'Integers and Whole Numbers' })
  title: string;

  @ApiProperty({ example: 'medium' })
  difficulty: string;

  @ApiProperty({ example: 'math-7-chapter-1' })
  chapterId: string;

  @ApiProperty({ type: ChapterReference })
  chapter: ChapterReference;

  @ApiProperty({ type: SubjectReference })
  subject: SubjectReference;

  @ApiProperty({ example: 2 })
  reelCount: number;
}
